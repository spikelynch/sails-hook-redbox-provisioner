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

    // Note that all routes except for list need a datastreamId parameter.
    routes: {
      before: {},
      after: {
        'get /:branding/:portal/ws/provisioner/list/:oid': ProvisionerController.listDatastreams,
        'get /:branding/:portal/ws/provisioner/datastream/:oid': ProvisionerController.getDatastream,
        'post /:branding/:portal/ws/provisioner/datastream/:oid': ProvisionerController.addDatastream,
//        'put /:branding/:portal/ws/provisioner/datasteram:oid': ProvisionerController.addDatastreams,
        'delete /:branding/:portal/ws/provisioner/datastream/:oid': ProvisionerController.removeDatastream,
        'get /:branding/:portal/ws/provisioner/hello_world': ProvisionerController.helloWorld
      }
    },
    configure: function () {
      sails.services['ProvisionerService'] = ProvisionerService;
      sails.config = _.merge(sails.config, provisionerConfig);
    }
  }
};
