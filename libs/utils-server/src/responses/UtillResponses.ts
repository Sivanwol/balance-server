import { IsBoolean, IsOptional, IsNumber, IsString } from "class-validator";

export class VoidResponse {
  @IsBoolean()
  public status: boolean;
  @IsOptional()
  @IsNumber()
  public errorCode?: number;
  @IsString({ each: true })
  public errors?: string[];
}
