import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { ConfigurationResolver } from './configuration.resolver';
import { ConfigurationService } from './configuration.service';

@Module({
  imports: [CommonModule],
  providers: [ConfigurationService, ConfigurationResolver],
})
export class ConfigurationModule {}
