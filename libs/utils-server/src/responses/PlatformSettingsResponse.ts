import { IsBoolean, IsDate, IsDefined, IsString } from 'class-validator';
import { ConfigurationMessage } from '../interfaces/IConfiguration';
import { BaseResponse, ListResponse, StatusMessageResponse } from './baseResponses';

export class PlatformSettingsResponse {
  @IsString()
  public service: string;
  @IsString()
  public key: string;
  @IsDefined()
  public value: any

  @IsBoolean()
  public isClient: boolean
  @IsBoolean()
  public isSecureClient: boolean
  @IsDate()
  public updatedAt: Date
  public toConfigurationMessage(): ConfigurationMessage {
    return this as ConfigurationMessage;
  }
}

export class PlatformSettingsMessageResponse extends BaseResponse<StatusMessageResponse> {}
export class PlatformSettingsItemResponse extends BaseResponse<PlatformSettingsResponse> {}
export class PlatformSettingsListResponse extends BaseResponse<ListResponse<PlatformSettingsResponse>> {}
