import { IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches, IsBoolean } from 'class-validator';

export class VerifyUserDto {
  @IsString()
  @MinLength( 8 )
  @MaxLength( 32 )
  public userId: string;
  @IsEmail()
  public email: string;
  @IsBoolean()
  public verifyEmail: boolean;
  @IsEmail()
  public phone: string;
  @IsBoolean()
  public verifyPhone: boolean;
}
export class LoginUserDto {
  @IsEmail()
  public email: string;

  @MinLength( 8 )
  @MaxLength( 32 )
  @Matches( /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'} )
  @IsString()
  public password: string;
}

export class ForgetPasswordUserDto {
  @MinLength( 8 )
  @MaxLength( 32 )
  @Matches( /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'} )
  @IsString()
  public password: string;
}

export class RegisterUserDto {
  @IsEmail()
  public email: string;

  @MinLength( 8 )
  @MaxLength( 32 )
  @Matches( /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'} )
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  @MinLength( 2 )
  @MaxLength( 40 )
  public firstName: string;
  @IsOptional()
  @IsString()
  @MinLength( 2 )
  @MaxLength( 40 )
  public lastName: string;
}
