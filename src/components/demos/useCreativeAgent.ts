import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { actions } from "astro:actions"

export type GenerationState = "idle" | "planning" | "writing" | "summarizing" | "imagining"
export type VideoStatus = "idle" | "queued" | "processing" | "done" | "error" | "failed"

const MAX_AUDIO_BYTES = 20 * 1024 * 1024 // 20 MB
const MAX_TTS_CHARACTERS = 2000
const MAX_VIDEO_SECONDS = 60
const VIDEO_POLL_INTERVAL_MS = 2000

export const VOICE_OPTIONS = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const
export const VIDEO_PROVIDER_OPTIONS = ["runway", "pika"] as const
export const VIDEO_DURATION_OPTIONS = [5, 10, 15, 30, 60] as const

export interface CreativeAgentResult {
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

export interface CreativeAgentFormState {
  instruction: string
  tone: string
  style: string
  shouldGenerateImage: boolean
  showAdvanced: boolean
  randomizeVisuals: boolean
  imageArtStyle: string
  imageLighting: string
  imageColorPalette: string
  imageLens: string
  imageRendering: string
  detailLevel: string
  voice: string
  ttsText: string
  videoPrompt: string
  videoProvider: string
  videoDuration: number
}

export interface AudioState {
  transcript: string
  ttsAudioUrl: string | null
  isTranscribing: boolean
  isSpeaking: boolean
  transcriptionError: string | null
  ttsError: string | null
}

export interface VideoState {
  status: VideoStatus
  statusMessage: string
  url: string | null
  isGenerating: boolean
  error: string | null
}

export type CreativeOptionKey =
  | "tone"
  | "style"
  | "imageArtStyle"
  | "imageLighting"
  | "imageColorPalette"
  | "imageLens"
  | "imageRendering"
  | "detailLevel"

type CustomOptionsState = Record<CreativeOptionKey, string[]>

export interface CreativeAgentFormHandlers {
  onInstructionChange: (value: string) => void
  onToneChange: (value: string) => void
  onStyleChange: (value: string) => void
  onShouldGenerateImageChange: (value: boolean) => void
  onToggleAdvanced: () => void
  onRandomizeVisualsChange: (value: boolean) => void
  onImageArtStyleChange: (value: string) => void
  onImageLightingChange: (value: string) => void
  onImageColorPaletteChange: (value: string) => void
  onImageLensChange: (value: string) => void
  onImageRenderingChange: (value: string) => void
  onDetailLevelChange: (value: string) => void
  onAddCustomOption: (key: CreativeOptionKey, value: string) => string
  onVoiceChange: (value: string) => void
  onTtsTextChange: (value: string) => void
  onVideoPromptChange: (value: string) => void
  onVideoProviderChange: (value: string) => void
  onVideoDurationChange: (value: string) => void
}

export interface SelectOptionGroup {
  defaults: readonly string[]
  custom: string[]
}

export type CreativeAgentOptions = Record<CreativeOptionKey, SelectOptionGroup>

export interface UseCreativeAgentReturn {
  formState: CreativeAgentFormState
  formHandlers: CreativeAgentFormHandlers
  options: CreativeAgentOptions
  statusMessage: string
  isLoading: boolean
  error: string | null
  result: CreativeAgentResult | null
  handleGenerate: (instruction?: string) => Promise<void>
  handleFeelingLucky: () => Promise<void>
  audioState: AudioState
  videoState: VideoState
  handleTranscribeAudio: (file: File) => Promise<void>
  handleSpeak: (text?: string) => Promise<void>
  handleGenerateVideo: (prompt?: string) => Promise<void>
  handleCancelVideo: () => void
}

export const TONE_OPTIONS = [
  "uplifting",
  "wistful yet hopeful",
  "mythic and triumphant",
  "melancholic noir",
  "playfully whimsical",
  "brooding heroic"
] as const

export const STYLE_OPTIONS = [
  "modern cinematic",
  "retro-futurist pulp",
  "folk tale fable",
  "hard sci-fi epic",
  "ethereal gothic",
  "solar punk odyssey"
] as const

export const ART_STYLE_OPTIONS = [
  "ultra-detailed digital concept art",
  "hand-painted gouache concept render",
  "photoreal cinematic still with surreal accents",
  "neo-noir 3D matte painting"
] as const

export const LIGHTING_OPTIONS = [
  "volumetric rim lighting with cinematic contrast",
  "dramatic chiaroscuro with soft bounce fill",
  "golden hour backlighting with misty scattering",
  "bioluminescent glow with deep ambient shadows"
] as const

export const PALETTE_OPTIONS = [
  "rich complementary palette with luminous accents",
  "cool triadic palette with iridescent highlights",
  "crimson and gold high-drama spectrum",
  "monochrome obsidian with electric cyan accents"
] as const

export const LENS_OPTIONS = [
  "35mm anamorphic lens, wide yet intimate framing",
  "50mm prime lens, shallow depth macro detail",
  "ultra-wide 18mm lens, sweeping panoramic vista",
  "telephoto 85mm lens, compressed hero portrait"
] as const

export const RENDER_PIPELINE_OPTIONS = [
  "hybrid octane render with subtle particle FX",
  "unreal engine cinematic render with ray-traced reflections",
  "photobashed matte painting with overpainted highlights",
  "stylized toon shader with volumetric ink washes"
] as const

export const DETAIL_LEVEL_OPTIONS = [
  "8k hyper-real microdetail",
  "5k painterly brushwork with layered texture",
  "16k ultra fidelity with nanoscopic detail",
  "film-grain 4k with analog imperfections"
] as const

const CUSTOM_OPTIONS_STORAGE_KEY = "creative-agent-custom-options:v1"

const DEFAULT_OPTION_MAP: Record<CreativeOptionKey, readonly string[]> = {
  tone: TONE_OPTIONS,
  style: STYLE_OPTIONS,
  imageArtStyle: ART_STYLE_OPTIONS,
  imageLighting: LIGHTING_OPTIONS,
  imageColorPalette: PALETTE_OPTIONS,
  imageLens: LENS_OPTIONS,
  imageRendering: RENDER_PIPELINE_OPTIONS,
  detailLevel: DETAIL_LEVEL_OPTIONS
}

const createEmptyCustomOptions = (): CustomOptionsState => ({
  tone: [],
  style: [],
  imageArtStyle: [],
  imageLighting: [],
  imageColorPalette: [],
  imageLens: [],
  imageRendering: [],
  detailLevel: []
})

const loadInitialCustomOptions = (): CustomOptionsState => {
  if (typeof window === "undefined") {
    return createEmptyCustomOptions()
  }

  try {
    const raw = window.localStorage.getItem(CUSTOM_OPTIONS_STORAGE_KEY)
    if (!raw) {
      return createEmptyCustomOptions()
    }

    const parsed = JSON.parse(raw) as Partial<Record<CreativeOptionKey, unknown>>
    const base = createEmptyCustomOptions()

    for (const key of Object.keys(base) as CreativeOptionKey[]) {
      const value = parsed[key]
      base[key] = Array.isArray(value)
        ? (value.filter((item): item is string => typeof item === "string") as string[])
        : []
    }

    return base
  } catch (error) {
    console.warn("Failed to load custom creative options", error)
    return createEmptyCustomOptions()
  }
}

export function useCreativeAgent(initialPrompt?: string): UseCreativeAgentReturn {
  // Story generation state
  const [instruction, setInstruction] = useState(initialPrompt || "")
  const [tone, setTone] = useState<string>(TONE_OPTIONS[0])
  const [style, setStyle] = useState<string>(STYLE_OPTIONS[0])
  const [result, setResult] = useState<CreativeAgentResult | null>(null)
  const [state, setState] = useState<GenerationState>("idle")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shouldGenerateImage, setShouldGenerateImage] = useState(true)
  const [imageArtStyle, setImageArtStyle] = useState<string>(ART_STYLE_OPTIONS[0])
  const [imageLighting, setImageLighting] = useState<string>(LIGHTING_OPTIONS[0])
  const [imageColorPalette, setImageColorPalette] = useState<string>(PALETTE_OPTIONS[0])
  const [imageLens, setImageLens] = useState<string>(LENS_OPTIONS[0])
  const [imageRendering, setImageRendering] = useState<string>(RENDER_PIPELINE_OPTIONS[0])
  const [detailLevel, setDetailLevel] = useState<string>(DETAIL_LEVEL_OPTIONS[0])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [randomizeVisuals, setRandomizeVisuals] = useState(false)
  const [customOptions, setCustomOptions] = useState<CustomOptionsState>(loadInitialCustomOptions)

  // Audio state
  const [transcript, setTranscript] = useState("")
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null)
  const [ttsError, setTtsError] = useState<string | null>(null)
  const [voice, setVoice] = useState<string>(VOICE_OPTIONS[0])
  const [ttsText, setTtsText] = useState("")

  // Video state
  const [videoPrompt, setVideoPrompt] = useState("")
  const [videoProvider, setVideoProvider] = useState<string>(VIDEO_PROVIDER_OPTIONS[0])
  const [videoDuration, setVideoDuration] = useState(30)
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("idle")
  const [videoStatusMessage, setVideoStatusMessage] = useState("")
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)

  // Refs for cleanup
  const videoJobRef = useRef<{ cancelled: boolean } | null>(null)
  const previousAudioUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(CUSTOM_OPTIONS_STORAGE_KEY, JSON.stringify(customOptions))
  }, [customOptions])

  const options: CreativeAgentOptions = useMemo(() => {
    const base = {} as CreativeAgentOptions
    const keys = Object.keys(DEFAULT_OPTION_MAP) as CreativeOptionKey[]

    keys.forEach((key) => {
      base[key] = {
        defaults: DEFAULT_OPTION_MAP[key],
        custom: customOptions[key]
      }
    })

    return base
  }, [customOptions])

  const addCustomOption = useCallback(
    (key: CreativeOptionKey, value: string) => {
      const trimmed = value.trim()

      if (!trimmed) {
        return value
      }

      if (DEFAULT_OPTION_MAP[key].some((option) => option.toLowerCase() === trimmed.toLowerCase())) {
        return trimmed
      }

      setCustomOptions((prev) => {
        const existing = prev[key]

        if (existing.some((option) => option.toLowerCase() === trimmed.toLowerCase())) {
          return prev
        }

        return {
          ...prev,
          [key]: [trimmed, ...existing]
        }
      })

      return trimmed
    },
    []
  )

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

  function randomPick<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)]
  }

  const randomizeImageControls = () => {
    const combined = <T extends CreativeOptionKey>(key: T) => {
      const { defaults, custom } = options[key]
      return custom.length ? [...defaults, ...custom] : [...defaults]
    }

    setImageArtStyle(randomPick(combined("imageArtStyle")))
    setImageLighting(randomPick(combined("imageLighting")))
    setImageColorPalette(randomPick(combined("imageColorPalette")))
    setImageLens(randomPick(combined("imageLens")))
    setImageRendering(randomPick(combined("imageRendering")))
    setDetailLevel(randomPick(combined("detailLevel")))
    setTone(randomPick(combined("tone")))
    setStyle(randomPick(combined("style")))
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

  const formHandlers: CreativeAgentFormHandlers = {
    onInstructionChange: setInstruction,
    onToneChange: setTone,
    onStyleChange: setStyle,
    onShouldGenerateImageChange: setShouldGenerateImage,
    onToggleAdvanced: () => setShowAdvanced((prev) => !prev),
    onRandomizeVisualsChange: setRandomizeVisuals,
    onImageArtStyleChange: setImageArtStyle,
    onImageLightingChange: setImageLighting,
    onImageColorPaletteChange: setImageColorPalette,
    onImageLensChange: setImageLens,
    onImageRenderingChange: setImageRendering,
    onDetailLevelChange: setDetailLevel,
    onAddCustomOption: addCustomOption,
    onVoiceChange: setVoice,
    onTtsTextChange: setTtsText,
    onVideoPromptChange: setVideoPrompt,
    onVideoProviderChange: setVideoProvider,
    onVideoDurationChange: (value: string) => setVideoDuration(parseInt(value, 10))
  }

  const formState: CreativeAgentFormState = {
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
  }

  const audioState: AudioState = {
    transcript,
    ttsAudioUrl,
    isTranscribing,
    isSpeaking,
    transcriptionError,
    ttsError
  }

  const videoState: VideoState = {
    status: videoStatus,
    statusMessage: videoStatusMessage,
    url: videoUrl,
    isGenerating: isGeneratingVideo,
    error: videoError
  }

  const handleTranscribeAudio = async (file: File) => {
    if (!file) {
      return
    }

    if (!file.type.startsWith("audio/")) {
      setTranscriptionError("Please upload a valid audio file.")
      return
    }

    if (file.size > MAX_AUDIO_BYTES) {
      setTranscriptionError("Audio file exceeds the 20 MB limit.")
      return
    }

    console.error(`[Audio] Starting transcription for file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
    setIsTranscribing(true)
    setTranscriptionError(null)

    try {
      const formData = new FormData()
      formData.set("audio", file)

      console.error("[Audio] Sending audio to /api/asr endpoint...")
      const response = await fetch("/api/asr", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        console.error(`[Audio] ASR endpoint returned ${response.status}`)
        const errorPayload = await response.json().catch(() => ({ error: "Transcription failed" }))
        throw new Error(errorPayload.error || "Transcription failed")
      }

      const data = (await response.json()) as { text?: string }
      const transcriptText = data.text?.trim() ?? ""
      if (!transcriptText) {
        throw new Error("No transcript returned from ASR")
      }

      console.error(`[Audio] Transcription successful: "${transcriptText.substring(0, 50)}..."`)
      setTranscript(transcriptText)
      setInstruction(transcriptText)
    } catch (transcribeError) {
      const errorMsg = (transcribeError as Error).message || "Failed to transcribe audio"
      console.error(`[Audio] Transcription error: ${errorMsg}`)
      setTranscriptionError(errorMsg)
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleSpeak = async (text?: string) => {
    const trimmed = (text ?? ttsText ?? instruction).trim()

    if (!trimmed) {
      setTtsError("Enter text to synthesize speech.")
      return
    }

    if (trimmed.length > MAX_TTS_CHARACTERS) {
      setTtsError("Text is too long for text-to-speech (max 2000 characters).")
      return
    }

    console.error(`[TTS] Starting text-to-speech with voice: ${voice}, text length: ${trimmed.length}`)
    setIsSpeaking(true)
    setTtsError(null)

    try {
      console.error("[TTS] Sending request to /api/tts endpoint...")
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, voice })
      })

      if (!response.ok) {
        console.error(`[TTS] Endpoint returned ${response.status}`)
        const errorPayload = await response.json().catch(() => ({ error: "Text-to-speech failed" }))
        throw new Error(errorPayload.error || "Text-to-speech failed")
      }

      const audioBuffer = await response.arrayBuffer()
      console.error(`[TTS] Received audio buffer: ${(audioBuffer.byteLength / 1024).toFixed(2)}KB`)
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      setTtsAudioUrl(url)
      setTtsText(trimmed)
      console.error("[TTS] Audio playback URL created successfully")
    } catch (speakError) {
      const errorMsg = (speakError as Error).message || "Failed to generate speech"
      console.error(`[TTS] Error: ${errorMsg}`)
      setTtsError(errorMsg)
    } finally {
      setIsSpeaking(false)
    }
  }

  const stopActiveVideoJob = () => {
    if (videoJobRef.current) {
      videoJobRef.current.cancelled = true
    }
  }

  const handleCancelVideo = () => {
    stopActiveVideoJob()
    setIsGeneratingVideo(false)
    setVideoStatus("idle")
    setVideoStatusMessage("Video generation cancelled.")
  }

  const handleGenerateVideo = async (promptOverride?: string) => {
    const provider = videoProvider
    const duration = Math.min(videoDuration, MAX_VIDEO_SECONDS)
    const promptText = (promptOverride ?? videoPrompt ?? instruction).trim()

    if (!promptText) {
      setVideoError("Provide a prompt to generate video.")
      return
    }

    setVideoError(null)
    setVideoUrl(null)
    setVideoStatus("queued")
    setVideoStatusMessage("Submitting generation job...")
    setIsGeneratingVideo(true)

    try {
      const response = await fetch(`/api/video/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, duration })
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({ error: "Video generation failed" }))
        throw new Error(errorPayload.error || "Video generation failed")
      }

      const { jobId } = (await response.json()) as { jobId?: string }

      if (!jobId) {
        throw new Error("Video provider did not return a job ID")
      }

      stopActiveVideoJob()
      const jobController = { cancelled: false }
      videoJobRef.current = jobController

      setVideoStatusMessage("Job queued. Polling status...")

      while (!jobController.cancelled) {
        await new Promise((resolve) => setTimeout(resolve, VIDEO_POLL_INTERVAL_MS))

        try {
          const statusResponse = await fetch(`/api/video/${provider}?id=${encodeURIComponent(jobId)}`)
          if (!statusResponse.ok) {
            const errorPayload = await statusResponse
              .json()
              .catch(() => ({ error: "Unable to fetch job status" }))
            throw new Error(errorPayload.error || "Unable to fetch job status")
          }

          const statusPayload = (await statusResponse.json()) as {
            status?: string
            url?: string
            error?: string
            state?: string
          }

          const statusValue = (statusPayload.status || statusPayload.state || "processing") as VideoStatus

          if (statusValue === "done") {
            setVideoStatus("done")
            setVideoStatusMessage("Video ready to play.")
            if (statusPayload.url) {
              setVideoUrl(statusPayload.url)
            }
            break
          }

          if (statusValue === "error" || statusValue === "failed") {
            setVideoStatus("error")
            setVideoError(statusPayload.error || "Video generation failed")
            setVideoStatusMessage("Video generation failed.")
            break
          }

          setVideoStatus("processing")
          setVideoStatusMessage("Video is rendering...")
        } catch (pollError) {
          console.error("Error polling video job:", pollError)
          setVideoStatus("error")
          setVideoError((pollError as Error).message || "Failed to poll video job")
          setVideoStatusMessage("Video status polling failed.")
          break
        }
      }
    } catch (generationError) {
      console.error("Error starting video generation:", generationError)
      setVideoStatus("error")
      setVideoError((generationError as Error).message || "Video generation failed")
      setVideoStatusMessage("Video generation failed to start.")
    } finally {
      setIsGeneratingVideo(false)
    }
  }


  useEffect(() => {
    if (previousAudioUrlRef.current && previousAudioUrlRef.current !== ttsAudioUrl) {
      URL.revokeObjectURL(previousAudioUrlRef.current)
    }
    previousAudioUrlRef.current = ttsAudioUrl
  }, [ttsAudioUrl])

  useEffect(() => {
    return () => {
      stopActiveVideoJob()
      if (previousAudioUrlRef.current) {
        URL.revokeObjectURL(previousAudioUrlRef.current)
      }
    }
  }, [])

  return {
    formState,
    formHandlers,
    options,
    statusMessage,
    isLoading,
    error,
    result,
    handleGenerate,
    handleFeelingLucky,
    audioState,
    videoState,
    handleTranscribeAudio,
    handleSpeak,
    handleGenerateVideo,
    handleCancelVideo
  }
}
