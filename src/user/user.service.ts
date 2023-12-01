import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ServerSuccessfullResponse, User as UserNamespace } from 'src/types';
import { User } from './entities/user.entity';
import { ResponseService } from 'src/common/response/response.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @Inject(ResponseService) private responseService: ResponseService,
        @Inject(AuthService) private authService: AuthService,
    ) { }

    async getUserResponse(id: string): Promise<UserNamespace.Response> {
        const { avatar, email, username } = await User.findOneOrFail({
            relations: ['avatar'],
            where: {
                id,
            },
        });

        return {
            avatar: avatar ? avatar.id : null,
            email,
            id,
            username,
        };
    }

    async create(createUserDto: CreateUserDto): Promise<ServerSuccessfullResponse<string>> {
        const { confirmPassword, email, password, username } = createUserDto;

        // Validation to do

        const newUser = new User();
        newUser.avatar = null;
        newUser.passwordHash = await this.authService.hashPassword(password);
        newUser.email = email;
        newUser.username = username;
        await newUser.save();

        return this.responseService.sendSuccessfullResponse('Successfully created an account!');
    }

    findAll() {
        return `This action returns all user`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
