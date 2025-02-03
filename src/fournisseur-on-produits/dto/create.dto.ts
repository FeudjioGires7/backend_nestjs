import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateFournisseurOnProduitsDto {
    @IsNumber()
    @IsNotEmpty()
    readonly fournisseurId: number
    @IsNumber()
    @IsNotEmpty()
    readonly produitId: number
    @IsNumber()
    @IsNotEmpty()
    readonly qte_approv: number
}