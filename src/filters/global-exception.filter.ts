import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { ResponseService } from 'src/common/response/response.service';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExpectionFilter implements ExceptionFilter {
    responseService: ResponseService;

    constructor(
        responseService: ResponseService,
    ) {
        this.responseService = responseService;
    }

    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        let status: number;
        let message: string;
        let problems: string[] | null = null;

        // Exception types
        if (exception instanceof BadRequestException) {
            const errorResponse = exception.getResponse();
            if (typeof errorResponse !== 'string') {
                const errorProblems = (errorResponse as any).message;
                if (typeof errorProblems === 'string') {
                    problems = [errorProblems];
                } else if (typeof errorProblems === 'object') {
                    problems = errorProblems;
                }
            }
            message = (exception as any).response.error + '!';
            status = exception.getStatus();
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        } else if (exception instanceof UnauthorizedException) {
            status = exception.getStatus();
            message = exception.message;
        } else if (exception instanceof QueryFailedError) {
            status = 400;
            message = 'Element already exist.';
            problems = [];
        } else if (exception instanceof EntityNotFoundError) {
            status = 404;
            message = 'Entity not found.';
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Something went wrong, try again later.';
        }

        console.error(exception);

        // ResponseProvider
        response.status(status).json(this.responseService.sendErrorResponse(message, problems));
    }
}