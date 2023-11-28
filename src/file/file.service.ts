import * as path from 'path';
import { unlink } from 'fs/promises';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { multerStorageDir } from 'src/utils/multer.util';
import { FileItem } from './entities/file.entity';
import { ResponseService } from 'src/common/response/response.service';
import { MulterFile } from 'src/types';

@Injectable()
export class FileService {
    constructor(
        @Inject(ResponseService) private responseService: ResponseService,
    ) { }

    async saveFiles(files: MulterFile[]): Promise<FileItem[]> {
        const filesList: FileItem[] = [];
        let i = 0;
        for (const { filename } of files) {
            const newFile = new FileItem();
            newFile.filename = filename;
            const image = await newFile.save();
            filesList.push(image);
            i++;
        }
        return filesList;
    };

    async unlinkFiles(files: MulterFile[] | { filename: string }[]): Promise<void> {
        for (const { filename } of files) {
            await unlink(path.join(multerStorageDir(), filename));
        }
    }

    async getFile(id: string, res: Response) {
        try {
            const file = await FileItem.findOne({
                where: {
                    id,
                }
            });
            if (!file) {
                throw new NotFoundException('No file found!');
            }

            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.sendFile(file.filename, {
                root: path.join(multerStorageDir()),
            });
        } catch (e) {
            res.status(500).json(this.responseService.sendErrorResponse('Something went wrong, try again later.'));
        }
    }
}
