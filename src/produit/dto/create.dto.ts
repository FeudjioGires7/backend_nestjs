import { IsNotEmpty, MinLength, IsNumber, IsString } from "class-validator"
export class CreateProduitDto {
    @IsNumber()
    @IsNotEmpty()
    readonly categorieId: number
    @IsNumber()
    @IsNotEmpty()
    readonly etagereId: number
    @IsNotEmpty()
    @MinLength(5)
    @IsString()
    readonly nom_prod: string
    @IsNotEmpty()
    @MinLength(5)
    @IsString()
    readonly descriptions_prod: string
    @IsNumber()
    @IsNotEmpty()
    readonly price_unit: number
    @IsNumber()
    @IsNotEmpty()
    readonly qte_store: number
}