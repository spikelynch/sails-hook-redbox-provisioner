// utilities for test fixtures

const fs = require('fs-extra');
const path = require('path');

const FIXTURES = './test/fixtures';
const OUTPUT = './test/output';


const OBJECTS = [
  'object1',
  'object2'
];

const FILES = [
  './test/files/ds1.txt',
  './test/files/ds2.txt',
  './test/files/ds3.jpg'
];


module.exports = {

  OUTPUT: './test/output',

  STORES: {
    staging: path.join(FIXTURES, 'staging'),
    public: path.join(FIXTURES, 'public')
  },

  buildup: function (dir) {
    fs.ensureDirSync(dir);
    empty_dir(dir);
  },

  teardown: function (dir) {
    empty_dir(dir);
  }

};

function empty_dir(dir) {
  var contents = fs.readdirSync(dir);
  for( var i = 0; i < contents.length; i++ ) {
    if( contents[i] != '.' && contents[i] != '..' ) {
        var fn = path.join(dir, contents[i]);
        fs.removeSync(fn);
    }
  }
}



const STORES = {
  staging: path.join(FIXTURES, 'staging'),
  public: path.join(FIXTURES, 'public')
};


const STAGING_DIR = path.join(FIXTURES, 'staging');
const PUBLIC_DIR = path.join(FIXTURES, 'public');

const STOREID = 'staging';
const OBJECT = 'object';

const FILE = 'datastream.txt';
const INDEX = [ 'datastream.txt', 'datastream2.txt' ];

const BADFILE = 'not_datastream.txt';



