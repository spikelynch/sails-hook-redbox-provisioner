"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var controller = require("../core/CoreController.js");
var Controllers;
(function (Controllers) {
    var ProvisionerController = (function (_super) {
        __extends(ProvisionerController, _super);
        function ProvisionerController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._exportedMethods = [
                'getDatastream',
                'addDatastream',
                'removeDatastream',
                'addDatastreams',
                'addAndRemoveDatastreams',
                'listDatastreams'
            ];
            return _this;
        }
        ProvisionerController.prototype.bootstrap = function () {
        };
        ProvisionerController.prototype.getDatastream = function (req, res) {
            var oid = req.param('oid');
            var dsid = req.param('datastreamId');
            var store = {
                id: 'staging',
                uri: sails.config.provisioner.stores['staging']
            };
            return ProvisionerService.getDataSet(store, oid)
                .flatMap(function (dataset) {
                if (!dataset) {
                    sails.log.verbose("Object " + oid + " has no dataset");
                    return Rx_1.Observable.throw(new Error('no-dataset'));
                }
                else {
                    res.set('Content-Type', 'application/octet-stream');
                    res.set('Content-Disposition', "attachment; filename=" + dsid);
                    sails.log.verbose("returning datastream " + oid + " " + dsid);
                    return ProvisionerService.getDatastream(store, oid, dsid)
                        .flatMap(function (stream) {
                        stream.pipe(res).on('finish', function () {
                            return Rx_1.Observable.of(oid);
                        });
                    });
                }
            }).subscribe(function (whatever) { }, function (error) {
                res.notFound();
            });
        };
        ProvisionerController.prototype.addDatastream = function (req, res) {
        };
        ProvisionerController.prototype.removeDatastream = function (req, res) {
        };
        ProvisionerController.prototype.addDatastreams = function (req, res) {
        };
        ProvisionerController.prototype.addAndRemoveDatastreams = function (req, res) {
        };
        ProvisionerController.prototype.listDatastreams = function (req, res) {
        };
        return ProvisionerController;
    }(controller.Controllers.Core.Controller));
    Controllers.ProvisionerController = ProvisionerController;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.ProvisionerController().exports();
