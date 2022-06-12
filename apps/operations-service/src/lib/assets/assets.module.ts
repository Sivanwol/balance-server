import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AssetsResolver } from './assets.resolver';
import { AssetsService } from './assets.service';
import { AssetsCategoryResolver } from './assets-category.resolver';

@Module({
  imports: [CommonModule],
  providers: [AssetsService, AssetsCategoryResolver, AssetsResolver],
})
export class AssetsModule {}
