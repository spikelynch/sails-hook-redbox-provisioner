// Copyright (c) 2018 University of Technology Sydney
//
// GNU GENERAL PUBLIC LICENSE
//    Version 2, June 1991
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

// TODO: do the hook in js because tests will work

declare var module;
declare var sails;

import { Observable } from 'rxjs/Rx';

import * as stream from 'stream';


declare var BrandingService, RecordsService, RecordTypesService, User, ProvisionerService;

import controller = require('../core/CoreController.js'); 


export module Controllers {
	/**
	 * Provisioner web endpoint
	 *
	 * Author: Mike Lynch
	 */
	export class ProvisionerController extends controller.Controllers.Core.Controller {

		// these match the API configured in config/record.js in redbox-portal

		protected _exportedMethods: any = [
			'getDatastream',
			'helloWorld',
			'testParam',
			'listDatastreams',
			'addDatastream',
			'removeDatastream'
			// 'addDatastreams',
			// 'addAndRemoveDatastreams',   //not in use
		];


		public bootstrap() {
		}

		public helloWorld(req, res) {
			sails.log.info("Called sails-hook-redbox-provisioner hello world");
			sails.log.info("req " + req);
			sails.log.info("req properties" + JSON.stringify(Object.getOwnPropertyNames(req)));
			sails.log.info("req.user " + req.user);
			const authen = req.isAuthenticated();			
			return res.json({ hello: "hello, world", status: "this has been updated" });
		}


		public testParam(req, res) {
			sails.log.info("Called sails-hook-redbox-provisioner test_param");
			const param = req.param('var');
			return res.json({ hello: "hello, world", var: param});
		}


		// _allowAccess checks if the user has view or edit permissions
		// over the record, and returns the correct store object
		// based on the record's type and workflow

		protected _withRecordStore(oid: string): Observable<Object> {
			return RecordsService.getMeta(oid)
				.flatMap(record => {
						return Observable.of(this._store(record));
					});
		}

		// _store returns the storage FilesApp this record is using
		// for now it just returns staging
		// TODO: make this apply a rule mapping recordtype + workflow
		// stage to document store

		protected _store(stage: string): Object {
			return { 
				id: 'staging',
				uri: sails.config.provisioner.stores['staging']
			}
		}


		public listDatastreams(req, res) {
			const oid = req.param('oid');
			return this._withRecordStore(oid)
				.flatMap(store => {
					return ProvisionerService.listDatastreams(store, oid)
				})
				.subscribe(index => {
					sails.log.info("listDatastreams = " + JSON.stringify(index)); 
					if( !index ) {
						return res.json([]);
					} else {
						return res.json(index)
					}
				},
				error => {
					sails.log.error(error);
					res.json({ "error": error });
				});
		}


		public getDatastream(req, res) {
			const oid = req.param('oid');
			const dsid = req.param('dsid');
			return this._withRecordStore(oid)
				.flatMap(store => {
					return ProvisionerService.getDatastream(store, oid, dsid)
				}).flatMap(stream => {
					if( !stream ) {
						sails.log.verbose("Datastream " + oid + '/' + dsid + " not found");
						return Observable.throw(new Error('no-datastream'));
					} else {
						const sstream = stream as stream.Readable;
						res.set('Content-Type', 'application/octet-stream');
						res.set('Content-Disposition', `attachment; filename=${dsid}`);
						sails.log.verbose(`returning datastream ${oid} ${dsid}`);
						sstream.pipe(res).on('finish', () => {
								return Observable.of(dsid);
						});
					}
				}).subscribe(
					whatever => {},
					error => {
						sails.log.error(error);
						res.json({ "error": error });
					});
		}


		public addDatastream(req, res) {
			const oid = req.param('oid');
			const dsid = req.param('dsid');
			return this._withRecordStore(oid)
				.flatMap(store => {
					if( !store ) {
						return Observable.throw(new Error('access denied'));
					}
					const stream = req.file('data');  // check parameter
					return ProvisionerService.addDatastream(store, oid, dsid, stream)
				}).subscribe(path => {
					if( !path ) {
						sails.log.warn("Uploaded to " + oid + '/' + dsid + " failed");
						return Observable.throw(new Error('upload-failed'));
					} else {
						return res.json({ "path": path });
					}
				},
				error => {
					sails.log.error(error);
					res.json({ "error": error });
				});
		}
	

		public removeDatastream(req, res) {
			const oid = req.param('oid');
			const dsid = req.param('dsid');
			return this._withRecordStore(oid)
				.flatMap(store => {
					// this needs more precautions for immutable stores
					return ProvisionerService.removeDatastream(store, oid, dsid)
				}).subscribe(success => {
					if( !success ) {
						sails.log.verbose("Removal of " + oid + '/' + dsid + " failed");
						return Observable.throw(new Error('delete-failed'));
					} else {
						return res.json({ "deleted": success });
					}
				},
				error => {
					sails.log.error(error);
					res.json({ "error": error });
				});
		}




	
		// public addDatastreams(req, res) {
		// }

		// public addAndRemoveDatastreams(req, res) {
		// }




	}
}

module.exports = new Controllers.ProvisionerController().exports();
