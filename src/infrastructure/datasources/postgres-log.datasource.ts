import { LogDataSource } from "../../domain/datasources/log.datasource"
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity"
import { PrismaClient, SeverityLevel } from '@prisma/client';

const prismaClient = new PrismaClient()

const severityEnum = {
    low: SeverityLevel.LOW,
    medium: SeverityLevel.MEDIUM,
    high: SeverityLevel.HIGH
}

export class PostgresLogDataSource implements LogDataSource {
    async saveLog(log: LogEntity): Promise<void> {
        const level = severityEnum[log.level]

        try {
            await prismaClient.logModel.create({
                data: {
                    ...log,
                    level
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        const level = severityEnum[severityLevel]

        const dbLogs = await prismaClient.logModel.findMany({
            where: { level }
        })

        return dbLogs.map((log: any) => LogEntity.fromObject(log))
    }
}