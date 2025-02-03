import { IsNotEmpty, MinLength, IsNumber } from "class-validator";
export class CreateEtegereDto {
    @IsNotEmpty()
    @IsNumber()
    readonly emplacementId: number;
    @IsNotEmpty()
    @IsNumber()
    readonly capacite_max: number
}