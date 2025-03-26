import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ReputationModule } from './reputation/reputation.module';
import { NftsModule } from './nfts/nfts.module';
import { User, UserSchema } from './users/entities/user.entity';
import {
  Organization,
  OrganizationSchema,
} from './organizations/entities/organization.entity';
import {
  Reputation,
  ReputationSchema,
} from './reputation/entities/reputation.entity';
import { Nft, NftSchema } from './nfts/entities/nft.entity';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Reputation.name, schema: ReputationSchema },
      { name: Nft.name, schema: NftSchema },
    ]),
    UsersModule,
    OrganizationsModule,
    ReputationModule,
    NftsModule,
  ],
})
export class AppModule {}
