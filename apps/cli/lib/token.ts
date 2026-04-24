const SERVICE_NAME = "io.kaja"
const ACCESS_TOKEN_KEY = "access_token"

export async function getAccessToken() {
  const token = await Bun.secrets.get({
    service: SERVICE_NAME,
    name: ACCESS_TOKEN_KEY
  })
  return token?.trim() ?? ""
}

export async function setAccessToken(value: string) {
  await Bun.secrets.set({
    service: SERVICE_NAME,
    name: ACCESS_TOKEN_KEY,
    value
  })
}
