import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor() {
    super('requested not authorized', HttpStatus.UNAUTHORIZED);
  }
}
