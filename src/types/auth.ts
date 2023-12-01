import { User } from "src/user/entities/user.entity";
import { Request as ExpressRequest } from "express";
import { User as UserNamespace } from "../types";

export namespace Auth {
    export enum Strategy {
        Jwt = 'jwt',
        HttpHeaderJwt = 'http-header-jwt',
    }

    export enum CookieName {
        AuthToken = 'jwt',
    }

    export interface JwtPayload {
        id: string;
    }

    export interface CreateToken {
        accessToken: string;
        expiresIn: number;
    }

    // Request
    export interface Request extends ExpressRequest {
        user: User;
    }

    // Reposnse
    export interface Response {
        token: string;
        user: UserNamespace.Response;
    }
}