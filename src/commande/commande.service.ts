import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommandeDto } from './dto/create.dto';
import { UpdateCommandeDto } from './dto/update.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@Injectable()
export class CommandeService {

    constructor(
        private readonly prismaService: PrismaService
    ) {
        
    }

    @UseGuards(JwtAuthGuard)
    async getAll() {
        const commandes = await this.prismaService.commande.findMany({
            include: {
                ligne_commandes: {
                    select: {
                        qte_cmd: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        })
        if(!commandes) throw new NotFoundException("Aucunes commandes");
        return commandes
    }

    @UseGuards(JwtAuthGuard)
    async getById(id: number) {
        const commande = await this.prismaService.commande.findUnique({where: {id}})
        if(!commande) throw new NotFoundException("Cette commande n'existe pas");
        return commande
    }

    @UseGuards(JwtAuthGuard)
    async create(userId: number,create: CreateCommandeDto) {
        const {date_livraison, nom_clt} = create
        console.log(userId, date_livraison);
        
        try{ 
            await this.prismaService.commande.create({
                data: {
                    userId,
                    date_livraison,
                    nom_clt
                }
            })
            return {data:"Commande Creer!"}
        }catch(err) {
            throw new UnauthorizedException("Erreur lors de la creation", err.message)
        }
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    async update(id: number, update: UpdateCommandeDto) {
        const commande = await this.prismaService.commande.findUnique({where: {id}})
        if(!commande) throw new NotFoundException("Aucune commande");
        try{ 
            await this.prismaService.commande.update({
                data: {...update},
                where: {id}
            })
            return {data: "Commande modifier!"}
        }catch(err) {
            throw new UnauthorizedException("Erreur lors de la modiication", err.message)
        }
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    async delete(id: number) {
        const commande = await this.prismaService.commande.findUnique({where: {id}})
        if(!commande) throw new NotFoundException("Commande non trouver");
        try{
            await this.prismaService.commande.delete({where: {id}})
            return {data:"Commande Supprimer!"}
        }catch(err) {
            throw new UnauthorizedException("Erreur serveur lors de la suppression")
        }
    }
}
