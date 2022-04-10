import { IsBoolean, IsDate, IsDefined, IsString } from 'class-validator';
import { BaseResponse, ListResponse, StatusMessageResponse } from './baseResponses';

export class PlatformSettingsResponse {
  @IsString()
  public key: string
  @IsDefined()
  public value: any
  @IsBoolean()
  public isEnabled: boolean
  @IsDate()
  public updatedAt: Date
}

export class PlatformSettingsMessageResponse extends BaseResponse<StatusMessageResponse> {}
export class PlatformSettingsItemResponse extends BaseResponse<PlatformSettingsResponse> {}
export class PlatformSettingsListResponse extends BaseResponse<ListResponse<PlatformSettingsResponse>> {}
