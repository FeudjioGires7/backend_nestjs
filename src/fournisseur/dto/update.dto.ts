import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from "class-validator"
export class UpdateFournisseurDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @IsOptional()
    readonly nom_fournisseur: string
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @IsOptional()
    readonly adresse_fournisseur: string
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MinLength(5)
    @IsOptional()
    readonly email_fournisseur: string
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @IsOptional()
    readonly contact_fournisseur: string
}