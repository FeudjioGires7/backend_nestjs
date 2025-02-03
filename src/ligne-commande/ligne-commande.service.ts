import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLigneDto } from './dto/Create.dto';

@Injectable()
export class LigneCommandeService {
    constructor(
        private readonly prismaService: PrismaService
    ) {
        
    }

    async getAll() {
        const lignes = await this.prismaService.ligne.findMany({
            include: {
                produit: {
                    select: {
                        nom_prod: true,
                        descriptions_prod: true,
                        price_unit: true,
                        qte_store: true
                    }
                },
                commande: {
                    select: {
                        userId: true,
                        nom_clt: true,
                        date_livraison: true,
                        status: true
                    }
                }
            }
        })

        return lignes
    }

    async getById(id: number) {
        const ligne = await this.prismaService.ligne.findUnique({
            where: {id},
            include: {
                produit: {
                    select: {
                        nom_prod: true,
                        descriptions_prod: true,
                        price_unit: true,
                        qte_store: true
                    }
                },
                commande: {
                    select: {
                        userId: true,
                        nom_clt: true,
                        date_livraison: true,
                        status: true
                    }
                }
            }
        })
        if(!ligne) throw new NotFoundException('Ligne inexistante');
        return ligne
    }

    async create(create: CreateLigneDto) {
        const {produitId, commandeId, qte_cmd} = create
        const produit = await this.prismaService.produit.findUnique({where: {id: produitId}})
        const commande = await this.prismaService.commande.findUnique({where: {id: commandeId}})
        if(produit && commande) {
            const ligne = await this.prismaService.ligne.findFirst({
                where: {
                    produitId: {
                        equals: produitId
                    },
                    commandeId: {
                        equals: commandeId
                    }
                }
            })
            if(ligne) throw new UnauthorizedException("Ligne de commande existante!");
            
                const new_qte_store = produit.qte_store - qte_cmd
                if(new_qte_store < 0) throw new UnauthorizedException("La quantite demander est superieur a celle en stock");
                try{
                    await this.prismaService.produit.update({
                        where: {
                            id: produitId
                        },
                        data: {
                            qte_store: new_qte_store
                        }
                    })
                    await this.prismaService.ligne.create({
                        data: {produitId, commandeId, qte_cmd}
                    })
                    return {data: "Ligne ajouter"}
                }catch(err) {
                    throw new UnauthorizedException("Erreur serveur lors de la creation de la ligne!", err.message)
                }
        }else {
            throw new UnauthorizedException("Aucun produit ou de commande correspondant")
        }
        
    }

    async update(id: number, update: CreateLigneDto) {
        const ligne = await this.prismaService.ligne.findUnique({where: {id}})
        if(!ligne) throw new NotFoundException("Aucun ligne trouver");
        try{
            await this.prismaService.ligne.update({
                data: {...update},
                where: {id}
            })
            return {data: "Ligne modifier"}
        }catch(err) {
            throw new UnauthorizedException("Erreur serveur lors de la modification")
        }
    }

    async delete(id: number) {
        const ligne = await this.prismaService.ligne.findUnique({where: {id}})
        if(!ligne) throw new NotFoundException("Ligne introuvable");
        try{
            await this.prismaService.ligne.delete({where:{id}})
        }catch(err) {
            throw new UnauthorizedException("Erreur du serveur lors de la suppression")
        }
    }
}
