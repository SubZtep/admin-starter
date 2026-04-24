import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "#/components/form/primitives/Button"
import { Logo } from "#/components/layout/Logo"
import { Menu } from "#/components/layout/Menu"
import { Section } from "#/components/ui/Section"

export const Route = createFileRoute("/_public/")({ component: App })

function App() {
  return (
    <Section className="m-4 max-w-md group flex flex-col gap-4 opacity-80 transform-[perspective(900px)_rotateY(10deg)_rotateX(4deg)] hover:shadow-purple-800/69">
      <Menu className="opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
      <h1 className="flex items-center gap-1 mt-3">
        <Logo />
        Hello, <GitHub />
        World!
      </h1>
      <pre className="text-base!">curl -fsSL https://kaja.io/setup.sh | bash</pre>

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

function GitHub() {
  return (
    <a
      href="https://github.com/SubZtep/admin-starter"
      target="_blank"
      rel="noreferrer"
      className="rounded-xl p-2 transition hover:bg-surface"
    >
      <span className="sr-only">Go to project GitHub</span>
      <svg viewBox="0 0 16 16" aria-hidden="true" width="32" height="32">
        <path
          fill="currentColor"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
    </a>
  )
}
