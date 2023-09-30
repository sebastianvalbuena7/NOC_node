import fs from 'fs'
import { LogDataSource } from "../../domain/datasources/log.datasource"
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity"

export class FileSystemDataSource implements LogDataSource {
    private readonly logPath = 'logs/'
    private readonly allLogsPath = 'logs/logs-all.txt'
    private readonly mediumLogsPath = 'logs/logs-medium.txt'
    private readonly highLogsPath = 'logs/logs-high.txt'

    constructor() {
        this.createLogsFiles()
    }

    private createLogsFiles = () => {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath)
        }

        [this.allLogsPath, this.mediumLogsPath, this.highLogsPath]
            .forEach(path => {
                if (fs.existsSync(path)) return
                fs.writeFileSync(path, '')
            })
    }

    async saveLog(log: LogEntity): Promise<void> {
        const logJson = `${JSON.stringify(log)}\n`;

        fs.appendFileSync(this.allLogsPath, logJson)

        if (log.level === LogSeverityLevel.low) return

        if (log.level === LogSeverityLevel.medium) {
            fs.appendFileSync(this.mediumLogsPath, logJson)
        } else {
            fs.appendFileSync(this.highLogsPath, logJson)
        }
    }

    private getLogsFromFile = (path: string): LogEntity[] => {
        const content = fs.readFileSync(path, 'utf-8')

        return content.split('\n').map(log => LogEntity.fromJson(log))
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        switch (severityLevel) {
            case LogSeverityLevel.low:
                return this.getLogsFromFile(this.allLogsPath)
            case LogSeverityLevel.medium:
                return this.getLogsFromFile(this.mediumLogsPath)
            case LogSeverityLevel.high:
                return this.getLogsFromFile(this.highLogsPath)
            default:
                throw new Error(`${severityLevel} not implemented`)
        }
    }
}