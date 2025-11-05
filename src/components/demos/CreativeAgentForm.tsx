import NiceButton from "../ui/NiceButton"
import ConfigSelect from "../ui/ConfigSelect"
import {
  LucideDices,
  LucideSparkles,
  LucideSlidersHorizontal,
  LucideMic,
  LucideRefreshCcw,
  LucideVolume2,
  LucideVideo,
  LucideLoader2,
  LucideStopCircle
} from "lucide-react"
import type {
  CreativeAgentFormHandlers,
  CreativeAgentFormState,
  CreativeAgentOptions,
  AudioState,
  VideoState
} from "./useCreativeAgent"

interface CreativeAgentFormProps {
  formState: CreativeAgentFormState
  formHandlers: CreativeAgentFormHandlers
  options: CreativeAgentOptions
  statusMessage: string
  isLoading: boolean
  handleGenerate: (instruction?: string) => Promise<void>
  handleFeelingLucky: () => Promise<void>
  audioState: AudioState
  videoState: VideoState
  handleTranscribeAudio: (file: File) => Promise<void>
  handleSpeak: (text?: string) => Promise<void>
  handleGenerateVideo: (prompt?: string) => Promise<void>
  handleCancelVideo: () => void
}

export default function CreativeAgentForm({
  formState,
  formHandlers,
  options,
  statusMessage,
  isLoading,
  handleGenerate,
  handleFeelingLucky,
  audioState,
  videoState,
  handleTranscribeAudio,
  handleSpeak,
  handleGenerateVideo,
  handleCancelVideo
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
    detailLevel,
    voice,
    ttsText,
    videoPrompt,
    videoProvider,
    videoDuration
  } = formState

  // Extract option arrays from the SelectOptionGroup format
  const toneOptions = [...options.tone.defaults, ...options.tone.custom]
  const styleOptions = [...options.style.defaults, ...options.style.custom]
  const artStyleOptions = [...options.imageArtStyle.defaults, ...options.imageArtStyle.custom]
  const lightingOptions = [...options.imageLighting.defaults, ...options.imageLighting.custom]
  const paletteOptions = [...options.imageColorPalette.defaults, ...options.imageColorPalette.custom]
  const lensOptions = [...options.imageLens.defaults, ...options.imageLens.custom]
  const renderPipelineOptions = [...options.imageRendering.defaults, ...options.imageRendering.custom]
  const detailLevelOptions = [...options.detailLevel.defaults, ...options.detailLevel.custom]
  
  // Simple option arrays for voice and video
  const voiceOptions = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
  const videoProviderOptions = ["runway", "pika"]
  const videoDurationOptions = ["5", "10", "15", "30", "60"]

  const {
    transcript,
    ttsAudioUrl,
    isTranscribing,
    isSpeaking,
    transcriptionError,
    ttsError
  } = audioState

  const { statusMessage: videoStatusMessage, url: videoUrl, isGenerating, error: videoError } = videoState

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

      <section className="mt-8 space-y-4 rounded-xl border border-border bg-muted/20 p-4">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Audio Studio</h3>
            <p className="text-sm text-muted-foreground">Transcribe ideas and hear the narrative come to life.</p>
          </div>
          {isTranscribing && (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <LucideLoader2 className="h-4 w-4 animate-spin" />
              Transcribing audio…
            </span>
          )}
        </header>

        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="asr-upload">
              Upload audio (.mp3, .wav, .webm)
            </label>
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
              <input
                id="asr-upload"
                type="file"
                accept="audio/*"
                disabled={isTranscribing}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void handleTranscribeAudio(file)
                }}
              />
              <p className="text-xs text-muted-foreground">Max size 20MB. Transcripts replace the main instruction automatically.</p>
              {transcriptionError && <p className="text-sm text-destructive">{transcriptionError}</p>}
              {transcript && (
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground/70">
                    <LucideMic className="h-4 w-4" />
                    Transcript
                  </div>
                  <p className="whitespace-pre-wrap">{transcript}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <ConfigSelect
              id="voice"
              label="Voice"
              value={voice}
              onChange={formHandlers.onVoiceChange}
              options={voiceOptions}
            />
            <label className="text-sm font-medium text-muted-foreground" htmlFor="tts-text">
              Narration text
            </label>
            <textarea
              id="tts-text"
              rows={4}
              className="focus:ring-accent focus:border-accent w-full rounded-xl border border-border bg-background p-3 text-sm leading-relaxed shadow-sm transition focus:ring-2"
              value={ttsText}
              onChange={(event) => formHandlers.onTtsTextChange(event.target.value)}
              placeholder="Paste a passage or let the agent generate one first."
            />
            <div className="flex flex-wrap items-center gap-3">
              <NiceButton onClick={() => void handleSpeak(ttsText)} disabled={isSpeaking} variant="button">
                {isSpeaking ? <LucideLoader2 className="h-4 w-4 animate-spin" /> : <LucideVolume2 className="h-4 w-4" />}
                Generate narration
              </NiceButton>
              <NiceButton
                onClick={() => formHandlers.onTtsTextChange(instruction)}
                disabled={!instruction}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent/20 cursor-pointer disabled:opacity-50"
              >
                <LucideRefreshCcw className="h-4 w-4" />
                Use story instruction
              </NiceButton>
            </div>
            {ttsError && <p className="text-sm text-destructive">{ttsError}</p>}
            {ttsAudioUrl && (
              <div className="rounded-xl border border-border bg-background p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/70">Preview audio</div>
                <audio controls src={ttsAudioUrl} className="w-full" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-4 rounded-xl border border-border bg-muted/20 p-4">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Video Studio</h3>
            <p className="text-sm text-muted-foreground">Turn prompts into short cinematic clips.</p>
          </div>
          {isGenerating && (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <LucideLoader2 className="h-4 w-4 animate-spin" />
              Rendering video…
            </span>
          )}
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <ConfigSelect
            id="video-provider"
            label="Provider"
            value={videoProvider}
            onChange={formHandlers.onVideoProviderChange}
            options={videoProviderOptions}
          />
          <ConfigSelect
            id="video-duration"
            label="Duration"
            value={String(videoDuration)}
            onChange={formHandlers.onVideoDurationChange}
            options={videoDurationOptions}
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="video-prompt">
            Video prompt
          </label>
          <textarea
            id="video-prompt"
            rows={3}
            className="focus:ring-accent focus:border-accent w-full rounded-xl border border-border bg-background p-3 text-sm leading-relaxed shadow-sm transition focus:ring-2"
            value={videoPrompt}
            onChange={(event) => formHandlers.onVideoPromptChange(event.target.value)}
            placeholder="Describe the sequence you want to visualize."
          />
          <div className="flex flex-wrap items-center gap-3">
            <NiceButton onClick={() => void handleGenerateVideo(videoPrompt)} disabled={isGenerating} variant="button">
              {isGenerating ? <LucideLoader2 className="h-4 w-4 animate-spin" /> : <LucideVideo className="h-4 w-4" />}
              Generate video
            </NiceButton>
            {isGenerating && (
              <NiceButton
                onClick={() => handleCancelVideo()}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent/20 cursor-pointer"
              >
                <LucideStopCircle className="h-4 w-4" />
                Cancel
              </NiceButton>
            )}
          </div>
          {(videoStatusMessage || videoError) && (
            <p className={`text-sm ${videoError ? "text-destructive" : "text-muted-foreground"}`}>
              {videoError ?? videoStatusMessage}
            </p>
          )}
          {videoUrl && (
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/70">Generated clip</div>
              <video controls src={videoUrl} className="aspect-video w-full rounded-lg" />
            </div>
          )}
        </div>
      </section>

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
