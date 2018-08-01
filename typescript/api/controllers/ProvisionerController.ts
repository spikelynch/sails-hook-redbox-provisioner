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


declare var BrandingService, ProvisionerService;

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
			'addDatastream',
			'removeDatastream',
			'addDatastreams',
			'addAndRemoveDatastreams',   //not in use
			'listDatastreams'
		];


		public bootstrap() {
		}

		public getDatastream(req, res) {
			const oid = req.param('oid');
			const dsid = req.param('datastreamId');
			const store = { 
				id: 'staging',
				uri: sails.config.provisioner.stores['staging']
			};
			return ProvisionerService.getDataSet(store, oid)
				.flatMap(dataset => {
					if( !dataset ) {
						sails.log.verbose("Object " + oid + " has no dataset");
						return Observable.throw(new Error('no-dataset'));
					} else {
						res.set('Content-Type', 'application/octet-stream');
						res.set('Content-Disposition', `attachment; filename=${dsid}`);
						sails.log.verbose(`returning datastream ${oid} ${dsid}`);
						return ProvisionerService.getDatastream(store, oid, dsid)
							.flatMap(stream => {
								stream.pipe(res).on('finish', () => {
									return Observable.of(oid);
								});
							});
					}
				}).subscribe(
					whatever => {},
					error => {
						res.notFound();
					});
		
		}

		public addDatastream(req, res) {
		}

		public removeDatastream(req, res) {
		}

		public addDatastreams(req, res) {
		}

		public addAndRemoveDatastreams(req, res) {
		}

		public listDatastreams(req, res) {

		}



	}
}

module.exports = new Controllers.ProvisionerController().exports();
