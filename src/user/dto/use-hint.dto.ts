import { IsEnum } from "class-validator";
import { Animedle } from "src/types";

export class UseHintDto {
    @IsEnum(Animedle.HintType)
    hint: Animedle.HintType;
}
