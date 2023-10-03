import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple"
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs"
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource"
import { MongoLogDataSource } from "../infrastructure/datasources/mongo-log.datasource"
import { PostgresLogDataSource } from "../infrastructure/datasources/postgres-log.datasource"
import { LogRepositoryImpl } from "../infrastructure/repositories/log-impl.repository"
import { CronService } from "./cron/cron-service"
import { EmailService } from "./email/email.service"

// const logRepository = new LogRepositoryImpl(
//     // new FileSystemDataSource()
//     new PostgresLogDataSource()
//     // new MongoLogDataSource()
// )

const fsLogRepository = new LogRepositoryImpl (
    new FileSystemDataSource()
)

const MongoLogRepository = new LogRepositoryImpl (
    new MongoLogDataSource()
)

const PostgresLogRepository = new LogRepositoryImpl(
    new PostgresLogDataSource()
)

const emailService = new EmailService()

export class Server {
    static run() {
        console.log('Server started....')

        new SendEmailLogs(emailService, PostgresLogRepository)
            .execute(['savalbuena54@misena.edu.co'])

        // CronService.createJob(
        //     '*/5 * * * * *',
        //     () => {
        //         new CheckService(
        //             logRepository,
        //             () => console.log('success'),
        //             (error) => console.log(error)
        //         ).execute('https://google.com')
        //     }
        // )

        CronService.createJob(
            '*/5 * * * * *',
            () => {
                new CheckServiceMultiple(
                    [fsLogRepository, MongoLogRepository, PostgresLogRepository],
                    () => console.log('success'),
                    (error) => console.log(error)
                ).execute('https://google.com')
            }
        )
    }
}