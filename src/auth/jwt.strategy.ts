import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';
import { SECRET_KEY } from "config/config";
import { User } from "../user/entities/user.entity";
import { Auth } from "src/types";
import { Request } from "express";

const cookieExtractor = (req: Request): null | string => {
    return (req && req.headers) ? (req.header('X-authentication-token') ?? null) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, Auth.Strategy.Jwt) {
    constructor() {
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: SECRET_KEY,
        })
    }

    async validate(payload: Auth.JwtPayload, done: (err: UnauthorizedException, user: User | null) => void) {
        if (!payload || !payload.id) {
            return done(new UnauthorizedException(), null);
        }
        const user = await User.findOne({
            relations: ['avatar', 'skins'],
            where: {
                currentTokenId: payload.id,
            },
        });
        if (!user) {
            return done(new UnauthorizedException(), null);
        }
        done(null, user);
    }
}