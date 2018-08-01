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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var uts_provisioner_api_1 = require("uts-provisioner-api");
var services = require("../core/CoreService.js");
var Services;
(function (Services) {
    var ProvisionerService = (function (_super) {
        __extends(ProvisionerService, _super);
        function ProvisionerService() {
            var _this = _super.call(this) || this;
            _this._exportedMethods = [
                'createDataSet',
                'getDataSet',
                'listDatastreams',
                'getDatastream',
                'addDatastream',
                'addPath',
                'delete',
            ];
            return _this;
        }
        ProvisionerService.prototype._config = function () {
        };
        ProvisionerService.prototype.createDataSet = function (store, oid) {
            var fa = this.getFilesApp(store);
            if (fa) {
                return Rx_1.Observable.fromPromise(fa.create(oid));
            }
            else {
                return Rx_1.Observable.of(undefined);
            }
        };
        ProvisionerService.prototype.getDataSet = function (store, oid) {
            var fa = this.getFilesApp(store);
            if (fa) {
                return Rx_1.Observable.fromPromise(fa.find(oid));
            }
            else {
                return Rx_1.Observable.of(undefined);
            }
        };
        ProvisionerService.prototype.listDatastreams = function (store, oid) {
            var fa = this.getFilesApp(store);
            if (fa) {
                return Rx_1.Observable.fromPromise(this.oid_index(fa, oid));
            }
            else {
                return Rx_1.Observable.of(undefined);
            }
        };
        ProvisionerService.prototype.oid_index = function (fa, oid) {
            return __awaiter(this, void 0, void 0, function () {
                var fo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, fa.find(oid)];
                        case 1:
                            fo = _a.sent();
                            if (!fo) return [3, 3];
                            return [4, fo.index()];
                        case 2: return [2, _a.sent()];
                        case 3: return [2, undefined];
                    }
                });
            });
        };
        ProvisionerService.prototype.getDatastream = function (store, oid, dsid) {
            var fa = this.getFilesApp(store);
            if (fa) {
                return Rx_1.Observable.fromPromise(this.oid_stream(fa, oid, dsid));
            }
            else {
                return Rx_1.Observable.of(undefined);
            }
        };
        ProvisionerService.prototype.oid_stream = function (fa, oid, dsid) {
            return __awaiter(this, void 0, void 0, function () {
                var fo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, fa.find(oid)];
                        case 1:
                            fo = _a.sent();
                            if (fo)
                                return [2, fo.export_stream(dsid)];
                            else {
                                return [2, undefined];
                            }
                            return [2];
                    }
                });
            });
        };
        ProvisionerService.prototype.addDatastream = function (store, oid, dsid, st) {
            var fa = this.getFilesApp(store);
            if (fa) {
                return Rx_1.Observable.fromPromise(this.oid_add_stream(fa, oid, dsid, st));
            }
            else {
                return Rx_1.Observable.of(undefined);
            }
        };
        ProvisionerService.prototype.oid_add_stream = function (fa, oid, dsid, st) {
            return __awaiter(this, void 0, void 0, function () {
                var fo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, fa.find(oid)];
                        case 1:
                            fo = _a.sent();
                            if (fo) {
                                return [2, fo.import_stream(dsid, st)];
                            }
                            else {
                                return [2, undefined];
                            }
                            return [2];
                    }
                });
            });
        };
        ProvisionerService.prototype.addPath = function (store, oid, path) {
            var fa = this.getFilesApp(store);
            if (fa) {
                return Rx_1.Observable.fromPromise(this.oid_add_path(fa, oid, path));
            }
            else {
                return Rx_1.Observable.of(undefined);
            }
        };
        ProvisionerService.prototype.oid_add_path = function (fa, oid, path) {
            return __awaiter(this, void 0, void 0, function () {
                var fo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, fa.find(oid)];
                        case 1:
                            fo = _a.sent();
                            if (fo) {
                                return [2, fo.import_path(path)];
                            }
                            else {
                                return [2, undefined];
                            }
                            return [2];
                    }
                });
            });
        };
        ProvisionerService.prototype.delete = function (store, oid, dsid) {
            var fa = this.getFilesApp(store);
            if (fa) {
                return Rx_1.Observable.fromPromise(this.oid_delete_stream(fa, oid, dsid));
            }
            else {
                return Rx_1.Observable.of(undefined);
            }
        };
        ProvisionerService.prototype.oid_delete_stream = function (fa, oid, dsid) {
            return __awaiter(this, void 0, void 0, function () {
                var fo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, fa.find(oid)];
                        case 1:
                            fo = _a.sent();
                            if (fo) {
                                return [2, fo.delete(dsid)];
                            }
                            else {
                                return [2, undefined];
                            }
                            return [2];
                    }
                });
            });
        };
        ProvisionerService.prototype.getFilesApp = function (scf) {
            return new uts_provisioner_api_1.FilesApp(scf['id'], scf['uri']);
        };
        return ProvisionerService;
    }(services.Services.Core.Service));
    Services.ProvisionerService = ProvisionerService;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.ProvisionerService().exports();
