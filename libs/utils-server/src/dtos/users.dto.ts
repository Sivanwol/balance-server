import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsBoolean,
  IsMobilePhone,
} from 'class-validator';

/**
 * Auth0 user model
 *
    userName: event.user.username,
    displayName: event.user.nickname,
    fullname: event.user.name,
    email: event.user.email,
    emailVerified: event.user.email_verified,
    phone: event.user.phone,
    phoneVerified: event.user.phone_verified
 */
export class RegisterUserAuth0Dto {
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(32)
  public userId: string;
  @IsString()
  public userName: string;
  @IsOptional()
  @IsString()
  public displayName: string;
  @IsEmail()
  public email: string;
  @IsOptional()
  @IsBoolean()
  public verifyEmail: boolean;
  @IsMobilePhone()
  @IsOptional()
  public phone: string;
  @IsOptional()
  @IsBoolean()
  public verifyPhone: boolean;
}
export class LoginUserDto {
  @IsEmail()
  public email: string;

  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @IsString()
  public password: string;
}

export class ForgetPasswordUserDto {
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @IsString()
  public password: string;
}

export class RegisterUserDto {
  @IsEmail()
  public email: string;

  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  public firstName: string;
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  public lastName: string;
}
