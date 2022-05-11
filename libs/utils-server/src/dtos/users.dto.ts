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
  public userName: string;
  @IsString()
  public displayName: string;
  @IsString()
  public fullName:string;
  @IsEmail()
  public email: string;
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
