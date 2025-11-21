import type {
  BaseChatModelCallOptions,
  BaseChatModelParams
} from "@langchain/core/language_models/chat_models"
import { SimpleChatModel } from "@langchain/core/language_models/chat_models"
import type { BaseMessage } from "@langchain/core/messages"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"

type WorkersAiBinding = {
  run: (model: string, payload: Record<string, unknown>) => Promise<unknown>
}

// Retry configuration for transient failures
const RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 5000
}

// Request queue to prevent concurrent model calls (rate limiting)
class RequestQueue {
  private queue: Array<() => Promise<unknown>> = []
  private isProcessing = false

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.process()
    })
  }

  private async process(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return
    }

    this.isProcessing = true
    while (this.queue.length > 0) {
      const fn = this.queue.shift()
      if (fn) {
        try {
          await fn()
        } catch (error) {
          console.error("[RequestQueue] Error processing queued request:", error)
        }
      }
    }
    this.isProcessing = false
  }
}

// Global request queue for serializing model calls
const modelRequestQueue = new RequestQueue()

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  stepName: string
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      console.error(`[${stepName}] Attempt ${attempt}/${RETRY_CONFIG.maxAttempts}...`)
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      const errorCode = lastError.message.match(/error code: (\d+)/)?.[1]

      // Only retry on 1031 (overload) errors
      if (errorCode !== "1031" || attempt === RETRY_CONFIG.maxAttempts) {
        console.error(
          `[${stepName}] All ${attempt} attempt(s) failed. Error: ${lastError.message}`
        )
        throw lastError
      }

      const delayMs = Math.min(
        RETRY_CONFIG.initialDelayMs * Math.pow(2, attempt - 1),
        RETRY_CONFIG.maxDelayMs
      )
      console.error(
        `[${stepName}] Attempt ${attempt} failed with error code 1031, retrying in ${delayMs}ms...`
      )
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  throw lastError || new Error("Unknown error in retry logic")
}

interface WorkersBindingChatModelParams extends BaseChatModelParams {
  binding: WorkersAiBinding
  model?: string
}

function isChatResponse(result: unknown): result is { response: string } {
  return !!result && typeof result === "object" && "response" in result
}

function isImageResponse(result: unknown): result is { image: string } {
  return !!result && typeof result === "object" && "image" in result
}

class WorkersBindingChatModel extends SimpleChatModel<BaseChatModelCallOptions> {
  private readonly binding: WorkersAiBinding

  private readonly modelName: string

  constructor({ binding, model, ...rest }: WorkersBindingChatModelParams) {
    super(rest)
    this.binding = binding
    this.modelName = model ?? "@cf/meta/llama-3.1-8b-instruct"
  }

  public _llmType(): string {
    return "cloudflare-workers-binding"
  }

  /**
   * Parameters surfaced for LangSmith or caching integrations.
   */
  get identifyingParams(): Record<string, string> {
    return { model: this.modelName }
  }

  invocationParams(): { model: string } {
    return { model: this.modelName }
  }

  private formatMessages(messages: BaseMessage[]) {
    return messages.map((message) => {
      const messageType = message.type
      let role: "system" | "user" | "assistant"

      if (messageType === "system") {
        role = "system"
      } else if (messageType === "human") {
        role = "user"
      } else {
        role = "assistant"
      }

      const content =
        typeof message.content === "string" ? message.content : String(message.content)

      return { role, content }
    })
  }

  async _call(messages: BaseMessage[], _options: this["ParsedCallOptions"]): Promise<string> {
    // Use request queue to prevent concurrent model calls (rate limiting)
    return modelRequestQueue.enqueue(async () => {
      try {
        const formattedMessages = this.formatMessages(messages)
        console.error(
          `[WorkersBindingChatModel] Calling ${this.modelName} with ${formattedMessages.length} messages`
        )
        const result = await this.binding.run(this.modelName, { messages: formattedMessages })

        if (!isChatResponse(result)) {
          console.error(`[WorkersBindingChatModel] Invalid response format:`, result)
          throw new Error("Cloudflare Workers AI binding did not return text content")
        }

        return result.response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        const errorCode = errorMessage.match(/error code: (\d+)/)?.[1]
        console.error(
          `[WorkersBindingChatModel] Error calling ${this.modelName}: ${errorMessage}${
            errorCode ? ` (code: ${errorCode})` : ""
          }`
        )
        throw error
      }
    })
  }
}

export interface CreativeAgentInput {
  instruction: string
  tone?: string | null
  style?: string | null
  generateImage?: boolean
  imageArtStyle?: string | null
  imageLighting?: string | null
  imageColorPalette?: string | null
  imageLens?: string | null
  imageRendering?: string | null
  detailLevel?: string | null
}

export interface CreativeAgentOutput {
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

const plannerPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a meticulous narrative planner for high-end concept art teams. Produce exactly three concise story beats that cover world-building, central conflict, and climactic resolution. Each beat must highlight vivid sensory cues and potential visual motifs suitable for cinematic illustration."
  ],
  ["human", "Instruction: {instruction}\nPreferred tone: {tone}"]
])

const storyPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a vivid storyteller crafting treatments for award-winning animation studios. Expand the supplied beats into a 280-320 word narrative that balances pacing, emotional stakes, and striking imagery. The prose should surface concrete visual anchors that production designers could translate into key frames, all while respecting the requested tone and style."
  ],
  ["human", "Story beats:\n{plan}\n\nDesired style: {style}\nInstruction recap: {instruction}"]
])

const synopsisPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Summarize the story below in two sentences. The first line should anchor the protagonist, stakes, and emotional arc. The second line should emphasize the atmosphere and visual mood."
  ],
  ["human", "Story:\n{story}"]
])

const imagePromptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an elite concept artist and prompt engineer producing inputs for diffusion and transformer-based render models. Deliver a single, polished prompt (55-75 words) that feels bespoke, cinematic, and production-ready. Follow this structure with richly descriptive language:\n\nPrimary description: [2-3 clauses capturing subject, setting, and motion]\nCamera & lens: [reference lens or perspective that matches the brief]\nLighting: [dramatic lighting cues]\nColor & mood: [palette and emotional tone]\nDetail & rendering: [materials, texture fidelity, rendering pipeline, quality tags]\n\nAvoid mentioning 'text', 'logo', or camera metadata shorthand."
  ],
  [
    "human",
    "Story summary:\n{story}\n\nTone to capture: {tone}\nNarrative style: {style}\nVisual aesthetic: {imageArtStyle}\nLighting focus: {imageLighting}\nColor palette: {imageColorPalette}\nLens choice: {imageLens}\nRendering medium: {imageRendering}\nDesired detail level: {detailLevel}"
  ]
])

export async function runCreativeAgent(
  input: CreativeAgentInput,
  binding: WorkersAiBinding
): Promise<CreativeAgentOutput> {
  try {
    const {
      instruction,
      tone,
      style,
      generateImage,
      imageArtStyle,
      imageLighting,
      imageColorPalette,
      imageLens,
      imageRendering,
      detailLevel
    } = input

    const chatModel = new WorkersBindingChatModel({ binding })
    const outputParser = new StringOutputParser()

    const defaultTone = tone?.trim().length ? tone.trim() : "uplifting"
    const defaultStyle = style?.trim().length ? style.trim() : "modern cinematic"
    const resolvedImageSettings = {
      artStyle: imageArtStyle?.trim().length ? imageArtStyle.trim() : "ultra-detailed digital concept art",
      lighting: imageLighting?.trim().length ? imageLighting.trim() : "volumetric rim lighting with cinematic contrast",
      colorPalette: imageColorPalette?.trim().length ? imageColorPalette.trim() : "rich complementary palette with luminous accents",
      lens: imageLens?.trim().length ? imageLens.trim() : "35mm anamorphic lens, wide yet intimate framing",
      rendering: imageRendering?.trim().length ? imageRendering.trim() : "hybrid octane render with subtle particle FX",
      detailLevel: detailLevel?.trim().length ? detailLevel.trim() : "8k hyper-real microdetail"
    }

    console.error("[runCreativeAgent] Starting story plan generation...")
    const storyPlan = String(
      await retryWithBackoff(
        () =>
          plannerPrompt.pipe(chatModel).pipe(outputParser).invoke({
            instruction,
            tone: defaultTone
          }),
        "Story Plan Generation"
      )
    )
    console.error("[runCreativeAgent] Story plan generated successfully")

    console.error("[runCreativeAgent] Starting story generation...")
    const story = String(
      await retryWithBackoff(
        () =>
          storyPrompt.pipe(chatModel).pipe(outputParser).invoke({
            instruction,
            style: defaultStyle,
            plan: storyPlan
          }),
        "Story Generation"
      )
    )
    console.error("[runCreativeAgent] Story generated successfully")

    console.error("[runCreativeAgent] Generating synopsis...")
    const synopsis = String(
      await retryWithBackoff(
        () => synopsisPrompt.pipe(chatModel).pipe(outputParser).invoke({ story }),
        "Synopsis Generation"
      )
    )
    console.error("[runCreativeAgent] Synopsis generated successfully")

    console.error("[runCreativeAgent] Generating image prompt...")
    const imagePrompt = String(
      await retryWithBackoff(
        () =>
          imagePromptTemplate.pipe(chatModel).pipe(outputParser).invoke({
            story,
            tone: defaultTone,
            style: defaultStyle,
            imageArtStyle: resolvedImageSettings.artStyle,
            imageLighting: resolvedImageSettings.lighting,
            imageColorPalette: resolvedImageSettings.colorPalette,
            imageLens: resolvedImageSettings.lens,
            imageRendering: resolvedImageSettings.rendering,
            detailLevel: resolvedImageSettings.detailLevel
          }),
        "Image Prompt Generation"
      )
    )
    console.error("[runCreativeAgent] Image prompt generated successfully")

    let imageBase64: string | null = null

    if (generateImage) {
      console.error("[runCreativeAgent] Starting image generation...")
      const result = await retryWithBackoff(
        () =>
          binding.run("@cf/black-forest-labs/flux-1-schnell", {
            prompt: imagePrompt
          }),
        "Image Generation"
      )

      if (isImageResponse(result)) {
        imageBase64 = result.image
        console.error("[runCreativeAgent] Image generated successfully")
      } else {
        console.error("[runCreativeAgent] Image generation returned invalid format:", result)
      }
    }

    console.error("[runCreativeAgent] Creative agent completed successfully")
    return {
      storyPlan,
      story,
      synopsis,
      imagePrompt,
      imageBase64,
      imageSettings: resolvedImageSettings
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorCode = errorMessage.match(/error code: (\d+)/)?.[1]

    if (errorCode === "1031") {
      console.error(
        "[runCreativeAgent] Fatal error: Cloudflare Workers AI is currently unavailable (error 1031)."
      )
      console.error(
        "[runCreativeAgent] This typically means the AI service is overloaded or experiencing an outage."
      )
      console.error("[runCreativeAgent] Please try again in a few moments.")
    } else {
      console.error("[runCreativeAgent] Fatal error:", errorMessage)
    }
    throw error
  }
}
