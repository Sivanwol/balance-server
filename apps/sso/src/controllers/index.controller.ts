import { Get, JsonController } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@OpenAPI( {
  security: [],
} )
@Service()
@JsonController( '/' )
export class IndexController {
  constructor(
  ) {  }

  @Get('/')
  index() {
    return 'OK';
  }
}
