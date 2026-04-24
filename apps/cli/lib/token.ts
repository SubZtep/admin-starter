import { ACCESS_TOKEN_KEY, SERVICE_NAME } from "./vars"

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

export async function deleteAccessToken() {
  return await Bun.secrets.delete({
    service: SERVICE_NAME,
    name: ACCESS_TOKEN_KEY
  })
}
