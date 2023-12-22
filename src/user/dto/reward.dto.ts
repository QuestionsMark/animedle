import { IsEnum, IsNumber } from "class-validator";
import { RewardType } from "src/types";

export class RewardDto {
    @IsEnum(RewardType)
    type: RewardType;

    @IsNumber()
    coins: number;
}