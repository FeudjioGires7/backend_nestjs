import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CreateCommandeDto } from './dto/create.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { UpdateCommandeDto } from './dto/update.dto';

@Controller('commande')
export class CommandeController {

    constructor(
        private readonly commandeService: CommandeService
    ) {
        
    }
    @UseGuards(JwtAuthGuard)
    @Get('api/getAll')
    getAll() {
        return this.commandeService.getAll()
    }

    @UseGuards(JwtAuthGuard)
    @Get('api/getById/:id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.commandeService.getById(id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post('api/create')
    create(
        @Body() create: CreateCommandeDto,
        @Req() request: Request
    ) {
        const userId = request.user['sub']
        return this.commandeService.create(userId,create)
    }

    @Put('api/update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() update: UpdateCommandeDto
    ) {
        return this.commandeService.update(id, update)
    }

    @Delete('api/delete/:id')
    delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.commandeService.delete(id)
    }
}
