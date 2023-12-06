export class ValidationException extends Error {
    problems?: string[];

    constructor(message: string, problems?: string[]) {
        super(message);
        this.problems = problems;
    }
}