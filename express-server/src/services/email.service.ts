import { IEmailService } from "./interfaces/Iemail.service";
import nodemailer, { Transporter } from "nodemailer";
import { Service } from "typedi";
import dotenv from "dotenv";
dotenv.config();

@Service()
export class EmailService implements IEmailService {
    private transport: Transporter;

    constructor() {
        this.transport = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_NAME,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }

    async sendEmail(toEmail: string, subject: string, html: string, text?: string) {
        try {
            const mailOptions = {
                from: process.env.MAIL_NAME,
                to: toEmail,
                subject: subject,
                text,
                html
            }
            await this.transport.sendMail(mailOptions);
        }catch(err) {
            throw err;
        }
    }
}