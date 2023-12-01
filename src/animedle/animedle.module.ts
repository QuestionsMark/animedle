import { Module } from '@nestjs/common';
import { AnimedleService } from './animedle.service';
import { AnimedleController } from './animedle.controller';
import { ResponseModule } from 'src/common/response/response.module';

@Module({
  imports: [
    ResponseModule,
  ],
  controllers: [AnimedleController],
  providers: [AnimedleService],
  exports: [AnimedleService],
})
export class AnimedleModule { }
