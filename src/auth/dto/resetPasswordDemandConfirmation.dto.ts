import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class ResetPasswordDemandConfirmationDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    readonly code: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}