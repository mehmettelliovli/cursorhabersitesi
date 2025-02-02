"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole[UserRole["SUPER_ADMIN"] = 1000] = "SUPER_ADMIN";
    UserRole[UserRole["ADMIN"] = 900] = "ADMIN";
    UserRole[UserRole["EDITOR"] = 800] = "EDITOR";
    UserRole[UserRole["AUTHOR"] = 700] = "AUTHOR";
    UserRole[UserRole["MODERATOR"] = 600] = "MODERATOR";
    UserRole[UserRole["USER"] = 100] = "USER";
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=role.enum.js.map