import { Inject, Injectable } from "@nestjs/common";
import { OPENAI_API_KEY } from "config/config";
import { OpenAI } from "openai";
import { FileItem } from "src/file/entities/file.entity";
import { FileService } from "src/file/file.service";
import { PROMPTS } from "src/utils/data.util";
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
        const prompts = Object.values(PROMPTS);
        return prompts[Math.floor(Math.random() * prompts.length)];
    }

    async generateAvatar(): Promise<FileItem> {
        const image = await this.openai.images.generate({
            prompt: this.getPrompt(),
            model: 'dall-e-3',
            n: 1,
            response_format: 'b64_json',
            style: 'vivid',
            quality: "hd",
        });

        const base64 = image.data[0].b64_json;
        if (!base64) throw new ValidationException('No generated avatar.');

        const filename = await this.fileService.saveFile(base64);

        const file = new FileItem();
        file.filename = filename;
        const newFile = await file.save();

        return newFile;
    }
}