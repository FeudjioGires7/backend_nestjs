import { IsNotEmpty, MinLength, IsNumber, IsString, IsOptional } from "class-validator"
export class UpdateProduitDto {
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    readonly categorieId: number
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    readonly etagereId: number
    @IsNotEmpty()
    @MinLength(5)
    @IsString()
    @IsOptional()
    readonly nom_prod: string
    @IsNotEmpty()
    @MinLength(5)
    @IsString()
    @IsOptional()
    readonly descriptions_prod: string
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    readonly price_unit: number
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    readonly qte_store: number
}