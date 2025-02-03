import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { EmplacementService } from './emplacement.service';
import { CreateEmplDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@Controller('emplacement')
export class EmplacementController {

    constructor(
        private readonly emplService: EmplacementService
    ) {
        
    }
    

    @UseGuards(JwtAuthGuard)
    @Get('api/getAll')
    getAllEmpl() {
        return this.emplService.getAllEmpl()
    }

    @UseGuards(JwtAuthGuard)
    @Get('api/getById/:id')
    getEmplId(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.emplService.getEmplId(id)
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('api/create')
    addEmpl(@Body() createEmplDto: CreateEmplDto) {
        return this.emplService.addEmpl(createEmplDto)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('api/update/:id')
    updateEmpl(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEmplDto: CreateEmplDto
    ) {
        return this.emplService.updateEmpl(id, updateEmplDto)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('api/delete/:id')
    deleteEmpl(@Param('id', ParseIntPipe) id: number) {
        return this.emplService.deleteEmpl(id)
    }
}
