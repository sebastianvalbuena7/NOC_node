import { LogModel } from "../../data/mongo";
import { LogDataSource } from "../../domain/datasources/log.datasource"
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class MongoLogDataSource implements LogDataSource {
    async saveLog(log: LogEntity): Promise<void> {
        await LogModel.create(log)
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        const logs = await LogModel.find({
            level: severityLevel
        })

        return logs.map(log => LogEntity.fromObject(log))
    }
}