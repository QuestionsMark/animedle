import { Inject, Injectable } from "@nestjs/common";
import { OPENAI_API_KEY } from "config/config";
import { OpenAI } from "openai";
import { FileItem } from "src/file/entities/file.entity";
import { FileService } from "src/file/file.service";
import { ValidationException } from "src/utils/exceptions.util";

const PROMPTS: { [key: string]: string } = {
    lightDetails: `Generate a captivating and cohesive full-color portrait featuring an enchanting anime girl, meticulously designed in the modern Japanese aesthetic with gentle and contemporary line art. This character, hailing from a fantasy world and graced with enchanting magical powers, is intended to radiate extraordinary cuteness, showcasing a broad spectrum of emotions, including warmth, innocence, and a captivating touch of magic.

    Compose the image as a seamlessly unified portrait, avoiding any division into parts. The background should be delicately crafted, offering a subtle and enchanting setting that alludes to the fantastical realm she calls home. Maintain a careful balance to ensure the background complements and enhances the character without overshadowing her vibrant presence.

    Highlight the girl's confidence by delicately expressing her allure and assets without fear. Craft an enchanting hairstyle that seamlessly blends fantasy elements with modern aesthetics, contributing to the overall charm of the character. Pay meticulous attention to the eyes, infusing them with a sense of wonder, magic, and expressiveness, serving as the emotional core of the portrait.

    Design a fantasy-inspired wardrobe harmonizing with her magical abilities, utilizing a harmonious and vibrant color palette inspired by contemporary anime trends and the fantastical elements of her origin.

    Specify that the generated image should be a coherent and full-color portrait of the girl, with no text, charts, or diagrams present in the artwork.

    Emphasize that the artwork must not be divided into halves or multiple parts, presenting itself as a singular, cohesive masterpiece.

    This detailed and refined prompt aims to guide the creation of a captivating and expressive portrait, showcasing the beautiful anime girl as a harmonious visual composition, seamlessly blending the modern Japanese aesthetic with the enchantment of her magical persona against a delicately detailed backdrop.`,
    darkDetails: `Generate a captivating and cohesive full-color portrait featuring an enchanting anime girl with a dark and antagonistic character, meticulously designed in the modern Japanese aesthetic with gentle and contemporary line art. This character, emerging from a fantasy world, is graced with enchanting and malevolent magical powers, intended to radiate extraordinary allure while embodying a sense of darkness and intrigue.

    Compose the image as a seamlessly unified portrait, avoiding any division into parts. The background should be delicately crafted, offering a subtle yet ominous and dark setting that alludes to the sinister realm she calls home. Maintain a careful balance to ensure the dark background complements and enhances the character's dark presence without overshadowing her captivating allure. Emphasize that the background should be dark but subtle, ensuring it does not dominate the girl, who remains the focal point of the artwork.

    Highlight the girl's confidence by delicately expressing her malevolent allure and formidable presence without fear. Craft an enchanting hairstyle that seamlessly blends dark fantasy elements with modern aesthetics, contributing to the overall charm of the character. Pay meticulous attention to her eyes, infusing them with a sense of mystery, magic, and a touch of malevolence, serving as the emotional core of the portrait.

    Design a fantasy-inspired wardrobe that harmonizes with her dark magical abilities, utilizing a harmonious and subdued color palette inspired by contemporary anime trends and the sinister elements of her origin.

    Specify that the generated image should be a coherent and full-color portrait of the dark and captivating girl, with no text, charts, or diagrams present in the artwork.

    Emphasize that the artwork must not be divided into halves or multiple parts, presenting itself as a singular, cohesive masterpiece.

    This detailed and refined prompt aims to guide the creation of a captivating and expressive portrait, showcasing the beautiful yet dark anime girl as a harmonious visual composition, seamlessly blending the modern Japanese aesthetic with the sinister enchantment of her magical persona against a delicately detailed backdrop.`,
    lightBasic: `Generate a charming and straightforward full-color portrait of an anime girl with a gentle, modern Japanese aesthetic. This character, from a fantasy world with magical powers, should radiate cuteness and warmth, expressing a touch of magic.

    Create a simple, unified portrait without dividing it into parts. Design a minimalistic background that subtly hints at her fantastical realm, enhancing the character without overwhelming her presence.
    
    Emphasize the girl's confidence with a simple showcase of her allure. Craft an uncomplicated hairstyle that blends fantasy elements with a modern aesthetic. Focus on her eyes, infusing them with a hint of wonder and expressiveness as the emotional core of the portrait.
    
    Design a straightforward wardrobe inspired by fantasy, harmonizing with her magical abilities. Utilize a modest color palette inspired by contemporary anime trends and the fantastical elements of her origin.
    
    Specify that the generated image should be a coherent and full-color portrait, free from text, charts, or diagrams. Ensure the artwork remains a singular, cohesive masterpiece without being divided into halves or multiple parts.
    
    This simplified prompt aims to guide the creation of a charming and expressive portrait with fewer details, maintaining the modern Japanese aesthetic and the enchantment of her magical persona against a subtly outlined backdrop.`,
};

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
        // const prompt = `Generate a charming full-color portrait of an anime girl with a gentle, contemporary art style inspired by modern Japanese aesthetics. This character comes from a fantasy world, blessed with magical powers, aiming to radiate cuteness and a touch of magic while expressing warmth and innocence.

        // Create a unified portrait without dividing it into parts. Design a subtle and enchanting background that hints at the fantastical realm she calls home, ensuring it enhances the character without overpowering her presence.

        // Emphasize the girl's confidence by delicately showcasing her allure and assets. Craft a simple yet enchanting hairstyle that blends fantasy elements with a modern aesthetic. Pay attention to her eyes, infusing them with wonder and expressiveness as the emotional core of the portrait.

        // Design a wardrobe inspired by fantasy, harmonizing with her magical abilities. Utilize a vibrant but simple color palette inspired by contemporary anime trends and the fantastical elements of her origin.

        // Specify that the generated image should be a coherent and full-color portrait, free from text, charts, or diagrams. Ensure the artwork remains a singular, cohesive masterpiece without being divided into halves or multiple parts.

        // This revised prompt aims to guide the creation of a captivating and expressive portrait with a simpler style, still embracing the modern Japanese aesthetic and the enchantment of her magical persona against a subtly detailed backdrop.`;
        // const prompt = `Generate a charming and straightforward full-color portrait of an anime girl with a gentle, modern Japanese aesthetic. This character, from a fantasy world with magical powers, should radiate cuteness and warmth, expressing a touch of magic.

        // Create a simple, unified portrait without dividing it into parts. Design a minimalistic background that subtly hints at her fantastical realm, enhancing the character without overwhelming her presence.

        // Emphasize the girl's confidence with a simple showcase of her allure. Craft an uncomplicated hairstyle that blends fantasy elements with a modern aesthetic. Focus on her eyes, infusing them with a hint of wonder and expressiveness as the emotional core of the portrait.

        // Design a straightforward wardrobe inspired by fantasy, harmonizing with her magical abilities. Utilize a modest color palette inspired by contemporary anime trends and the fantastical elements of her origin.

        // Specify that the generated image should be a coherent and full-color portrait, free from text, charts, or diagrams. Ensure the artwork remains a singular, cohesive masterpiece without being divided into halves or multiple parts.

        // This simplified prompt aims to guide the creation of a charming and expressive portrait with fewer details, maintaining the modern Japanese aesthetic and the enchantment of her magical persona against a subtly outlined backdrop.`;
        // const prompt = `Generate a captivating and simple full-color portrait of an enchanting anime girl in a minimalistic, modern Japanese aesthetic. This character, from a fantasy world with magical powers, should radiate extraordinary cuteness, expressing warmth, innocence, and a touch of magic.

        // Compose the image as a seamlessly unified and straightforward portrait, avoiding unnecessary details or division into parts. Craft a background that is delicately outlined, providing a subtle and enchanting setting hinting at the fantastical realm she calls home. Ensure the background enhances the character without overshadowing her vibrant presence.

        // Highlight the girl's confidence with a minimalistic showcase of her allure and assets. Design a straightforward hairstyle that blends fantasy elements with modern aesthetics, contributing to the overall charm of the character. Pay attention to the eyes, infusing them with a hint of wonder, magic, and expressiveness as the emotional core of the portrait.

        // Create a fantasy-inspired wardrobe with minimal details, harmonizing with her magical abilities. Utilize a subdued color palette inspired by contemporary anime trends and the fantastical elements of her origin.

        // Specify that the generated image should be a coherent and full-color portrait of the girl, with an emphasis on simplicity and a lack of unnecessary text, charts, or diagrams.

        // Emphasize that the artwork must remain singular, avoiding division into halves or multiple parts, presenting itself as a cohesive masterpiece with very few details.

        // This modified prompt aims to guide the creation of a captivating and expressive portrait with an intentional focus on simplicity, maintaining the modern Japanese aesthetic and the enchantment of her magical persona against a minimally detailed backdrop.`;
        const prompt = `Generate a captivating and simple full-color portrait of an enchanting anime girl in a minimalistic, modern Japanese aesthetic. This character, from a fantasy world with magical powers, should radiate extraordinary cuteness and express a range of emotions, including warmth, innocence, and a captivating touch of magic.

        Compose the image as a seamlessly unified and straightforward portrait, avoiding unnecessary details or division into parts. Craft a background that is delicately outlined, providing a subtle and enchanting setting hinting at the fantastical realm she calls home. Ensure the background enhances the character without overshadowing her vibrant presence.
        
        Highlight the girl's confidence with a minimalistic showcase of her allure and assets. Design a straightforward hairstyle that blends fantasy elements with modern aesthetics, contributing to the overall charm of the character. Pay attention to the eyes, infusing them with a hint of wonder, magic, and expressiveness as the emotional core of the portrait.
        
        Create a fantasy-inspired wardrobe with minimal details, harmonizing with her magical abilities. Utilize a subdued and simple color palette inspired by contemporary anime trends and the fantastical elements of her origin.
        
        Specify that the generated image should be a coherent and full-color portrait of the girl, with an emphasis on simplicity and a lack of unnecessary text, charts, or diagrams.
        
        Emphasize that the artwork must remain singular, avoiding division into halves or multiple parts, presenting itself as a cohesive masterpiece with very few details.
        
        This modified prompt aims to guide the creation of a captivating and expressive portrait with an intentional focus on simplicity, maintaining the modern Japanese aesthetic and the enchantment of her magical persona against a minimally detailed backdrop.`;

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