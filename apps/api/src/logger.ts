import pino from "pino"

const targets = []

if (process.env.NODE_ENV === "development") {
  targets.push({
    target: "pino-pretty",
    level: "trace",
    options: {
      ignore: "pid,hostname,time",
      levelFirst: true,
      singleLine: true,
      colorize: true
    }
  })
}

const transport = pino.transport({ targets })
export const logger = pino({ level: "trace" }, transport)
