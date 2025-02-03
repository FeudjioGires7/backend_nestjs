import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CreateCatDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@Controller('categorie')
export class CategorieController {

    constructor(
        private readonly categoryService: CategorieService
    ) {
        
    }

    // @UseGuards(JwtAuthGuard)
    @Get('api/getAll')
    getAll() {
        return this.categoryService.getAll()
    }

    // @UseGuards(JwtAuthGuard)
    @Get('api/getById/:id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.getById(id)
    }

    // @UseGuards(JwtAuthGuard)
    @Post('api/create')
    create(@Body() create: CreateCatDto) {
        return this.categoryService.create(create)
    }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('api/update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        update: CreateCatDto
    ) {
        return this.categoryService.update(id, update)
    }

    // @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('api/delete/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.delete(id)
    }

}
