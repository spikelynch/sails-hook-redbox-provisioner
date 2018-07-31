// utilities for test fixtures

const fs = require('fs-extra');
const path = require('path');

const FIXTURES = './test/fixtures';
const OUTPUT = './test/output';


const OBJECTS = [
  'object1',
  'object2'
];



module.exports = {

  FILES: {
    'ds1.txt': './test/files/ds1.txt',
    'ds2.txt': './test/files/ds2.txt',
    'ds3.jpg': './test/files/ds3.jpg'
  },


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





