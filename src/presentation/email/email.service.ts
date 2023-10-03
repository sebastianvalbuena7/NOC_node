import { createTransport } from 'nodemailer'
import { envs } from '../../config/plugins/envs.plugin'

interface SendEmailOptions {
    to: string | string[]
    subject: string
    htmlBody: string
    attachments?: Attachment[]
}

interface Attachment {
    filename: string,
    path: string
}

export class EmailService {
    private transporter = createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    })

    constructor(
    ) { }

    async sendEmail(options: SendEmailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachments = [] } = options

        try {
            await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments
            })

            return true
        } catch (error) {

            return false
        }
    }

    async sendEmailWithFileSystemLogs(to: string | string[],) {
        const subject = 'Logs del servidor'
        const htmlBody = `
        <h3>Log de Sistemas - NOC</h3>
        <p>Lorem ipsum</p>
        <p>Ver logs adjuntos</p>`
        const attachments: Attachment[] = [
            {
                filename: 'logs-all.txt',
                path: './logs/logs-all.txt'
            },
            {
                filename: 'logs-high.txt',
                path: './logs/logs-high.txt'
            },
            {
                filename: 'logs-medium.txt',
                path: './logs/logs-medium.txt'
            }
        ]

        this.sendEmail({
            to, subject, attachments, htmlBody
        })
    }
}