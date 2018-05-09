const TemplateService = require('../services/TemplateService');

module.exports = {

  helloWorld: function (req, res, next) {
    const hello = TemplateService.helloWorld();
    return res.send(hello);
  }
};
