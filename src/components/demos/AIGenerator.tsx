import { useEffect, useMemo, useState } from "react"
import { actions } from "astro:actions"
import NiceButton from "../ui/NiceButton"
import { LucideDices, LucideImage, LucideSparkles, LucideSlidersHorizontal } from "lucide-react"

interface Props {
  initialPrompt?: string
}

type GenerationState = "idle" | "planning" | "writing" | "summarizing" | "imagining"

interface CreativeAgentResult {
  storyPlan: string
  story: string
  synopsis: string
  imagePrompt: string
  imageBase64?: string | null
  imageSettings: {
    artStyle: string
    lighting: string
    colorPalette: string
    lens: string
    rendering: string
    detailLevel: string
  }
}

export default function AIGenerator({ initialPrompt }: Props) {
  const [instruction, setInstruction] = useState(initialPrompt || "")
  const [tone, setTone] = useState("uplifting")
  const [style, setStyle] = useState("modern cinematic")
  const [result, setResult] = useState<CreativeAgentResult | null>(null)
  const [state, setState] = useState<GenerationState>("idle")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shouldGenerateImage, setShouldGenerateImage] = useState(true)
  const [imageArtStyle, setImageArtStyle] = useState("ultra-detailed digital concept art")
  const [imageLighting, setImageLighting] = useState("volumetric rim lighting with cinematic contrast")
  const [imageColorPalette, setImageColorPalette] = useState("rich complementary palette with luminous accents")
  const [imageLens, setImageLens] = useState("35mm anamorphic lens, wide yet intimate framing")
  const [imageRendering, setImageRendering] = useState("hybrid octane render with subtle particle FX")
  const [detailLevel, setDetailLevel] = useState("8k hyper-real microdetail")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [randomizeVisuals, setRandomizeVisuals] = useState(false)

  const statusMessage = useMemo(() => {
    switch (state) {
      case "planning":
        return " Charting your narrative beats..."
      case "writing":
        return " Spinning the full story..."
      case "summarizing":
        return " Capturing the synopsis..."
      case "imagining":
        return " Dreaming up the illustration prompt..."
      default:
        return ""
    }
  }, [state])

  const handleGenerate = async (customInstruction?: string) => {
    const innerInstruction = customInstruction ?? instruction

    if (!innerInstruction.trim()) {
      alert("Please enter an instruction for the agent.")
      return
    }

    setError(null)
    setResult(null)
    setIsLoading(true)
    setState("planning")

    try {
      const { data, error } = await actions.ai.runCreativeAgent({
        instruction: innerInstruction,
        tone,
        style,
        generateImage: shouldGenerateImage,
        imageArtStyle,
        imageLighting,
        imageColorPalette,
        imageLens,
        imageRendering,
        detailLevel
      })

      if (error) {
        throw new Error(error.message || "Creative agent run failed")
      }

      if (!data) {
        throw new Error("No data returned from creative agent")
      }

      setResult(data)
    } catch (err) {
      console.error("Error running creative agent:", err)
      setError((err as Error).message || "Creative agent run failed")
    } finally {
      setIsLoading(false)
      setState("idle")
    }
  }

  function randomPick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)]
  }

  const randomizeImageControls = () => {
    const artStyles = [
      "ultra-detailed digital concept art",
      "hand-painted gouache concept render",
      "photoreal cinematic still with surreal accents",
      "neo-noir 3D matte painting"
    ]
    const lightingOptions = [
      "volumetric rim lighting with cinematic contrast",
      "dramatic chiaroscuro with soft bounce fill",
      "golden hour backlighting with misty scattering",
      "bioluminescent glow with deep ambient shadows"
    ]
    const palettes = [
      "rich complementary palette with luminous accents",
      "cool triadic palette with iridescent highlights",
      "crimson and gold high-drama spectrum",
      "monochrome obsidian with electric cyan accents"
    ]
    const lenses = [
      "35mm anamorphic lens, wide yet intimate framing",
      "50mm prime lens, shallow depth macro detail",
      "ultra-wide 18mm lens, sweeping panoramic vista",
      "telephoto 85mm lens, compressed hero portrait"
    ]
    const renderPipelines = [
      "hybrid octane render with subtle particle FX",
      "unreal engine cinematic render with ray-traced reflections",
      "photobashed matte painting with overpainted highlights",
      "stylized toon shader with volumetric ink washes"
    ]
    const detailLevels = [
      "8k hyper-real microdetail",
      "5k painterly brushwork with layered texture",
      "16k ultra fidelity with nanoscopic detail",
      "film-grain 4k with analog imperfections"
    ]
    const toneOptions = [
      "uplifting",
      "wistful yet hopeful",
      "mythic and triumphant",
      "melancholic noir",
      "playfully whimsical",
      "brooding heroic"
    ]
    const styleOptions = [
      "modern cinematic",
      "retro-futurist pulp",
      "folk tale fable",
      "hard sci-fi epic",
      "ethereal gothic",
      "solar punk odyssey"
    ]

    setImageArtStyle(randomPick(artStyles))
    setImageLighting(randomPick(lightingOptions))
    setImageColorPalette(randomPick(palettes))
    setImageLens(randomPick(lenses))
    setImageRendering(randomPick(renderPipelines))
    setDetailLevel(randomPick(detailLevels))
    setTone(randomPick(toneOptions))
    setStyle(randomPick(styleOptions))
  }

  const handleFeelingLucky = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await actions.ai.createRandomPrompt()
      if (error) {
        throw new Error(error.message || "Failed to fetch random prompt")
      }

      if (data) {
        setInstruction(data)

        if (randomizeVisuals) {
          randomizeImageControls()
        }

        await handleGenerate(data)
      }
    } catch (err) {
      console.error("Error loading random prompt:", err)
      setError((err as Error).message || "Failed to fetch random prompt")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoading) {
      return
    }

    const timers: number[] = []

    timers.push(window.setTimeout(() => setState("planning"), 100))
    timers.push(window.setTimeout(() => setState("writing"), 1500))
    timers.push(window.setTimeout(() => setState("summarizing"), 2500))
    timers.push(window.setTimeout(() => setState("imagining"), 3500))

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [isLoading])

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div className="rounded-2xl border border-border bg-background/80 p-6 shadow-sm backdrop-blur">
        <div className="mb-6">
          <label htmlFor="instruction" className="text-backgound-foreground mb-2 block text-lg font-semibold">
            Describe what you&apos;d like the agent to craft
          </label>
          <textarea
            id="instruction"
            rows={4}
            className="focus:ring-accent focus:border-accent w-full rounded-xl border border-border bg-background p-4 text-sm leading-relaxed shadow-sm transition focus:ring-2"
            placeholder="Write a hopeful sci-fi vignette about a botanist on Mars who discovers a luminous plant..."
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="tone" className="text-sm font-medium text-muted-foreground">
              Tone
            </label>
            <input
              id="tone"
              type="text"
              value={tone}
              onChange={(event) => setTone(event.target.value)}
              placeholder="whimsical, hopeful, moody..."
              className="focus:ring-accent focus:border-accent rounded-xl border border-border bg-background p-3 text-sm transition focus:ring-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="style" className="text-sm font-medium text-muted-foreground">
              Story Style
            </label>
            <input
              id="style"
              type="text"
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              placeholder="modern cinematic, folklore, space opera..."
              className="focus:ring-accent focus:border-accent rounded-xl border border-border bg-background p-3 text-sm transition focus:ring-2"
            />
          </div>
          <label className="text-sm font-medium text-muted-foreground">
            <span className="mb-2 block">Illustration</span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-sm">
              <input
                type="checkbox"
                checked={shouldGenerateImage}
                onChange={(event) => setShouldGenerateImage(event.target.checked)}
                className="h-4 w-4"
              />
              Generate cover art prompt and image
            </span>
          </label>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="text-muted-foreground flex w-full items-center justify-between text-sm font-medium"
          >
            <span className="inline-flex items-center gap-2">
              <LucideSlidersHorizontal className="h-4 w-4" />
              Advanced image controls
            </span>
            <span className="text-xs uppercase tracking-wide">{showAdvanced ? "Hide" : "Show"}</span>
          </button>

          {showAdvanced && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-sm">
                <input
                  type="checkbox"
                  checked={randomizeVisuals}
                  onChange={(event) => setRandomizeVisuals(event.target.checked)}
                  className="h-4 w-4"
                />
                Surprise Me randomizes tone, style & visuals
              </label>
              <div className="flex flex-col gap-2">
                <label htmlFor="imageArtStyle" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Visual aesthetic
                </label>
                <textarea
                  id="imageArtStyle"
                  value={imageArtStyle}
                  onChange={(event) => setImageArtStyle(event.target.value)}
                  rows={2}
                  className="focus:ring-accent focus:border-accent rounded-xl border border-border bg-background p-3 text-sm transition focus:ring-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="imageLighting" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Lighting direction
                </label>
                <textarea
                  id="imageLighting"
                  value={imageLighting}
                  onChange={(event) => setImageLighting(event.target.value)}
                  rows={2}
                  className="focus:ring-accent focus:border-accent rounded-xl border border-border bg-background p-3 text-sm transition focus:ring-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="imageColorPalette" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Palette & mood
                </label>
                <textarea
                  id="imageColorPalette"
                  value={imageColorPalette}
                  onChange={(event) => setImageColorPalette(event.target.value)}
                  rows={2}
                  className="focus:ring-accent focus:border-accent rounded-xl border border-border bg-background p-3 text-sm transition focus:ring-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="imageLens" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Lens & perspective
                </label>
                <input
                  id="imageLens"
                  type="text"
                  value={imageLens}
                  onChange={(event) => setImageLens(event.target.value)}
                  className="focus:ring-accent focus:border-accent rounded-xl border border-border bg-background p-3 text-sm transition focus:ring-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="imageRendering" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Rendering medium
                </label>
                <input
                  id="imageRendering"
                  type="text"
                  value={imageRendering}
                  onChange={(event) => setImageRendering(event.target.value)}
                  className="focus:ring-accent focus:border-accent rounded-xl border border-border bg-background p-3 text-sm transition focus:ring-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="detailLevel" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Detail level
                </label>
                <input
                  id="detailLevel"
                  type="text"
                  value={detailLevel}
                  onChange={(event) => setDetailLevel(event.target.value)}
                  className="focus:ring-accent focus:border-accent rounded-xl border border-border bg-background p-3 text-sm transition focus:ring-2"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <NiceButton onClick={() => handleGenerate()} disabled={isLoading} variant="button">
            <LucideSparkles className="h-4 w-4" />
            Run Creative Agent
          </NiceButton>
          <NiceButton
            onClick={handleFeelingLucky}
            disabled={isLoading}
            variant="button"
            className="border-border text-backgound-foreground inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent/20 cursor-pointer"
          >
            <LucideDices className="h-4 w-4" />
            Surprise Me
          </NiceButton>

          {statusMessage && isLoading && (
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="relative inline-flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent"></span>
              </span>
              {statusMessage}
            </span>
          )}
        </div>
      </div>

      {result && (
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
      )}

      {error && (
        <p className="text-destructive text-center text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
