//
// Provisioner - (c) 2018 University of Technology Sydney
//
// Tests for sails-hook-redbox-provisioner


const chai = require('chai');
const chaiFiles = require('chai-files');

chai.use(chaiFiles);

const expect = chai.expect;
var file = chaiFiles.file;

const path = require('path');

const fs = require('fs-extra');
const Sails = require('sails').Sails;
const assert = require('assert');
var supertest = require('supertest');

const FIXTURES = './test/fixtures';
const OUTDIR = './test/output';

const STOREID = 'staging';
const OBJECT = 'object';
const FILE = 'datastream.txt';
const BADFILE = 'not_datastream.txt';

const ProvisionerService = require('../api/services/ProvisionerService');

describe('Basic tests ::', function () {

  // Var to hold a running sails app instance
  var sails;
  // Var to hold the store config
  var store;
  // Before running any tests, attempt to lift Sails
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
        id: STOREID,
        uri: sails.config.provisioner.stores[STOREID]
      };
      return done();
    });
  });

  it('should have a service', function (done) {
    expect(sails.services['ProvisionerService']).to.not.be.empty;
    done();
  });

  it('can get a datastream', function () {
    const ps = sails.services['ProvisionerService'];
    const origpath = path.join(store['uri'], OBJECT, FILE);
    const fpath = path.join(OUTDIR, FILE);
    ps.getDatastream(store, OBJECT, FILE)
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

  it.skip('should have a route', function (done) {
    supertest(sails.hooks.http.app)
      .get('/:branding/:portal/ws/provisioner/hello')
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.text, 'Hello World');
        done();
      });
  });

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
