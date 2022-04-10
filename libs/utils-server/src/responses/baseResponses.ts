import { IsBoolean, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class BaseResponse<T> {
  @IsBoolean()
  public status: boolean;
  @IsOptional()
  @IsNumber()
  public errorCode?: number;
  @IsString({ each: true })
  public errors?: string[];
  @IsOptional()
  @ValidateNested()
  public data?: T
  @IsOptional()
  @IsObject()
  public metaData?: any;
}

export class StatusMessageResponse {
  @IsNumber()
  public status: number;
  @IsString()
  public message: string;
}

class ListMetaResponse {
  @IsNumber()
  public current: number
  @IsNumber()
  public totalItems: number
  @IsNumber()
  public totalPages: number
}
export class ListResponse<T> {
  @ValidateNested({ each: true })
  items: T[]
  @ValidateNested()
  meta: ListMetaResponse
}
