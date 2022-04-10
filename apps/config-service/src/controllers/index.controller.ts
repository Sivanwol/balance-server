import { Controller, Get, Req, Param } from 'routing-controllers';

@Controller()
export class IndexController {
  @Get('/')
  index() {
    return 'OK';
  }

}
