import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCatDto } from './dto/create.dto';

@Injectable()
export class CategorieService {

    constructor(
        private readonly prismaService: PrismaService
    ) {
        
    }

    async getAll() {
        try{
            const categories = await this.prismaService.categorie.findMany({
                include: {
                    produits: {
                        select: {
                            nom_prod: true,
                            descriptions_prod: true,
                            price_unit: true
                        }
                    }
                }
            })
            return {data: categories}
        }catch(err) {
            throw new UnauthorizedException("Aucune categories disponible")
        }
    }

    async getById(id: number) {
        const existCat = await this.prismaService.categorie.findFirst({ 
            where: {id},
            include: {
                produits: {
                    select: {
                        nom_prod: true,
                        descriptions_prod: true,
                        price_unit: true
                    }
                }
            }
        })
        if(!existCat) throw new NotFoundException("Cet Categorie n'existe pas!");
        return {data: existCat}
    }

    async create(create: CreateCatDto) {
        const {nom_cat} = create
        const existCat = await this.prismaService.categorie.findFirst({ where: {nom_cat}})
        if(existCat) throw new UnauthorizedException("Categorie deja existante en BD");
        try{
            await this.prismaService.categorie.create({
                data: {nom_cat}
            })
            return {data: "Categorie Creer!"}
        }catch(err) {
            throw new UnauthorizedException("Ajout interompu")
        }
    }

    async update(id: number, update: CreateCatDto) {
        const {nom_cat} = update
        const existCat = await this.prismaService.categorie.findFirst({ where: {id}})
        if(!existCat) throw new NotFoundException("Categorie introuvable pour modification");
        try {
            await this.prismaService.categorie.update({
                where: {id},
                data: {nom_cat}
            })
        } catch (error) {
            throw new UnauthorizedException("Modification Impossible")
        }
    }

    async delete(id: number) {
        const existCat = await this.prismaService.categorie.findFirst({ where: {id}})
        if(!existCat) throw new NotFoundException("Categorie introuvable pour Suppression");
        try{
            await this.prismaService.categorie.delete({ where: {id}})
        }catch(err) {
            throw new UnauthorizedException("Modification Impossible")   
        }
    }
}
