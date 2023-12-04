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
        const genders = ['male', 'female'];
        const dimensions = ['2D', '3D'];
        const studios = [];

        return `One Anime character. A lot of details, ${dimensions[Math.floor(Math.random() * dimensions.length)]} japanese anime style. Character gender is ${genders[Math.floor(Math.random() * genders.length)]}.`;
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