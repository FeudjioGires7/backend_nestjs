import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFournisseurDto } from './dto/create.dto';
import { UpdateFournisseurDto } from './dto/update.dto';

@Injectable()
export class FournisseurService {

    constructor(
        private readonly prismaService: PrismaService
    ) {
        
    }

    async getAll() {
        const fournisseurs = await this.prismaService.fournisseur.findMany({
            include: {
                produits: {
                    select: {
                        qte_approv: true,
                        assigned: true
                    }
                }
            }
        })
        if(!fournisseurs) throw new NotFoundException("Aucun Fournisseur!");
        return fournisseurs
    }

    async getById(id: number) {
        const fournisseur = await this.prismaService.fournisseur.findUnique({
            where: {id},
            include: {
                produits: {
                    select: {
                        qte_approv: true,
                        assigned: true
                    }
                }
            }
        })
        if(!fournisseur) throw new NotFoundException("Ce fournisseur n'existe pas!");
        return fournisseur
    }

    async create(create: CreateFournisseurDto) {
        const {nom_fournisseur, adresse_fournisseur, email_fournisseur, contact_fournisseur} = create
        const fournisseur = await this.prismaService.fournisseur.findFirst({where: {email_fournisseur}});
        if(fournisseur) throw new UnauthorizedException("Fournisseur deja present en BD");
        try {
            await this.prismaService.fournisseur.create({
                data: {
                    nom_fournisseur,adresse_fournisseur,email_fournisseur,contact_fournisseur
                }
            })
            return {data:"Fournisseur creer!"}
        } catch (error) {
            throw new UnauthorizedException("Erreur lors de la creation :", error)
        }
    }

    async update(id: number, update: UpdateFournisseurDto) {
        const fournisseur = await this.prismaService.fournisseur.findUnique({where: {id}})
        if(!fournisseur) throw new NotFoundException("Modification impossible");
        try{
            await this.prismaService.fournisseur.update({
                data: {...update},
                where: {id}
            })
            return {data: "Fournisseur modifier!"}
        }catch(err) {
            throw new UnauthorizedException("Erreur Serveur lors de la modification")
        }
    }

    async delete(id: number) {
        const fournisseur = await this.prismaService.fournisseur.findUnique({where: {id}})
        if(!fournisseur) throw new NotFoundException("Suppression impossible");
        try{
            await this.prismaService.fournisseur.delete({
                where: {id}
            })
            return{
                data: "Suppression Terminer!"
            }
        }catch(err) {
            throw new UnauthorizedException("Erreur serveur lors de la suppression")
        }
    }
}
