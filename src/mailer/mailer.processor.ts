import { Process, Processor } from "@nestjs/bull";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Job } from "bull";
import * as nodemailer from 'nodemailer';
import ejs from "ejs";
@Injectable()
@Processor('mail-queue')
export class MailerProcessor {

    private async transporter() {

        const testAccount = await nodemailer.createTestAccount()
        const transport = nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        })
        // console.log(transport);
        return transport
    }

    @Process('sendSignupConfirmation')
    async handleSendMail(job: Job<{email: string}>) {
        const {email} = job.data
        
        try {
            (await this.transporter()).sendMail({
                from: 'giresjaphet@gmail.com',
                to: email,
                subject: 'Confirmation de votre inscription',
                html: await ejs.renderFile('src/templates/welcome.html'),
                text: 'Bienvenue sur notre plateforme'
            })
            
            console.log(`Hello world`);
            
        } catch (error) {
            throw new ForbiddenException("Email d'inscription non envoyer", error.message)
        }
    }

    @Process('sendResetPasswordDemand')
    async sendResetPasswordDemand(job: Job<{email: string, code: string, url: string}>) {
        const {email, code, url} = job.data
        try {
            console.log("Email update with queues");
            
            // const html = await ejs.renderFile('src/templates/resetConfirmationPassword.ejs', {code, url});
            // (await this.transporter()).sendMail({
            //     from: 'giresjaphet@gmail.com',
            //     to: email,
            //     subject: 'Demande de reinitialisation de mot de passe',
            //     html: html,
            //     text: `Voici votre code de reinitialisation: ${code}. Veuillez cliquer sur ce lien pour reinitialiser votre mot de passe: ${url}`
            // })
        } catch (error) {
            throw new NotFoundException("Email de demande de modification non envoyer", error.message)
        }
    }
}