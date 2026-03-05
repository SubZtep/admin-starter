import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export function createAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "15m" })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { sub: string }
}
