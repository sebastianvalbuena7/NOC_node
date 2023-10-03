import { CheckService } from "../domain/use-cases/checks/check-service"
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs"
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource"
import { LogRepositoryImpl } from "../infrastructure/repositories/log-impl.repository"
import { CronService } from "./cron/cron-service"
import { EmailService } from "./email/email.service"

const fileSystemLogRepository = new LogRepositoryImpl(
    new FileSystemDataSource()
)

const emailService = new EmailService()

export class Server {
    static run() {
        console.log('Server started....')

        new SendEmailLogs(emailService, fileSystemLogRepository)
            .execute(['savalbuena54@misena.edu.co'])

        CronService.createJob(
            '*/5 * * * * *',
            () => {
                new CheckService(
                    fileSystemLogRepository,
                    () => console.log('success'),
                    (error) => console.log(error)
                ).execute('https://google.com')
            }
        )
    }
}