
import {Sails, Model} from 'sails';
import { Observable } from 'rxjs/Rx';
import { FilesApp, FilesDataSet, IDataSet } from 'uts-provisioner-api';

import * as stream from 'stream';

import services = require('../core/CoreService.js');

declare var RecordsService, BrandingService;
declare var sails: Sails;
declare var _this;


export module Services {

  export class ProvisionerService extends services.Services.Core.Service {

    protected _exportedMethods: any = [
      'createDataSet',
      'getDataSet',
      'listDatastreams',
      'getDatastream',
      'addDatastream',
      'addPath',
      'delete',
    ];

    constructor() {
      super();
    }

    public _config() {

    }


    public createDataSet(store: Object, oid: string): Observable<IDataSet|undefined> {
      const fa = this.getFilesApp(store);
      if( fa ) {
        return Observable.fromPromise(fa.create(oid));
      } else {
        return Observable.of(undefined);
      }
    }

    public getDataSet(store: Object, oid: string): Observable<IDataSet|undefined> {
      const fa = this.getFilesApp(store);
      if( fa ) {
        return Observable.fromPromise(fa.find(oid))
      } else {
        return Observable.of(undefined);
      }
    }


    public listDatastreams(store: Object, oid: string): Observable<string[]|undefined> {
      const fa = this.getFilesApp(store);
      if( fa ) {
        return Observable.fromPromise(this.oid_index(fa, oid));
      } else {
        return Observable.of(undefined);
      }
    }

    async oid_index(fa: FilesApp, oid: string): Promise<string[]|undefined> {
      const fo = await fa.find(oid);
      if( fo ) {
        return await fo.index();
      } else {
        return undefined
      }
    }

// trying to throw the error from here

    public getDatastream(store: Object, oid: string, dsid: string): Observable<stream.Readable> {
      const fa = this.getFilesApp(store);
      if( fa ) {
        return Observable.fromPromise(this.oid_stream(fa, oid, dsid));
      } else {
        return Observable.throw("an error");
      }
    }

    async oid_stream(fa: FilesApp, oid: string, dsid: string): Promise<stream.Readable|undefined> {
      const fo = await fa.find(oid);
      if( fo )
        return fo.export_stream(dsid)
      else {
        return undefined;
      }
    }




    public addDatastream(store: Object, oid: string, dsid: string, st: stream.Readable): Observable<string|undefined> {
      const fa = this.getFilesApp(store);
      if( fa ) {
        return Observable.fromPromise(this.oid_add_stream(fa, oid, dsid, st));
      } else {
        return Observable.of(undefined);
      }
    }

    async oid_add_stream(fa: FilesApp, oid: string, dsid: string, st: stream.Readable): Promise<string> {
      const fo = await fa.find(oid);
      if( fo ) {
        return fo.import_stream(dsid, st);
      } else {
        return undefined;
      }
    }

    public addPath(store: Object, oid: string, path: string): Observable<string|undefined> {
      const fa = this.getFilesApp(store);
      if( fa ) {
        return Observable.fromPromise(this.oid_add_path(fa, oid, path));
      } else {
        return Observable.of(undefined);
      }
    }

    async oid_add_path(fa: FilesApp, oid: string, path: string): Promise<string> {
      const fo = await fa.find(oid);
      if( fo ) {
        return fo.import_path(path);
      } else {
        return undefined;
      }
    }


    // NOTE: this will nuke anything it's called on
    // this needs to respect dataset immutability 

    public delete(store: Object, oid: string, dsid: string): Observable<boolean> {
      const fa = this.getFilesApp(store);
      if( fa ) {
        return Observable.fromPromise(this.oid_delete_stream(fa, oid, dsid));
      } else {
        return Observable.of(undefined);
      }
    }

    async oid_delete_stream(fa: FilesApp, oid: string, dsid: string): Promise<boolean> {
      const fo = await fa.find(oid);
      if( fo ) {
        return fo.delete(dsid);
      } else {
        return undefined;
      }
    }


    protected getFilesApp(scf: Object): FilesApp {
      return new FilesApp(scf['id'], scf['uri']);
    }
  }
}



module.exports = new Services.ProvisionerService().exports();