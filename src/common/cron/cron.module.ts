import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { AnimedleModule } from "src/animedle/animedle.module";

@Module({
    imports: [
        AnimedleModule,
    ],
    providers: [CronService],
    exports: [CronService],
})
export class CronModule { }