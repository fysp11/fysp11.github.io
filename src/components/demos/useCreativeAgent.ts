import { useEffect, useMemo, useState } from "react"
import { actions } from "astro:actions"

export type GenerationState = "idle" | "planning" | "writing" | "summarizing" | "imagining"

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
}

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
}

export interface CreativeAgentOptions {
  toneOptions: readonly string[]
  styleOptions: readonly string[]
  artStyleOptions: readonly string[]
  lightingOptions: readonly string[]
  paletteOptions: readonly string[]
  lensOptions: readonly string[]
  renderPipelineOptions: readonly string[]
  detailLevelOptions: readonly string[]
}

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

export function useCreativeAgent(initialPrompt?: string): UseCreativeAgentReturn {
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

  const options: CreativeAgentOptions = {
    toneOptions: TONE_OPTIONS,
    styleOptions: STYLE_OPTIONS,
    artStyleOptions: ART_STYLE_OPTIONS,
    lightingOptions: LIGHTING_OPTIONS,
    paletteOptions: PALETTE_OPTIONS,
    lensOptions: LENS_OPTIONS,
    renderPipelineOptions: RENDER_PIPELINE_OPTIONS,
    detailLevelOptions: DETAIL_LEVEL_OPTIONS
  }

  function randomPick<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)]
  }

  const randomizeImageControls = () => {
    setImageArtStyle(randomPick(ART_STYLE_OPTIONS))
    setImageLighting(randomPick(LIGHTING_OPTIONS))
    setImageColorPalette(randomPick(PALETTE_OPTIONS))
    setImageLens(randomPick(LENS_OPTIONS))
    setImageRendering(randomPick(RENDER_PIPELINE_OPTIONS))
    setDetailLevel(randomPick(DETAIL_LEVEL_OPTIONS))
    setTone(randomPick(TONE_OPTIONS))
    setStyle(randomPick(STYLE_OPTIONS))
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
    onDetailLevelChange: setDetailLevel
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
    detailLevel
  }

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

  return {
    formState,
    formHandlers,
    options,
    statusMessage,
    isLoading,
    error,
    result,
    handleGenerate,
    handleFeelingLucky
  }
}
