import { Inject, Injectable } from "@nestjs/common";
import { OPENAI_API_KEY } from "config/config";
import { OpenAI } from "openai";
import { FileItem } from "src/file/entities/file.entity";
import { FileService } from "src/file/file.service";
import { ValidationException } from "src/utils/exceptions.util";

@Injectable()
export class OpenaiService {
    private openai: OpenAI;

    constructor(
        @Inject(FileService) private fileService: FileService,
    ) {
        this.openai = new OpenAI({
            apiKey: OPENAI_API_KEY,
        });
    }

    getPrompt() {
        const genders = ['girl', 'boy'];
        const studios = ['Madhouse', 'Studio Bones', 'Kyoto Animation', 'Wit Studio', 'Toei Animation', 'MAPPA Studio', 'Studio Ghibli', 'Sunrise Studio', 'A-1 Pictures', 'Ufotable', 'Studio Pierrot', 'Production I.G', 'P.A.Works', 'J.C.Staff'];

        return `2D anime teenage ${genders[Math.floor(Math.random() * genders.length)]} in the style of "${studios[Math.floor(Math.random() * studios.length)]}" studio . A lot of details, japanese anime style.`;
    }

    async generateAvatar(): Promise<FileItem> {
        const image = await this.openai.images.generate({ prompt: this.getPrompt(), model: 'dall-e-3', n: 1, response_format: 'b64_json', style: 'natural' });

        const base64 = image.data[0].b64_json;
        if (!base64) throw new ValidationException('No generated avatar.');

        const filename = await this.fileService.saveFile(base64);

        const file = new FileItem();
        file.filename = filename;
        const newFile = await file.save();

        return newFile;
    }
}