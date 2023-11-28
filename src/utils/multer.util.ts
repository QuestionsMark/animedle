import * as path from "path";
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

export const multerStorageDir = () => {
    return path.join(__dirname, '../../../storage');
};

export const multerStorage = (dest: string) => {
    return diskStorage({
        destination: (req, file, cb) => cb(null, dest),
        filename: (req, file, cb) => cb(null, uuid() + path.extname(file.originalname)),
    });
};