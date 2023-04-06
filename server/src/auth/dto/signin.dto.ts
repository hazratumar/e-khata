import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}