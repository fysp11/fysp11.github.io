import NiceButton from "../ui/NiceButton"
import { LucideImage, LucideVolume2, LucideVideo, LucideAlertCircle } from "lucide-react"
import type { AudioState, CreativeAgentResult, VideoState } from "./useCreativeAgent"

interface CreativeAgentResultsProps {
  result: CreativeAgentResult
  audioState: AudioState
  videoState: VideoState
  handleSpeak: (text?: string) => Promise<void>
}

export default function CreativeAgentResults({
  result,
  audioState,
  videoState,
  handleSpeak
}: CreativeAgentResultsProps) {
  const { ttsAudioUrl, ttsError, transcript } = audioState
  const { url: videoUrl, statusMessage, error: videoError } = videoState

  return (
    <div className="space-y-8">
      <section className="border-border bg-background/80 rounded-2xl border p-6 shadow-sm backdrop-blur">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Story Blueprint</h2>
        <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
          {result.storyPlan.split(/\n+/).map((line, index) => (
            <p key={`plan-${index}`} className="whitespace-pre-line">
              {line.trim()}
            </p>
          ))}
        </div>
      </section>

      <section className="border-border bg-background/80 rounded-2xl border p-6 shadow-sm backdrop-blur">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Full Narrative</h2>
        <article className="text-muted-foreground space-y-4 text-base leading-relaxed">
          {result.story.split(/\n\s*\n/).map((paragraph, index) => (
            <p key={`story-${index}`} className="whitespace-pre-line">
              {paragraph.trim()}
            </p>
          ))}
        </article>
      </section>

      <section className="border-border bg-background/80 rounded-2xl border p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Synopsis</h2>
            <p className="text-muted-foreground mt-2 text-sm">Distills the essence of the tale.</p>
          </div>
        </div>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed whitespace-pre-line">
          {result.synopsis}
        </p>
      </section>

      <section className="border-border bg-background/80 rounded-2xl border p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Cover Art Prompt</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Use this cinematic prompt with Flux, Midjourney, or SDXL pipelines.
            </p>
          </div>
          {result.imageBase64 && (
            <NiceButton
              variant="link"
              liveUrl={`data:image/png;base64,${result.imageBase64}`}
              isExternal
              className="bg-accent text-accent-foreground hover:bg-accent/80 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              <LucideImage className="h-4 w-4" />
              Open image in new tab
            </NiceButton>
          )}
        </div>

        <p className="text-muted-foreground mt-4 text-base leading-relaxed whitespace-pre-line">
          {result.imagePrompt}
        </p>

        <dl className="border-border bg-background/70 text-muted-foreground mt-6 grid gap-4 rounded-xl border p-4 text-sm md:grid-cols-2">
          <div>
            <dt className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">
              Visual aesthetic
            </dt>
            <dd>{result.imageSettings.artStyle}</dd>
          </div>
          <div>
            <dt className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">
              Lighting direction
            </dt>
            <dd>{result.imageSettings.lighting}</dd>
          </div>
          <div>
            <dt className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">
              Palette & mood
            </dt>
            <dd>{result.imageSettings.colorPalette}</dd>
          </div>
          <div>
            <dt className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">
              Lens & perspective
            </dt>
            <dd>{result.imageSettings.lens}</dd>
          </div>
          <div>
            <dt className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">
              Rendering medium
            </dt>
            <dd>{result.imageSettings.rendering}</dd>
          </div>
          <div>
            <dt className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">
              Detail level
            </dt>
            <dd>{result.imageSettings.detailLevel}</dd>
          </div>
        </dl>

        {result.imageBase64 && (
          <img
            src={`data:image/png;base64,${result.imageBase64}`}
            alt="Generated cover art"
            className="border-border mt-6 w-full rounded-2xl border"
          />
        )}
      </section>

      <section className="border-border bg-background/80 rounded-2xl border p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Narration & Audio</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Listen to the generated narration or reuse your transcript for refinements.
            </p>
          </div>
          <NiceButton
            onClick={() => void handleSpeak(result.synopsis)}
            variant="button"
            className="inline-flex items-center gap-2"
          >
            <LucideVolume2 className="h-4 w-4" />
            Regenerate narration
          </NiceButton>
        </div>

        {ttsError && (
          <div className="border-destructive/40 bg-destructive/10 text-destructive mt-4 flex items-start gap-2 rounded-lg border p-3 text-sm">
            <LucideAlertCircle className="mt-0.5 h-4 w-4" />
            <span>{ttsError}</span>
          </div>
        )}

        {ttsAudioUrl ? (
          <div className="border-border bg-muted/30 mt-4 rounded-xl border p-4">
            <audio controls src={ttsAudioUrl} className="w-full" />
          </div>
        ) : (
          <p className="text-muted-foreground mt-4 text-sm">
            Generate narration from the form to preview audio here.
          </p>
        )}

        {transcript && (
          <div className="border-border bg-background/70 text-muted-foreground mt-6 rounded-xl border p-4 text-sm">
            <div className="text-foreground/70 mb-2 text-xs font-semibold tracking-wide uppercase">
              Latest transcript
            </div>
            <p className="leading-relaxed whitespace-pre-wrap">{transcript}</p>
          </div>
        )}
      </section>

      <section className="border-border bg-background/80 rounded-2xl border p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Video Generation</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Preview the latest rendered clip or continue refining the prompt in the form above.
            </p>
          </div>
          <NiceButton
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="border-border bg-background text-muted-foreground hover:bg-accent/20 inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition"
          >
            <LucideVideo className="h-4 w-4" />
            Adjust video prompt
          </NiceButton>
        </div>

        {videoError ? (
          <div className="border-destructive/40 bg-destructive/10 text-destructive mt-4 flex items-start gap-2 rounded-lg border p-3 text-sm">
            <LucideAlertCircle className="mt-0.5 h-4 w-4" />
            <span>{videoError}</span>
          </div>
        ) : (
          statusMessage && <p className="text-muted-foreground mt-4 text-sm">{statusMessage}</p>
        )}

        {videoUrl ? (
          <div className="border-border bg-muted/30 mt-6 rounded-xl border p-4">
            <video controls src={videoUrl} className="aspect-video w-full rounded-lg" />
          </div>
        ) : (
          <p className="text-muted-foreground mt-6 text-sm">
            Generate a clip via the Video Studio to view it here.
          </p>
        )}
      </section>
    </div>
  )
}
