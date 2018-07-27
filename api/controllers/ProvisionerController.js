const ProvisionerService = require('../services/ProvisionerService');

module.exports = {

  helloWorld: function (req, res, next) {
    const hello = ProvisionerService.helloWorld();
    return res.send(hello);
  }
};
