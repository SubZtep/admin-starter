import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "#/components/form/primitives/Button"
import { Section } from "#/components/ui/Section"

export const Route = createFileRoute("/_public/")({ component: App })

function App() {
  return (
    <Section className="w-96 flex flex-col gap-4 opacity-80 transform-[perspective(900px)_rotateY(10deg)_rotateX(4deg)] hover:shadow-purple-800/69">
      <h1>Hello, World!</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </p>
      <Link to="/signin">
        <Button variant="primary" size="lg" className="w-full">
          Sign In
        </Button>
      </Link>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <Link to="/signup">
        <Button variant="primary" size="lg" className="w-full">
          Sign Up
        </Button>
      </Link>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </Section>
  )
}
