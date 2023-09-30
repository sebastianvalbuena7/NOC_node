import { LogEntity, LogSeverityLevel } from "../../entities/log.entity"
import { LogRepository } from "../../repository/log.repository"

interface CheckServiceUseCase {
    execute(url: string): Promise<boolean>
}

type SuccessCallback = (() => void | undefined)
type FailureCallback = ((error: string) => void | undefined)

export class CheckService implements CheckServiceUseCase {
    constructor(
        private readonly logRepository: LogRepository,
        private readonly successCallback: SuccessCallback,
        private readonly failureCallback: FailureCallback
    ) { }

    async execute(url: string): Promise<boolean> {
        try {
            const req = await fetch(url)
            if (!req.ok) {
                throw new Error('Error on check service')
            }

            const log = new LogEntity(`Service ${url} working`, LogSeverityLevel.low)
            this.logRepository.saveLog(log)
            this.successCallback() && this.successCallback()

            return true
        } catch (error) {
            const logError = new LogEntity(error as string, LogSeverityLevel.high)
            this.logRepository.saveLog(logError)
            this.failureCallback(error as string)
            return false
        }
    }
}