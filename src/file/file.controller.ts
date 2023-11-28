import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';

@Controller('/file')
export class FileController {
  constructor(
    @Inject(FileService) private fileService: FileService,
  ) { }

  @Get('/:id')
  async getFile(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.fileService.getFile(id, res);
  }

}