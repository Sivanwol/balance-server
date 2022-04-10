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
exports.generateUsers = exports.bindUserToRoleOrPermissions = void 0;
var moment = require("moment");
var bcrypt = require("bcrypt");
var createUser = function (prisma, password) { return __awaiter(void 0, void 0, void 0, function () {
    var user, record, insertId, recordProfile, insertProfileId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = {
                    email: 'sivan+admin@wolberg.pro',
                    verifiedAccessAt: moment().toDate(),
                    verifiedAccessMethod: 'Email',
                    emailVerified: moment().toDate(),
                    mobileVerified: moment().toDate(),
                    mobile: "0541234567",
                    password: password
                };
                return [4 /*yield*/, prisma.user.create({
                        data: user
                    })];
            case 1:
                record = _a.sent();
                insertId = record.id;
                console.log("Created user with id: ".concat(insertId));
                return [4 /*yield*/, prisma.userProfile.create({
                        data: {
                            userId: insertId,
                            firstName: 'admin',
                            lastName: 'admin'
                        }
                    })];
            case 2:
                recordProfile = _a.sent();
                insertProfileId = recordProfile.id;
                console.log("Created user profile with id: ".concat(insertProfileId));
                return [2 /*return*/, insertId];
        }
    });
}); };
function bindUserToRoleOrPermissions(prisma, userId, roles, permissions) {
    return __awaiter(this, void 0, void 0, function () {
        var data, _i, roles_1, roleName, role, _a, permissions_1, permission, permissionIns;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Generate roles Binding seeding ...");
                    data = [];
                    _i = 0, roles_1 = roles;
                    _b.label = 1;
                case 1:
                    if (!(_i < roles_1.length)) return [3 /*break*/, 4];
                    roleName = roles_1[_i];
                    return [4 /*yield*/, prisma.roles.findFirst({
                            where: {
                                guradName: roleName
                            }
                        })];
                case 2:
                    role = _b.sent();
                    data.push({
                        userId: userId,
                        roleId: role.id,
                        assignedById: userId
                    });
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _a = 0, permissions_1 = permissions;
                    _b.label = 5;
                case 5:
                    if (!(_a < permissions_1.length)) return [3 /*break*/, 8];
                    permission = permissions_1[_a];
                    return [4 /*yield*/, prisma.permissions.findFirst({
                            where: {
                                guradName: permission
                            }
                        })];
                case 6:
                    permissionIns = _b.sent();
                    data.push({
                        userId: userId,
                        permissionId: permissionIns.id,
                        assignedById: userId
                    });
                    _b.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log("User Binding", data);
                    return [4 /*yield*/, prisma.userOnRolesOrPermissions.createMany({
                            data: data,
                            skipDuplicates: true
                        })];
                case 9:
                    _b.sent();
                    console.log("Generate roles Binding finished.");
                    return [2 /*return*/];
            }
        });
    });
}
exports.bindUserToRoleOrPermissions = bindUserToRoleOrPermissions;
function generateUsers(prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, adminUserId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Generate Users seeding ...");
                    return [4 /*yield*/, bcrypt.hash("cp@12345-Admin", 10)];
                case 1:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, createUser(prisma, hashedPassword)];
                case 2:
                    adminUserId = _a.sent();
                    console.log("Generate Users finished.");
                    return [2 /*return*/, {
                            adminUserId: adminUserId
                        }];
            }
        });
    });
}
exports.generateUsers = generateUsers;
