import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { EtagereService } from './etagere.service';
import { CreateEtegereDto } from './dto/create.dto';
import { UpdateEtegereDto } from './dto/update.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@Controller('etagere')
export class EtagereController {

    constructor(
        private readonly etagereService: EtagereService
    ) {
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('api/getAll')
    getAll() {
        return this.etagereService.getAll()
    }

    @UseGuards(JwtAuthGuard)
    @Get('api/getById/:id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.etagereService.getById(id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post('api/create')
    create(@Body() createDto: CreateEtegereDto) {
        return this.etagereService.create(createDto)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('api/update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() update: UpdateEtegereDto
    ) {
        return this.etagereService.update(id, update)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('api/delete/:id')
    delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.etagereService.delete(id)
    }

}
