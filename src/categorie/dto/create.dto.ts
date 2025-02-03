import { IsNotEmpty, MinLength } from "class-validator";
export class CreateCatDto {
    @IsNotEmpty()
    @MinLength(5)
    readonly nom_cat: string
}