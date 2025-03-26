import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { StarkNetProviderService } from './starknet-provider.service';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register({
      ttl: 60000, // 1 minute default TTL
      max: 100, // maximum number of items in cache
    }),
  ],
  providers: [StarkNetProviderService],
  exports: [StarkNetProviderService],
})
export class StarkNetProviderModule {}
