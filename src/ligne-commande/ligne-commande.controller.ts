import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { LigneCommandeService } from './ligne-commande.service';
import { CreateLigneDto } from './dto/Create.dto';

@Controller('ligne-commande')
export class LigneCommandeController {

    constructor(
        private readonly ligneCommandeService: LigneCommandeService
    ) {
        
    }

    @Get('api/all')
    getAll() {
        return this.ligneCommandeService.getAll()
    }

    @Get('api/getById/:id')
    getById(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.ligneCommandeService.getById(id)
    }

    @Post('api/create')
    create(
        @Body() create: CreateLigneDto
    ) {
        return this.ligneCommandeService.create(create)
    }

    @Put('api/update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() update: CreateLigneDto
    ) {
        return this.ligneCommandeService.update(id, update)
    }

    @Delete('api/delete/:id')
    delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.ligneCommandeService.delete(id)
    }
}
