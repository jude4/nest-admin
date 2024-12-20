import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get()
    async all(@Query('page') page: number = 1): Promise<User[]> {
        return this.userService.paginate(page);
    }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User> {

        const password = await bcrypt.hash(body.password, 12);

        const {role_id, ...data} = body;

        return this.userService.create({
            ...data,
            password,
            role: {
                id: role_id
            }
        })
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return this.userService.findOne({id});
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() body: UserUpdateDto) {

        const {role_id, ...data} = body;

         await this.userService.update(id, 
            {
                ...data,
                role: {
                    id: role_id
                }
            });

         return this.userService.findOne({id});
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.userService.delete(id);

        return {
            "message": "You have successfully deleted the user"
        }
    }
 }
