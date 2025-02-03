import { IsEmail, IsString, MinLength, IsNotEmpty, Min } from "class-validator";
export class SignupDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    readonly name: string;
    @IsNotEmpty()
    @IsEmail()
    @MinLength(10)
    readonly email: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    readonly password: string;
}