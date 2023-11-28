import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { ResponseService } from 'src/common/response/response.service';
import { Auth, ServerSuccessfullResponse, User as UserNamespace } from 'src/types';
import { UserService } from 'src/user/user.service';
import { sign } from 'jsonwebtoken';
import { COOKIES_CONFIG, SECRET_KEY } from 'config/config';
import { User } from 'src/user/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { compare, genSalt, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @Inject(ResponseService) private responseService: ResponseService,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
    ) { }

    private createToken(currentTokenId: string): Auth.CreateToken {
        const payload: Auth.JwtPayload = { id: currentTokenId };
        const expiresIn = 60 * 60 * 24;
        const accessToken = sign(payload, SECRET_KEY, { expiresIn });
        return {
            accessToken,
            expiresIn,
        };
    }

    private async generateToken(user: User): Promise<string> {
        let token;
        let userWithThisToken = null;
        do {
            token = uuid();
            userWithThisToken = await User.findOne({
                where: {
                    currentTokenId: token,
                },
            })
        } while (!!userWithThisToken);
        user.currentTokenId = token;
        await user.save();

        return token;
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await genSalt(11);
        return hash(password, salt);
    };

    async isLogged(id: string): Promise<ServerSuccessfullResponse<UserNamespace.Response>> {
        return this.responseService.sendSuccessfullResponse(await this.userService.getUserResponse(id));
    }

    async login(loginDto: LoginDto, res: Response) {
        // checkValidation(loginDto, LoginSchema);
        const { email, password } = loginDto;
        const user = await User.findOne({
            where: {
                email,
            }
        });
        if (!user) throw new UnauthorizedException('Invalid email or password!');

        const match = await compare(password, user.passwordHash);
        if (!match) throw new UnauthorizedException('Invalid email or password!');

        const token = this.createToken(await this.generateToken(user));

        return res
            .cookie(Auth.CookieName.AuthToken, token.accessToken, COOKIES_CONFIG)
            .json(this.responseService.sendSuccessfullResponse(await this.userService.getUserResponse(user.id)));
    }

    async logout(user: User, res: Response) {
        try {
            user.currentTokenId = null;
            await user.save();
            res.clearCookie(Auth.CookieName.AuthToken, COOKIES_CONFIG);
            return res.status(200).json(this.responseService.sendSuccessfullResponse('Successfully logged out!'));
        } catch (e) {
            console.error(e);
            return res.status(500).json(this.responseService.sendErrorResponse('Something went wrong, try again later.'));
        }
    }
}