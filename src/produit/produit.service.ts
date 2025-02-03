import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProduitDto } from './dto/create.dto';
import { UpdateProduitDto } from './dto/update.dto';

@Injectable()
export class ProduitService {

    constructor(
        private readonly prismaService: PrismaService
    ) {
        
    }

    async getAll() {
        const produits = await this.prismaService.produit.findMany({
            select: {
                nom_prod: true,
                descriptions_prod: true,
                price_unit: true,
                qte_store: true,
                categorie: {
                    select: {
                        nom_cat: true
                    }
                },
                etagere: {
                    select:{
                        capacite_max: true
                    }
                },
                lignes: {
                    select: {
                        qte_cmd: true
                    }
                },
                fournisseurs: {
                    select: {
                        qte_approv: true,
                        assigned: true
                    }
                }
            }
        })

        if(!produits) throw new NotFoundException("Aucun produits disponible!");

        return {
            data: produits
        }
    }

    async getById(id: number) {
        const produit = await this.prismaService.produit.findUnique({
            where: {id},
            select: {
                nom_prod: true,
                descriptions_prod: true,
                price_unit: true,
                qte_store: true,
                categorie: {
                    select: {
                        nom_cat: true
                    }
                },
                etagere: {
                    select:{
                        capacite_max: true
                    }
                },
                lignes: {
                    select: {
                        qte_cmd: true
                    }
                },
                fournisseurs: {
                    select: {
                        qte_approv: true,
                        assigned: true
                    }
                }
            }
        })
        if(!produit) throw new NotFoundException("Le produit est introuvable");
        return{data: produit}
    }

    async create(createProduitDto: CreateProduitDto) {
        const {nom_prod, descriptions_prod, qte_store, etagereId, categorieId, price_unit} = createProduitDto
        const etagere = await this.prismaService.etagere.findUnique({where: {id: etagereId}})
        const categorie = await this.prismaService.categorie.findUnique({where: {id: categorieId}})

        if(!etagere && !categorie) throw new UnauthorizedException("Creation impossible du produit");
        try{
            await this.prismaService.produit.create({
                data: {
                    nom_prod,
                    descriptions_prod,
                    qte_store,
                    etagereId,
                    categorieId,
                    price_unit
                }
            })
            return {
                data: "Creation terminer!"
            }
        }catch(err) {
            throw new UnauthorizedException("La creation a echouer!")
        }
    }

    async update(id: number, updateProduitDto: UpdateProduitDto) {
        const {nom_prod, descriptions_prod, price_unit, etagereId, categorieId, qte_store} = updateProduitDto
        const produit = await this.prismaService.produit.findUnique({ where: {id}})
        if(!produit) throw new NotFoundException("Aucun produit trouver pour modification");
        try{
            await this.prismaService.produit.update({
                where: {id},
                data: {
                    nom_prod,
                    descriptions_prod,
                    price_unit,
                    etagereId,
                    categorieId,
                    qte_store
                }
            })
            return {data: "Modification terminer"}
        }catch(err) {
            throw new UnauthorizedException("Modification interrompue!")
        }
    }

    async delete(id: number) {
        const product = await this.prismaService.produit.findFirst({where: {id}})
        if(!product) throw new NotFoundException("Suppression Impossible car le produit n'existe pas");
        try {
           this.prismaService.produit.delete({where: {id}}) 
        } catch (error) {
            throw new Error(`Suppression Impossible: ${error.message}`)
        }
    }

}
