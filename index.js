const _ = require('lodash');

const ProvisionerService = require('./api/services/ProvisionerService');
const ProvisionerController = require('./api/controllers/ProvisionerController');
const provisionerConfig = require('./config/provisioner.js');

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
        'get /:branding/:portal/ws/provisioner/datastream/:oid': ProvisionerController.getDatastream,
        'post /:branding/:portal/ws/provisioner/datastream/:oid': ProvisionerController.addDatastream,
        'delete /:branding/:portal/ws/provisioner/datastream/:oid': ProvisionerController.removeDatastream,
        'get /:branding/:portal/ws/provisioner/datastream/:oid/list': ProvisionerController.listDatastreams,
        'get /:branding/:portal/ws/provisioner/hello_world': ProvisionerController.helloWorld,
        'get /:branding/:portal/ws/provisioner/test_param/:var': ProvisionerController.testParam
      }
    },
    configure: function () {
      sails.services['ProvisionerService'] = ProvisionerService;
      sails.config = _.merge(sails.config, provisionerConfig);
    }
  }
};
