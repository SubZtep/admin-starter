import { faker } from "@faker-js/faker"

const NUMBER_OF_USERS = 100
const DEFAULT_PASSWORD = "P4$sword"

for (let i = 0; i < NUMBER_OF_USERS; i++) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  const res = await fetch("http://localhost:3001/auth/sign-up/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: faker.person.fullName({ firstName, lastName }),
      email: faker.internet.email({ firstName, lastName }),
      password: DEFAULT_PASSWORD
    })
  })

  if (res.ok) {
    console.log("User added", firstName)
  } else {
    console.error("User add fail", await res.text())
  }
}
