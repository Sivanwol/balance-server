import { Auth0Guard } from '@applib/share-server-common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Controller('users')
export class UserController {
  @Get('/test')
  @UseGuards(Auth0Guard)
  async test() {
    return {
      status: true,
      data: {
        auth: true,
      },
    };
  }
}
