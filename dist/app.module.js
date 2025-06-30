"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_module_1 = require("./config/config.module");
const database_module_1 = require("./database/database.module");
const mongoose_1 = require("@nestjs/mongoose");
const users_module_1 = require("./users/users.module");
const organizations_module_1 = require("./organizations/organizations.module");
const reputation_module_1 = require("./reputation/reputation.module");
const nfts_module_1 = require("./nfts/nfts.module");
const user_entity_1 = require("./users/entities/user.entity");
const organization_entity_1 = require("./organizations/entities/organization.entity");
const reputation_entity_1 = require("./reputation/entities/reputation.entity");
const nft_entity_1 = require("./nfts/entities/nft.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            database_module_1.DatabaseModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_entity_1.User.name, schema: user_entity_1.UserSchema },
                { name: organization_entity_1.Organization.name, schema: organization_entity_1.OrganizationSchema },
                { name: reputation_entity_1.Reputation.name, schema: reputation_entity_1.ReputationSchema },
                { name: nft_entity_1.Nft.name, schema: nft_entity_1.NftSchema },
            ]),
            users_module_1.UsersModule,
            organizations_module_1.OrganizationsModule,
            reputation_module_1.ReputationModule,
            nfts_module_1.NftsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map