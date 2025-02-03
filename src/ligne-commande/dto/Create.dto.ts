import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateLigneDto {
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    readonly produitId: number
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    readonly commandeId: number
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    readonly qte_cmd: number
}