import { CheckService } from "../domain/use-cases/checks/check-service"
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource"
import { LogRepositoryImpl } from "../infrastructure/repositories/log-impl.repository"
import { CronService } from "./cron/cron-service"

const fileSystemLogRepository = new LogRepositoryImpl(
    new FileSystemDataSource()
) 

export class Server {
    static run() {
        console.log('Server started....')

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