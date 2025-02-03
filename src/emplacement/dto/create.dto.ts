import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
export class CreateEmplDto {
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    readonly nom_empl: string
}