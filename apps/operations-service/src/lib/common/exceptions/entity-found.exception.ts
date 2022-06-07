import { HttpException, HttpStatus } from "@nestjs/common";

export class EntityFoundException extends HttpException {
  constructor() {
    super('requested entity not found', HttpStatus.BAD_REQUEST);
  }
}
