import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmplDto } from './dto/create.dto';

@Injectable()
export class EmplacementService {

    constructor(
        private readonly prismaService: PrismaService
    ) {
        
    }

    async getAllEmpl() {
        const empls = await this.prismaService.emplacement.findMany({
            include: {
                etageres: {
                    select: {
                        capacite_max: true
                    }
                }
            }
        })
        if(!empls) throw new NotFoundException("Aucun Emplavcement trouver");
        return empls
    }

    async getEmplId(id: number) {
        const empl = await this.prismaService.emplacement.findUnique({ 
            where: {id},
            include: {
                etageres: {
                    select: {
                        capacite_max: true
                    }
                }
            }
        })
        if(!empl) throw new NotFoundException("Cet Emplacement n'existe pas");
        return empl
    }

    async addEmpl(createEmplDto: CreateEmplDto) {
        const {nom_empl} = createEmplDto
        const existEmpl = await this.prismaService.emplacement.findFirst({ where: {nom_empl}})
        if(existEmpl) throw new UnauthorizedException("Emplacement deja existant en BD");
        try{
            await this.prismaService.emplacement.create({ data: {nom_empl}})
            return {data: "Emplacement creer!"}
        }catch(err) {
            throw new UnauthorizedException("Ajout impossible", err)
        }
    }

    async updateEmpl(id: number, updateEmplDto: CreateEmplDto) {
        const {nom_empl} = updateEmplDto
        const existEmpl = await this.prismaService.emplacement.findFirst({ where: {id}})
        if(!existEmpl) throw new NotFoundException("Aucun Emplacement a editer car il n'a pas ete trouve!");
        try{
            await this.prismaService.emplacement.update({
                where: {id},
                data: {nom_empl}
            })
            return {data: "Modification Terminer!"}
        }catch(err) {
            throw new UnauthorizedException("Modification Interrompu")
        }
    }

    async deleteEmpl(id: number) {
        const existEmpl = await this.prismaService.emplacement.findFirst({ where: {id}})
        if(!existEmpl) throw new NotFoundException("Suppression Impossible");
        try{
            await this.prismaService.emplacement.delete({ where: {id}})
            return {data: "Suppression Terminer!"}
        }catch(err) {
            throw new UnauthorizedException("Suppression Interrompue!")
        }
        
    }

}
