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
			const dsid = req.param('datastreamId');
			sails.log.info(`getDatastream ${oid} ${dsid}`);
			return this._withRecordStore(oid)
				.flatMap(store => {
					return ProvisionerService.getDatastream(store, oid, dsid)
				}).subscribe(stream => {
					sails.log.info("What are you: " + stream);
					sails.log.info("What are you: " + JSON.stringify(stream));
					sails.log.info("What are you: " + typeof(stream));
					if( !stream ) {
						sails.log.info("Datastream " + oid + '/' + dsid + " not found");
						return Observable.throw(new Error('no-datastream'));
					} else {
						sails.log.info(`returning datastream ${oid} ${dsid}`);
						const rstream = stream as stream.Readable;
						rstream.pipe(res, { end: false });
						rstream.on('end', () => {
							sails.log.info("The end callback was reached");
						 	res.end();
						})
					}
				},
				error => {
					sails.log.error(error);
					return res.json({ "error": error });
				});
		}


		public addDatastream(req, res) {
			const oid = req.param('oid');
			const dsid = req.param('datastreamId');
			return this._withRecordStore(oid)
				.flatMap(store => {
					if( !store ) {
						return Observable.throw(new Error('access denied'));
					}
					const uploadDir = path.join(store, oid);
					return Observable.fromPromise(this._upload(req.file('data'), uploadDir))
				}).subscribe(files => {
					if( !files ) {
						sails.log.warn("Uploaded to " + oid + '/' + dsid + " failed");
						return Observable.throw(new Error('upload-failed'));
					} else {
						return res.json({ "files": files });
					}
				},
				error => {
					sails.log.error(error);
					return res.json({ "error": error });
				});
		}

		protected _upload(, dir): Promise<string[]> {

					req.file('data').upload((err, uploadedFiles) {
						if( err ) return res.serverError(err);
						 
					});

	

		public removeDatastream(req, res) {
			const oid = req.param('oid');
			const dsid = req.param('datastreamId');
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
					return res.json({ "error": error });
				});
		}




	
		public addDatastreams(req, res) {
			return res.json({watch: 'this space'});			
		}

		// public addAndRemoveDatastreams(req, res) {
		// }




	}
}

module.exports = new Controllers.ProvisionerController().exports();
