import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs'
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
@Injectable()
export class MailerService {

    constructor(@InjectQueue('mail-queue') private readonly mailQueue: Queue) {
        
    }

    async sendSignupConfirmation(email: string) {
        await this.mailQueue.add('sendSignupConfirmation', {email})
    }

    async sendResetPasswordDemand(email: string, code: string, url: string) {
        await this.mailQueue.add('sendResetPasswordDemand', {
            email,
            code,
            url
        })
    }

    // private async transporter() {
    //     const testAccount = await nodemailer.createTestAccount()
    //     const transport = nodemailer.createTransport({
    //         host: 'localhost',
    //         port: 1025,
    //         ignoreTLS: true,
    //         auth: {
    //             user: testAccount.user,
    //             pass: testAccount.pass
    //         }
    //     })
    //     // console.log('yes');
    //     return transport
    // }

    // async sendSignupConfirmation(email: string) {
    //     try {
    //         const box = (await this.transporter()).sendMail({
    //             from: 'giresjaphet@gmail.com',
    //             to: email,
    //             subject: 'Confirmation de votre inscription',
    //             html: await ejs.renderFile('src/templates/welcome.html'),
    //             text: 'Bienvenue sur notre plateforme'
    //         })
            
    //     } catch (error) {
    //         throw new ForbiddenException("Email d'inscription non envoyer", error.message)
    //     }
    // }

    // async sendResetPasswordDemand(email: string, code: string, url: string) {
    //     try {
    //         const html = await ejs.renderFile('src/templates/resetConfirmationPassword.ejs', {code, url});
    //         (await this.transporter()).sendMail({
    //             from: 'giresjaphet@gmail.com',
    //             to: email,
    //             subject: 'Demande de reinitialisation de mot de passe',
    //             html: html,
    //             text: `Voici votre code de reinitialisation: ${code}. Veuillez cliquer sur ce lien pour reinitialiser votre mot de passe: ${url}`
    //         })
    //     } catch (error) {
    //         throw new NotFoundException("Email de demande de modification non envoyer", error.message)
    //     }
    // }
}
