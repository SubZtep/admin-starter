import { Body, Head, Html } from "@react-email/components"

export function Email({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Body>
        <h1>{title}</h1>
        {children}
      </Body>
    </Html>
  )
}
