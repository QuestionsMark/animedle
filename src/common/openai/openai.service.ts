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
        const prompt = `Generate a captivating and cohesive full-color portrait featuring an enchanting anime girl, meticulously designed in the modern Japanese aesthetic with gentle and contemporary line art. This character, hailing from a fantasy world and graced with enchanting magical powers, is intended to radiate extraordinary cuteness, showcasing a broad spectrum of emotions, including warmth, innocence, and a captivating touch of magic.

        Compose the image as a seamlessly unified portrait, avoiding any division into parts. The background should be delicately crafted, offering a subtle and enchanting setting that alludes to the fantastical realm she calls home. Maintain a careful balance to ensure the background complements and enhances the character without overshadowing her vibrant presence.
        
        Highlight the girl's confidence by delicately expressing her allure and assets without fear. Craft an enchanting hairstyle that seamlessly blends fantasy elements with modern aesthetics, contributing to the overall charm of the character. Pay meticulous attention to the eyes, infusing them with a sense of wonder, magic, and expressiveness, serving as the emotional core of the portrait.
        
        Design a fantasy-inspired wardrobe harmonizing with her magical abilities, utilizing a harmonious and vibrant color palette inspired by contemporary anime trends and the fantastical elements of her origin.
        
        Specify that the generated image should be a coherent and full-color portrait of the girl, with no text, charts, or diagrams present in the artwork.
        
        Emphasize that the artwork must not be divided into halves or multiple parts, presenting itself as a singular, cohesive masterpiece.
        
        This detailed and refined prompt aims to guide the creation of a captivating and expressive portrait, showcasing the beautiful anime girl as a harmonious visual composition, seamlessly blending the modern Japanese aesthetic with the enchantment of her magical persona against a delicately detailed backdrop.`;

        return prompt;
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