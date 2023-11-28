import { Injectable } from '@nestjs/common';
import { ServerErrorResponse, ServerSuccessfullResponse } from 'src/types';

@Injectable()
export class ResponseService {
    sendSuccessfullResponse<T>(results: T, count?: number): ServerSuccessfullResponse<T> {
        return { results, count };
    }

    sendErrorResponse(message: string, problems?: string[]): ServerErrorResponse {
        if (problems) return { message, problems }
        return { message };
    }

    skip(page: number, limit: number) {
        return (Number.isNaN(Number(page)) ? 0 : Number(page) - 1) * (Number.isNaN(Number(limit)) ? 10 : Number(limit));
    }

    limit(limit: number) {
        if (Number.isNaN(Number(limit))) return 10;
        return limit <= 50 ? limit : 50;
    };
}