import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ResponseModule } from 'src/common/response/response.module';

@Module({
  imports: [ResponseModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule { }
