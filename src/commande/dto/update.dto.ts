import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateCommandeDto {
    @IsNotEmpty()
    @IsOptional()
    @IsDate()
    @Type( () => Date)
    readonly date_livraison: Date
    @IsNotEmpty()
    @IsOptional()
    @IsBoolean()
    readonly status: boolean
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @MinLength(5)
    readonly nom_clt: string

}