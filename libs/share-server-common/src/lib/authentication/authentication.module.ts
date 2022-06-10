import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'auth0' })],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtStrategy],
})
export class AuthenticationModule {}
