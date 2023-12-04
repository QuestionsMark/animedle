import { IsString } from "class-validator";

export class GuesDto {
    @IsString()
    title: string;
}