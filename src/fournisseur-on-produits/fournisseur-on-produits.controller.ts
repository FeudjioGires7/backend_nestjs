import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { FournisseurOnProduitsService } from './fournisseur-on-produits.service';
import { CreateFournisseurOnProduitsDto } from './dto/create.dto';

@Controller('fournisseur-on-produits')
export class FournisseurOnProduitsController {

    constructor(
        private readonly fournisseurOnProduitsService: FournisseurOnProduitsService
    ) {
        
    }

    @Get('api/getAll')
    getAll() {
        return this.fournisseurOnProduitsService.getAll()
    }

    @Get('api/getById/:fournisseurId/:produitId')
    getById(
        @Param('fournisseurId', ParseIntPipe) fournisseurId: number,
        @Param('produitId', ParseIntPipe) produitId: number
    ) {
        return this.fournisseurOnProduitsService.getById(fournisseurId, produitId)
    }

    @Post('api/create')
    create(
        @Body() create: CreateFournisseurOnProduitsDto
    ) {
        return this.fournisseurOnProduitsService.create(create)
    }

    // @Put('api/update/:fournisseurId/:produitId')
    // update(
    //     @Param('fournisseurId', ParseIntPipe) fournisseurId: number,
    //     @Param('produitId', ParseIntPipe) produitId: number
    // ) {
    //     return this.fournisseurOnProduitsService.update()
    // }
}
