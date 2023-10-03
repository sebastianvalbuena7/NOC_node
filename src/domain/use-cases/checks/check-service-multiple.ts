import { LogEntity, LogSeverityLevel } from "../../entities/log.entity"
import { LogRepository } from "../../repository/log.repository"

interface CheckServiceUseCaseMultiple {
    execute(url: string): Promise<boolean>
}

type SuccessCallback = (() => void | undefined)
type FailureCallback = ((error: string) => void | undefined)

export class CheckServiceMultiple implements CheckServiceUseCaseMultiple {
    constructor(
        private readonly logRepository: LogRepository[],
        private readonly successCallback: SuccessCallback,
        private readonly failureCallback: FailureCallback
    ) { }

    private callLogs(log: LogEntity) {
        this.logRepository.forEach(logRepository => {
            logRepository.saveLog(log)
        })
    }

    async execute(url: string): Promise<boolean> {
        const originFile = 'check-service.ts'
        try {
            const req = await fetch(url)
            if (!req.ok) {
                throw new Error('Error on check service')
            }

            const log = new LogEntity({
                message: `Service ${url} working`,
                origin: originFile,
                level: LogSeverityLevel.low
            })
            this.callLogs(log)
            this.successCallback()

            return true
        } catch (error) {
            const logError = new LogEntity({
                message: error as string,
                origin: originFile,
                level: LogSeverityLevel.high
            })
            this.callLogs(logError)
            this.failureCallback(error as string)
            return false
        }
    }
}