import { Inject, Injectable } from '@nestjs/common';
import { ResponseService } from './common/response/response.service';
import { ServerSuccessfullResponse } from './types';

@Injectable()
export class AppService {
  constructor(
    @Inject(ResponseService) private responseService: ResponseService,
  ) { }
  getHello(): ServerSuccessfullResponse<string> {
    return this.responseService.sendSuccessfullResponse('Greetings from Animedle developers!');
  }
}
