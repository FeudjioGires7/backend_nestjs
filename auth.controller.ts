import { Body, Controller, Delete, Post, Get, Put, Req, UseGuards, Param, ParseIntPipe, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ResetPasswordDemandConfirmationDto } from './dto/resetPasswordDemandConfirmation.dto';
// import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
        
    }

    @Post('api/signup')
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('api/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('api/reset-password-demand')
    resetPasswordDemand(@Body() resetPasswordDemandDto: ResetPasswordDemandDto) {
        return this.authService.resetPasswordDemand(resetPasswordDemandDto);
    }

    @Put('api/reset-password-confirmation')
    resetPasswordConfirmation(@Body() resetPasswordConfirmation: ResetPasswordDemandConfirmationDto) {
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmation);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete('api/logout')
    logout(@Req() request: Request) {
        const token = request.headers['authorization']?.split(' ')[1];
        return this.authService.logout(token);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('api/updateUser/:id')
    updateUser(@Param('id', ParseIntPipe) id: number) {
        return this.authService.updateUser(id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('api/updateAdmin/:id')
    updateAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.authService.updateAdmin(id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('api/users')
    getAllUser() {
        return this.authService.getAllUser();
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('api/user/:id')
    getUser(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.authService.getUser(id);
    }

    
    @UseGuards(JwtAuthGuard)
    @Delete('api/delete-account')
    deleteAccount(
        @Req() request: Request
    ) {
        return this.authService.deleteAccount(request.user['email']);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('api/delete-account-by-admin/:id')
    deleteAccountByAdmin(
        @Param('id', ParseIntPipe) userId: number
    ) {
        return this.authService.deleteAccountByAdmin(userId)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('api/users/pdf')
    async downloadUsersPDF(
        @Res() res: Response
    ): Promise<void> {
        const pdf = await this.authService.generateUsersPDF()
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=users.pdf',
            'Content-Length': pdf.length,
            'Cache-control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
        })
        res.send(pdf)
    }
    
}
