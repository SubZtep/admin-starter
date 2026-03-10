import { createFileRoute } from "@tanstack/react-router"
import { Main } from "#/components/ui/Main"
import { MainSection } from "#/components/ui/MainSection"

export const Route = createFileRoute("/about")({
  component: About
})

function About() {
  return (
    <Main>
      <MainSection>
        <img src="/images/lagoon-about.svg" alt="" className="mb-6 h-56 w-full rounded-2xl object-cover" />
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Built for shipping fast.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          TanStack Start gives you type-safe routing, server functions, and modern SSR defaults so you can focus on
          product work instead of framework glue.
        </p>
      </MainSection>
    </Main>
  )
}
