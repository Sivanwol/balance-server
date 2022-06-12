import { HttpException, HttpStatus } from '@nestjs/common';

export class AssetCategoryHasNoAssetsException extends HttpException {
  constructor(assetCategoryId: string) {
    super(`requested asset category [${assetCategoryId}] has not have asset`, HttpStatus.BAD_REQUEST);
  }
}
