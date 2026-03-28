import { Body, Container, Font, Head, Html } from "@react-email/components"
import type { User } from "better-auth"

export type EmailType = "verification" | "changeEmail" | "resetPassword"

export interface EmailPayload {
  user: User
  url: string
  [key: string]: string | number | boolean | User | Record<string, unknown>
}

export interface ChangeEmailPayload extends EmailPayload {
  newEmail: string
}

export type SendEmailArgs =
  | { type: "changeEmail"; payload: ChangeEmailPayload }
  | { type: "verification"; payload: EmailPayload }
  | { type: "resetPassword"; payload: EmailPayload }

export function EmailContainer({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Html lang="en">
      <Head>
        <Font fontFamily="Trebuchet MS" fallbackFontFamily="Verdana" />
        <style>
          {`
            body {
              padding: 1rem;
              background-color: darkgreen;
            }
            h2 {
              font-size: 21px !important;
              letter-spacing: 1px;
              line-height: 2;
            }
            p {
              font-size: 17px !important;
              letter-spacing: 2px;
              line-height: 1.5;
            }
            a {
              display: block;
              margin: 1rem 0;
              padding: 0.1rem 0;
              color: ghostwhite;
              background-color: rebeccapurple;
              text-decoration-color: pink;
              text-decoration-thickness: 2px;
              text-decoration-line: overline !important;
              &:hover {
                text-decoration-color: skyblue;
                text-decoration-thickness: 4px;
              }
            }
          `}
        </style>
      </Head>
      <Body>
        <Container style={{ backgroundColor: "darkolivegreen", color: "yellow", padding: "1rem" }}>
          {children}
        </Container>
      </Body>
    </Html>
  )
}
