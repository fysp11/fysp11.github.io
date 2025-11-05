import NiceButton from "../ui/NiceButton"
import { LucideImage } from "lucide-react"
import type { CreativeAgentResult } from "./useCreativeAgent"

interface CreativeAgentResultsProps {
  result: CreativeAgentResult
}

export default function CreativeAgentResults({ result }: CreativeAgentResultsProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-background/80 p-6 shadow-sm backdrop-blur">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Story Blueprint</h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          {result.storyPlan.split(/\n+/).map((line, index) => (
            <p key={`plan-${index}`} className="whitespace-pre-line">
              {line.trim()}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background/80 p-6 shadow-sm backdrop-blur">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Full Narrative</h2>
        <article className="space-y-4 text-base leading-relaxed text-muted-foreground">
          {result.story.split(/\n\s*\n/).map((paragraph, index) => (
            <p key={`story-${index}`} className="whitespace-pre-line">
              {paragraph.trim()}
            </p>
          ))}
        </article>
      </section>

      <section className="rounded-2xl border border-border bg-background/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Synopsis</h2>
            <p className="mt-2 text-sm text-muted-foreground">Distills the essence of the tale.</p>
          </div>
        </div>
        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
          {result.synopsis}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-background/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Cover Art Prompt</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use this cinematic prompt with Flux, Midjourney, or SDXL pipelines.
            </p>
          </div>
          {result.imageBase64 && (
            <NiceButton
              variant="link"
              liveUrl={`data:image/png;base64,${result.imageBase64}`}
              isExternal
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/80"
            >
              <LucideImage className="h-4 w-4" />
              Open image in new tab
            </NiceButton>
          )}
        </div>

        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
          {result.imagePrompt}
        </p>

        <dl className="mt-6 grid gap-4 rounded-xl border border-border bg-background/70 p-4 text-sm text-muted-foreground md:grid-cols-2">
          <div>
            <dt className="font-semibold uppercase tracking-wide text-xs text-foreground/70">Visual aesthetic</dt>
            <dd>{result.imageSettings.artStyle}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-xs text-foreground/70">Lighting direction</dt>
            <dd>{result.imageSettings.lighting}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-xs text-foreground/70">Palette & mood</dt>
            <dd>{result.imageSettings.colorPalette}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-xs text-foreground/70">Lens & perspective</dt>
            <dd>{result.imageSettings.lens}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-xs text-foreground/70">Rendering medium</dt>
            <dd>{result.imageSettings.rendering}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-xs text-foreground/70">Detail level</dt>
            <dd>{result.imageSettings.detailLevel}</dd>
          </div>
        </dl>

        {result.imageBase64 && (
          <img
            src={`data:image/png;base64,${result.imageBase64}`}
            alt="Generated cover art"
            className="mt-6 w-full rounded-2xl border border-border"
          />
        )}
      </section>
    </div>
  )
}
