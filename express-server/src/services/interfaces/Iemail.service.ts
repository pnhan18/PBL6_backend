export interface IEmailService {
    sendEmail(toEmail: string, subject: string, html: string, text?: string) : Promise<void>;
}