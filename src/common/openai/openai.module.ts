import { Module } from "@nestjs/common";
import { OpenaiService } from "./openai.service";
import { FileModule } from "src/file/file.module";

@Module({
    imports: [
        FileModule
    ],
    providers: [OpenaiService],
    exports: [OpenaiService],
})
export class OpenaiModule { }