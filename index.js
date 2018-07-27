const _ = require('lodash');

const ProvisionerController = require('./api/controllers/ProvisionerController');
const ProvisionerService = require('./api/services/ProvisionerService');
const ProvisionerConfig = require('./config/provisioner.js');

module.exports = function (sails) {
  return {
    initialize: function (cb) {
      // Do Some initialisation tasks
      // This can be for example: copy files or images to the redbox-portal front end
      return cb();
    },
    //If each route middleware do not exist sails.lift will fail during hook.load()
    routes: {
      before: {},
      after: {
        'get /:branding/:portal/ws/provisioner/hello': ProvisionerController.helloWorld
      }
    },
    configure: function () {
      sails.services['ProvisionerService'] = ProvisionerService;
      sails.config = _.merge(sails.config, ProvisionerConfig);
    }
  }
};
