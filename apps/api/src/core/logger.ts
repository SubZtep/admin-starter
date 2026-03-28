import pino from "pino"

let transport: ReturnType<typeof pino.transport> | undefined

if (process.env.NODE_ENV === "development") {
  try {
    transport = pino.transport({
      targets: [
        {
          target: "pino-pretty",
          level: "trace",
          options: {
            ignore: "pid,hostname",
            translateTime: "SYS:HH:MM",
            levelFirst: true,
            singleLine: true,
            colorize: true,
            destination: 1 // 1 is stdout, all logs (including error) go to stdout
          }
        }
      ]
    })
  } catch {
    // If pino-pretty can't be resolved in some runtime images, fallback to JSON logs.
    transport = undefined
  }
}

export const logger = pino({ level: "trace" }, transport)
