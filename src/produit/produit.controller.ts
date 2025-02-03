import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ProduitService } from './produit.service';
import { CreateProduitDto } from './dto/create.dto';
import { UpdateProduitDto } from './dto/update.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@Controller('produit')
export class ProduitController {

    constructor(
        private readonly produitService: ProduitService
    ) {
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('api/getAll')
    getAll() {
        return this.produitService.getAll()
    }

    @UseGuards(JwtAuthGuard)
    @Get('api/getById/:id')
    getById(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.produitService.getById(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post('api/create')
    create(
        @Body() createProduitDto: CreateProduitDto
    ) {
        return this.produitService.create(createProduitDto)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('api/update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProduitDto: UpdateProduitDto
    ) {
        return this.produitService.update(id, updateProduitDto)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('api/delete/:id')
    delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.produitService.delete(id)
    }
}
