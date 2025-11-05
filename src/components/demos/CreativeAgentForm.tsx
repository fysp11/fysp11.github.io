import NiceButton from "../ui/NiceButton"
import ConfigSelect from "../ui/ConfigSelect"
import { LucideDices, LucideSparkles, LucideSlidersHorizontal } from "lucide-react"
import type {
  CreativeAgentFormHandlers,
  CreativeAgentFormState,
  CreativeAgentOptions
} from "./useCreativeAgent"

interface CreativeAgentFormProps {
  formState: CreativeAgentFormState
  formHandlers: CreativeAgentFormHandlers
  options: CreativeAgentOptions
  statusMessage: string
  isLoading: boolean
  handleGenerate: (instruction?: string) => Promise<void>
  handleFeelingLucky: () => Promise<void>
}

export default function CreativeAgentForm({
  formState,
  formHandlers,
  options,
  statusMessage,
  isLoading,
  handleGenerate,
  handleFeelingLucky
}: CreativeAgentFormProps) {
  const {
    instruction,
    tone,
    style,
    shouldGenerateImage,
    showAdvanced,
    randomizeVisuals,
    imageArtStyle,
    imageLighting,
    imageColorPalette,
    imageLens,
    imageRendering,
    detailLevel
  } = formState

  const {
    toneOptions,
    styleOptions,
    artStyleOptions,
    lightingOptions,
    paletteOptions,
    lensOptions,
    renderPipelineOptions,
    detailLevelOptions
  } = options

  return (
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
          onChange={(event) => formHandlers.onInstructionChange(event.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ConfigSelect
          id="tone"
          label="Tone"
          value={tone}
          onChange={formHandlers.onToneChange}
          options={toneOptions}
        />
        <ConfigSelect
          id="style"
          label="Story Style"
          value={style}
          onChange={formHandlers.onStyleChange}
          options={styleOptions}
        />
        <label className="text-sm font-medium text-muted-foreground">
          <span className="mb-2 block">Illustration</span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-sm">
            <input
              type="checkbox"
              checked={shouldGenerateImage}
              onChange={(event) => formHandlers.onShouldGenerateImageChange(event.target.checked)}
              className="h-4 w-4"
            />
            Generate cover art prompt and image
          </span>
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
        <button
          type="button"
          onClick={formHandlers.onToggleAdvanced}
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
                onChange={(event) => formHandlers.onRandomizeVisualsChange(event.target.checked)}
                className="h-4 w-4"
              />
              Surprise Me randomizes tone, style & visuals
            </label>
            <ConfigSelect
              id="imageArtStyle"
              label="Visual aesthetic"
              value={imageArtStyle}
              onChange={formHandlers.onImageArtStyleChange}
              options={artStyleOptions}
              labelClassName="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            />
            <ConfigSelect
              id="imageLighting"
              label="Lighting direction"
              value={imageLighting}
              onChange={formHandlers.onImageLightingChange}
              options={lightingOptions}
              labelClassName="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            />
            <ConfigSelect
              id="imageColorPalette"
              label="Palette & mood"
              value={imageColorPalette}
              onChange={formHandlers.onImageColorPaletteChange}
              options={paletteOptions}
              labelClassName="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            />
            <ConfigSelect
              id="imageLens"
              label="Lens & perspective"
              value={imageLens}
              onChange={formHandlers.onImageLensChange}
              options={lensOptions}
              labelClassName="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            />
            <ConfigSelect
              id="imageRendering"
              label="Rendering medium"
              value={imageRendering}
              onChange={formHandlers.onImageRenderingChange}
              options={renderPipelineOptions}
              labelClassName="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            />
            <ConfigSelect
              id="detailLevel"
              label="Detail level"
              value={detailLevel}
              onChange={formHandlers.onDetailLevelChange}
              options={detailLevelOptions}
              labelClassName="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <NiceButton onClick={() => void handleGenerate()} disabled={isLoading} variant="button">
          <LucideSparkles className="h-4 w-4" />
          Run Creative Agent
        </NiceButton>
        <NiceButton
          onClick={() => void handleFeelingLucky()}
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
  )
}
