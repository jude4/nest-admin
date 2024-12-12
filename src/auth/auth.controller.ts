import { Controller, Post, Body, BadRequestException, NotFoundException, Res, Req, Get, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {

    constructor(private userService: UserService, private jwtService: JwtService) {}

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
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) {
        const user = await this.userService.findOne({email});

        if (!user) {
            throw new NotFoundException('User not found');
        }
        
        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Invalid credentails');
        }

        // const payload = {sub: user.id, email: user.email};

        const jwt = await this.jwtService.signAsync({id: user.id});

        response.cookie('jwt', jwt, {httpOnly: true});

        return user;

        // return {
        //     access_token: await this.jwtService.signAsync(payload),
        // };
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request) {
       
        const cookie = request.cookies['jwt']; // get the cookie from the request

        const user = await this.jwtService.verifyAsync(cookie); // verify the cookie

        return this.userService.findOne({id: user.id});

    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

        return {
            message: 'You have successfully logged out',
        }
    }
    
}
