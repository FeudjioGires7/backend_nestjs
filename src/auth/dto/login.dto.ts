import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
export class LoginDto {
    @IsNotEmpty()
    @MinLength(10)
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(5)
    @IsString()
    readonly password: string;
}