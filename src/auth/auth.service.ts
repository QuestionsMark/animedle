import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { ResponseService } from 'src/common/response/response.service';
import { Auth, ServerSuccessfullResponse, User as UserNamespace } from 'src/types';
import { UserService } from 'src/user/user.service';
import { sign } from 'jsonwebtoken';
import { User } from 'src/user/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { compare, genSalt, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { loginSchema } from 'src/validation';

@Injectable()
export class AuthService {
    constructor(
        @Inject(ResponseService) private responseService: ResponseService,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
    ) { }

    private createToken(currentTokenId: string): Auth.CreateToken {
        const payload: Auth.JwtPayload = { id: currentTokenId };
        const expiresIn = 60 * 60 * 24;
        const accessToken = sign(payload, process.env.SECRET_KEY, { expiresIn });
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

    async isLogged(id: string): Promise<ServerSuccessfullResponse<UserNamespace.ContextValue>> {
        return this.responseService.sendSuccessfullResponse(await this.userService.getContextValue(id));
    }

    async login(loginDto: LoginDto): Promise<ServerSuccessfullResponse<Auth.Response>> {
        await loginSchema.validate(loginDto);

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

        return this.responseService.sendSuccessfullResponse({
            token: token.accessToken,
            user: await this.userService.getContextValue(user.id),
        });
    }

    async logout(user: User): Promise<ServerSuccessfullResponse<string>> {
        user.currentTokenId = null;
        await user.save();

        return this.responseService.sendSuccessfullResponse('Successfully logged out!');
    }
}