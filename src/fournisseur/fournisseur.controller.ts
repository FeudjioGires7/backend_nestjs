import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { FournisseurService } from './fournisseur.service';
import { CreateFournisseurDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@Controller('fournisseur')
export class FournisseurController {

    constructor(
        private readonly fournisseurService: FournisseurService
    ) {
        
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('api/getAll')
    getAll() {
        return this.fournisseurService.getAll()
    }

    @Get('api/getById/:id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.fournisseurService.getById(id)
    }

    @Post('api/create')
    create(@Body() create: CreateFournisseurDto) {
        return this.fournisseurService.create(create)
    }


    @Put('api/update/:id')
    update(
        @Param('id', ParseIntPipe,) id: number,
        @Body() update: CreateFournisseurDto
    ) {
        return this.fournisseurService.update(id, update)
    }

    @Delete('api/delete/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.fournisseurService.delete(id)
    }

}
