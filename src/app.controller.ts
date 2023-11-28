import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ServerSuccessfullResponse } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): ServerSuccessfullResponse<string> {
    return this.appService.getHello();
  }
}
