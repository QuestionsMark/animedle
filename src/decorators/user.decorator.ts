import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserObject = createParamDecorator((_data, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
});