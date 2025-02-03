import { IsNotEmpty, MinLength, IsNumber, IsOptional } from "class-validator";
export class UpdateEtegereDto {
    @IsNotEmpty()
    @IsOptional()
    @IsNumber()
    readonly emplacementId: number;
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    readonly capacite_max: number
}