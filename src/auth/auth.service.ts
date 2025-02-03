import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as ejs from 'ejs';
import * as puppeteer from 'puppeteer';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ResetPasswordDemandConfirmationDto } from './dto/resetPasswordDemandConfirmation.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly mailerService: MailerService,
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        
    }

    async signup(signupDto: SignupDto) {
        const {name, email, password} = signupDto;
        const user = await this.prismaService.user.findUnique({ where: { email }});
        if (user) throw new ConflictException("Cet email est deja utilise");
        const hash = await bcrypt.hash(password, 10);
        // const response = await this.prismaService.user.create({ data: {name, email, password: hash}});
        // if (response === null || response === undefined) throw new ConflictException("Erreur lors de l'inscription");   
        await this.mailerService.sendSignupConfirmation(email);
        return {message: "Inscription reussie"};

    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        const user = await this.prismaService.user.findUnique({ where: { email }});
        if (!user) throw new NotFoundException("Cet email n'existe pas");
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException("Erreur d'authentification");
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        }
        const token = this.jwtService.sign(payload, {
            expiresIn: '2h',
            secret: this.configService.get('SECRET_KEY')
        })

        return {
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }

        }
    }

    async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
        const {email} = resetPasswordDemandDto;
        const user = await this.prismaService.user.findUnique({ where: { email }});
        if (!user) throw new NotFoundException("Cet email n'existe pas");
        const code = speakeasy.totp({
            secret: this.configService.get('OTP_CODE'),
            digits: 5,
            step: 60*15,
            encoding: 'base32'
        })
        
        const url = 'http://localhost:4200/reset-password';

        await this.mailerService.sendResetPasswordDemand(email, code, url);
        return {data: "Demande de reinitialisation de mot de passe accorder"}
    }

    async resetPasswordConfirmation(resetPasswordConfirmation: ResetPasswordDemandConfirmationDto) {
        try {
            const {email, code, password} = resetPasswordConfirmation
            const user = await this.prismaService.user.findUnique({ where: {email}})
            if(!user) throw new NotFoundException("Utilisateur introuvable")
            const match = speakeasy.totp.verify({
                secret: this.configService.get("OTP_CODE"),
                token: code,
                digits: 5,
                step: 60*15,
                encoding: 'base32'
            })
            if(!match) throw new UnauthorizedException("Action non autorisee")
            const hash = await bcrypt.hash(password, 10)
            await this.prismaService.user.update({
                where: {email},
                data: {
                    password: hash
                }
            })
        } catch (error) {
            throw new UnauthorizedException("Modification du compte impossible", error.message)
        }
    }

    async logout(token: string) {
        await this.prismaService.invalidToken.create({ data: {token}})
        return {message: "Deconnexion reussie"}
    }

    async getAllUser() {
        const users = await this.prismaService.user.findMany({
            select: {
                name: true,
                email: true,
                password: false,
                role: true,
                commandes: {
                    select: {
                        date_livraison: true,
                        status: true,
                        nom_clt: true
                    }
                }
            }
        });
        if(users.length === 0) throw new NotFoundException("Aucun utilisateur trouve");
        return {
            data: users
        }
    }

    async getUser(id: number) {
        
        const user = await this.prismaService.user.findUnique({
            where: { id },
            select: {
                name: true,
                email: true,
                password: false,
                role: true,
                commandes: {
                    select: {
                        date_livraison: true,
                        status: true,
                        nom_clt: true
                    }
                }
            }
        });
        if (!user) throw new NotFoundException("Utilisateur introuvable");
        return {
            message: "Utilisateur trouve",
            data: user
        }
    }

    async deleteAccount(email: string) {
        const user = await this.prismaService.user.findUnique({ where: { email }});
        if (!user) throw new NotFoundException("Utilisateur introuvable");
        const response = await this.prismaService.user.delete({ where: { email }});
        if (!response) throw new ConflictException("Erreur lors de la suppression du compte");
        return {message: "Compte supprime"};
    }

    async updateUser(id: number) {
        const user = await this.prismaService.user.findFirst({ where: {id}})
        if(!user) throw new NotFoundException("Aucun utilisateur trouver");
        await this.prismaService.user.update({
            where: {id},
            data: {role: 'ADMIN'}
        })
        return {data: "Role modifier"}
    }

    async updateAdmin(id: number) {
        const user = await this.prismaService.user.findFirst({ where: {id}})
        if(!user) throw new NotFoundException("Aucun utilisateur trouver");
        await this.prismaService.user.update({
            where: {id},
            data: {role: 'GESTIONNAIRE'}
        })
        return {data: "Role modifier"}
    }

    async deleteAccountByAdmin(userId: number) {
        const user = await this.prismaService.user.findUnique({where: {id: userId}})
        if(!user) throw new NotFoundException("Aucun utilisateur trouver");
        try{
            await this.prismaService.user.delete({
                where: {
                    id: userId
                }
            })
            return {data: "Utilisateur supprimer"}
        }catch(err) {
            throw new UnauthorizedException("Erreur lors de la suppression")
        }
    }

    async generateUsersPDF(): Promise<Buffer> {
        const users = await this.prismaService.user.findMany({
            select: {
                name: true,
                email: true,
                role: true,
                createdAt: true,
                commandes: {
                    select: {
                        date_livraison: true,
                        status: true,
                        nom_clt: true,
                        createdAt: true
                    }
                }
            }
        })
        try {
            const html = await ejs.renderFile('src/templates/users.ejs', {users})
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            await page.setContent(html)
            const buffer = await page.pdf({
                format: 'A4',
                margin: {
                    left: '0px',
                    top: '0px',
                    right: '0px',
                    bottom: '0px'
                }
            })
            await browser.close()
            return Buffer.from(buffer)
        } catch (error) {
            throw new Error(`Erreur inattendue : ${error.message}`)
        }
    }
}