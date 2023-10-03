export enum LogSeverityLevel {
    low = 'low',
    medium = 'medium',
    high = 'high'
}

export interface LogEntityOptions {
    level: LogSeverityLevel
    message: string
    createdAt?: Date
    origin: string
}

export class LogEntity {
    level: LogSeverityLevel
    message: string
    createdAt: Date
    origin: string

    constructor(options: LogEntityOptions) {
        const { level, message, origin, createdAt = new Date() } = options
        this.level = level
        this.message = message
        this.createdAt = createdAt
        this.origin = origin
    }

    static fromJson = (json: string): LogEntity => {
        const { message, level, createdAt, origin } = JSON.parse(json)

        if (!message) throw new Error('Message is required')

        const log = new LogEntity({ message, level, origin, createdAt })
        log.createdAt = new Date(createdAt)

        return log
    }
}