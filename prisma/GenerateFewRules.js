"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.generateRoles = exports.bindRoleToPermissions = void 0;
var roles = [{
        name: 'Users Admin',
        guradName: 'users_admin',
        description: 'platform admin role (have access to anywhere)',
        isDeletable: false
    }];
function bindRoleToPermissions(prisma, userId, roleGuradName, permissions) {
    return __awaiter(this, void 0, void 0, function () {
        var data, role, _i, permissions_1, permission, permissionIns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Generate roles Binding seeding ...");
                    data = [];
                    return [4 /*yield*/, prisma.roles.findFirst({
                            where: {
                                guradName: roleGuradName
                            }
                        })];
                case 1:
                    role = _a.sent();
                    _i = 0, permissions_1 = permissions;
                    _a.label = 2;
                case 2:
                    if (!(_i < permissions_1.length)) return [3 /*break*/, 5];
                    permission = permissions_1[_i];
                    return [4 /*yield*/, prisma.permissions.findFirst({
                            where: {
                                guradName: permission
                            }
                        })];
                case 3:
                    permissionIns = _a.sent();
                    data.push({
                        roleId: role.id,
                        permissionId: permissionIns.id,
                        assignedById: userId
                    });
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, prisma.rolesOnPermissions.createMany({
                        data: data,
                        skipDuplicates: true
                    })];
                case 6:
                    _a.sent();
                    console.log("Generate roles Binding finished.");
                    return [2 /*return*/];
            }
        });
    });
}
exports.bindRoleToPermissions = bindRoleToPermissions;
function generateRoles(prisma) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Generate roles seeding ...");
                    return [4 /*yield*/, prisma.roles.createMany({
                            data: roles,
                            skipDuplicates: true
                        })];
                case 1:
                    _a.sent();
                    console.log("Generate roles finished.");
                    return [2 /*return*/];
            }
        });
    });
}
exports.generateRoles = generateRoles;
