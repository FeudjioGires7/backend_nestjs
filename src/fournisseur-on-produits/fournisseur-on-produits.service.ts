import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFournisseurOnProduitsDto } from './dto/create.dto';

@Injectable()
export class FournisseurOnProduitsService {

    constructor(
        private prismaService: PrismaService
    ) {
        
    }

    async getAll() {
        const fournisseurOnProduits = await this.prismaService.fournisseurOnProduits.findMany({
            include: {
                produit: {
                    select: {
                        nom_prod: true,
                        descriptions_prod: true,
                        price_unit: true,
                        qte_store: true
                    }
                },
                fournisseur: {
                    select: {
                        nom_fournisseur: true,
                        adresse_fournisseur: true,
                        email_fournisseur: true,
                        contact_fournisseur: true,

                    }
                }
            }
        })

        if(!fournisseurOnProduits) throw new NotFoundException("Aucun liaison trouver");
        return fournisseurOnProduits
    }

    async getById(fournisseurId: number, produitId: number) {
        const fournisseurOnProduit = await this.prismaService.fournisseurOnProduits.findFirst({
            where: { fournisseurId, produitId},
            include: {
                produit: {
                    select: {
                        nom_prod: true,
                        descriptions_prod: true,
                        price_unit: true,
                        qte_store: true
                    }
                },
                fournisseur: {
                    select: {
                        nom_fournisseur: true,
                        adresse_fournisseur: true,
                        email_fournisseur: true,
                        contact_fournisseur: true,

                    }
                }
            }
        })

        if(!fournisseurOnProduit) throw new NotFoundException("Aucune liaison");
        return fournisseurOnProduit
    }

    async create(create: CreateFournisseurOnProduitsDto) {
        const {fournisseurId,produitId,qte_approv} = create
        const fournisseur = await this.prismaService.fournisseur.findUnique({where:{id:fournisseurId}})
        if(!fournisseur) throw new NotFoundException("Ce fournisseur n'existe pas pour pouvoir assurer un approvisionnement");
        const produit = await this.prismaService.produit.findUnique({where: {id:produitId}})
        if(!produit) throw new NotFoundException("Ce produit n'existe pas pour etre approvisionner");
        try{
            if(produitId && fournisseurId) throw new UnauthorizedException("Creation impossible car cette ligne existe deja")
            await this.prismaService.fournisseurOnProduits.create({
                data: {...create}
            })
            
            await this.prismaService.produit.update({
                where: {id: produitId},
                data: {
                    qte_store: qte_approv + produit.qte_store
                }
            })
            return {data:"Approvissionnement terminer!"}
        }catch(err) {
            throw new UnauthorizedException("Erreur lors de la creation", err.message)
            
        }
    }

    // async update() {

    // }
}
