import { Body, Font, Head, Html } from "@react-email/components"

export function Email({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Html lang="en">
      <Head>
        <Font fontFamily="Trebuchet MS" fallbackFontFamily="Verdana" />
      </Head>
      <Body style={{ backgroundColor: "whitesmoke", color: "darkslateblue", padding: "1rem" }}>{children}</Body>
    </Html>
  )
}
