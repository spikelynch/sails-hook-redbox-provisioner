//
// Provisioner - (c) 2018 University of Technology Sydney
//
// Tests for sails-hook-redbox-provisioner


const chai = require('chai');
const chaiFiles = require('chai-files');

chai.use(chaiFiles);

const expect = chai.expect;
const file = chaiFiles.file;

const path = require('path');

const fs = require('fs-extra');
const Sails = require('sails').Sails;
const assert = require('assert');
var supertest = require('supertest');

const fixtures = require('./fixtures');

const ProvisionerService = require('../api/services/ProvisionerService');

const DATASET = 'dataset1';

describe('Basic tests ::', function () {

  // Var to hold a running sails app instance
  var sails;
  // Var to hold the store config
  var store;

  // fixture builder - make sure the file stores exist and are 
  // empty

  // reset the fixtures and lift sails
  before(function (done) {


    // Hook will timeout in 10 seconds
    this.timeout(11000);

    // Attempt to lift sails
    Sails().lift({
      hooks: {
        // Load the hook
        "sails-hook-redbox-provisioner": require('../'),
        // Skip grunt (unless your hook uses it)
        "grunt": false
      },
      form: {forms: {}}, //Mock forms to test hook.configure()
      log: {level: "error"}
    }, function (err, _sails) {
      if (err) return done(err);
      sails = _sails;
      store = {
        id: 'staging',
        uri: sails.config.provisioner.stores['staging']
      };
      return done();
    });
  });

  // reset fixtures before each test

  beforeEach(function () {
    fixtures.buildup(fixtures.OUTPUT);
    for( var k in fixtures.STORES ) {
      fixtures.buildup(fixtures.STORES[k]);
    }
  });

  afterEach(function() {
    fixtures.teardown(fixtures.OUTPUT);
    for( var k in fixtures.STORES ) {
      fixtures.teardown(fixtures.STORES[k]);
    }
  });

  it('should have a service', function (done) {
    expect(sails.services['ProvisionerService']).to.not.be.empty;
    done();
  });


  it('can create a dataset', function () {
    const ps = sails.services['ProvisionerService'];
    ps.createDataSet(store, DATASET)
      .subscribe((dataset) => {
        expect(dataset).to.not.be.empty;
        expect(dataset).to.have.property('id').to.equal(DATASET);
      },
      e => {
        console.log("error " + e);
      });

  });


  it.skip('can get a datastream', function () {
    const ps = sails.services['ProvisionerService'];
    const origpath = path.join(store['uri'], DATASET, FILE);
    const fpath = path.join(OUTDIR, FILE);
    ps.getDatastream(store, DATASET, FILE)
      .subscribe((ds) => {
        expect(ds).to.not.be.empty;
        const fstream = fs.createWriteStream(fpath);
        ds.pipe(fstream).on('finish', () => {
          expect(file(fpath)).to.equal(file(origpath));
        });
      },
      e => {
        console.log("error " + e);
      });
  });

  it.skip('can get a list of datastreams', function () {
    const ps = sails.services['ProvisionerService'];
    ps.listDatastreams(store, DATASET)
      .subscribe((idx) => {
        expect(idx).to.have.members(INDEX);
      },
      e => {
        console.log("error " + e);
      });
  });

  it.skip('can add a datastream', function () {
    const ps = sails.services['ProvisionerService'];
    const origpath = path.join(store['uri'], DATASET, FILE);
    const fpath = path.join(OUTDIR, FILE);
    ps.getDatastream(store, DATASET, FILE)
      .subscribe((ds) => {
        expect(ds).to.not.be.empty;
        const fstream = fs.createWriteStream(fpath);
        ds.pipe(fstream).on('finish', () => {
          expect(file(fpath)).to.equal(file(origpath));
        });
      },
      e => {
        console.log("error " + e);
      });

  });


  // routes aren't working because of the fussiness with testing
  // Typescript controllers in sails

  // it.skip('should have a route', function (done) {
  //   supertest(sails.hooks.http.app)
  //     .get('/:branding/:portal/ws/provisioner/hello')
  //     .expect(200)
  //     .end(function (err, res) {
  //       assert.equal(res.text, 'Hello World');
  //       done();
  //     });
  // });

  // After tests are complete, lower Sails
  
  after(function (done) {

    // Lower Sails (if it successfully lifted)
    if (sails) {
      return sails.lower(done);
    }
    // Otherwise just return
    return done();
  });

  // Test that Sails can lift with the hook in place
  it('sails does not crash', function () {
    return true;
  });

});
