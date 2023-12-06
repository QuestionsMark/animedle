import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ResponseModule } from 'src/common/response/response.module';
import { OpenaiModule } from 'src/common/openai/openai.module';

@Module({
  imports: [
    ResponseModule,
    OpenaiModule,
  ],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule { }
