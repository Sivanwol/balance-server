import { HttpException, HttpStatus } from "@nestjs/common";

export class EntityNotFoundException extends HttpException {
  constructor() {
    super('requested entity not found', HttpStatus.BAD_REQUEST);
  }
}
