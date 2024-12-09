import { Controller, Post, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';

@Controller()
export class AuthController {

    constructor(private userService: UserService) {}

    @Post('register')
    async register(@Body() body: RegisterDto) {
        if (body.password !== body.password_confirm) {
            throw new BadRequestException('Passwords do not match');
        }
        const hashed_password = await bcrypt.hash(body.password, 12);

        body.password = hashed_password;

        return this.userService.create(body);
    }

    @Post('login')  
    async login(
        @Body('email') email: string, 
        @Body('password') password: string
    ) {
        const user = this.userService.findOne({email});

        if (!user) {
            throw new NotFoundException('User not found');
        }
        
        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Invalid credentails');
        }
    }
    
}
