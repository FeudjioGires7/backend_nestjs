import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEtegereDto } from './dto/create.dto';
import { UpdateEtegereDto } from './dto/update.dto';

@Injectable()
export class EtagereService {

    constructor(
        private readonly prismaService: PrismaService
    ) {
        
    }

    async getAll() {
        try {
            const etageres = await this.prismaService.etagere.findMany({
                include: {
                    emplacement: {
                        select: {
                            nom_empl: true
                        }
                    },
                    produit: {
                        select: {
                            nom_prod: true,
                            descriptions_prod: true,
                            price_unit: true
                        }
                    }
                }
            })
            return {data: etageres}
        } catch (error) {
            throw new UnauthorizedException("Etagres introuvable")
        }
    }

    async getById(id: number) {
        const existEtagere = await this.prismaService.etagere.findFirst({ 
            where: {id},
            include: {
                emplacement: {
                    select: {nom_empl: true}
                },
                produit: {
                    select: {
                        nom_prod: true,
                        descriptions_prod: true,
                        price_unit: true
                    }
                }
            }
        })
        if(!existEtagere) throw new NotFoundException("Cet Etagere est introuvable!");
        return {data: existEtagere}
    }

    async create(create: CreateEtegereDto) {
        const {emplacementId, capacite_max} = create
        const empl = await this.prismaService.emplacement.findFirst({ where: {id: emplacementId}})
        if(!empl) throw new UnauthorizedException("Enregistrement Impossible car cet emplacement n'existe pas");
        try {
            await this.prismaService.etagere.create({
                data: {
                    emplacementId,
                    capacite_max
                }
            })
            return {data: "Etagere creer!"}
        } catch (error) {
            throw new UnauthorizedException("Enregistrement Echouer!")
        }
    }

    async update(id: number, update: UpdateEtegereDto) {
        const {emplacementId, capacite_max} = update
        const existEtagere = await this.prismaService.etagere.findFirst({ where: {id}})
        if(!existEtagere) throw new NotFoundException("L'etagere n'existe pas");
        try {
            await this.prismaService.etagere.update({
                where: {id},
                data:{
                    emplacementId,
                    capacite_max
                }
            })
            return {data: "Modification Terminer!"}
        } catch (error) {
            throw new UnauthorizedException("Modification Interrompu")
        }
    }

    async delete(id: number) {
        const existEtagere = await this.prismaService.etagere.findFirst({where: {id}})
        if(!existEtagere) throw new UnauthorizedException("Suppression Impossible");
        try{
            await this.prismaService.etagere.delete({ where: {id}})
        }catch(err) {
            throw new UnauthorizedException("Suppression Interrompu")
        }
    }

}
