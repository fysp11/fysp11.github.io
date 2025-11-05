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
    const formattedMessages = this.formatMessages(messages)
    const result = await this.binding.run(this.modelName, { messages: formattedMessages })

    if (!isChatResponse(result)) {
      throw new Error("Cloudflare Workers AI binding did not return text content")
    }

    return result.response
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

  const storyPlan = String(
    await plannerPrompt.pipe(chatModel).pipe(outputParser).invoke({
      instruction,
      tone: defaultTone
    })
  )

  const story = String(
    await storyPrompt.pipe(chatModel).pipe(outputParser).invoke({
      instruction,
      style: defaultStyle,
      plan: storyPlan
    })
  )

  const synopsis = String(await synopsisPrompt.pipe(chatModel).pipe(outputParser).invoke({ story }))

  const imagePrompt = String(
    await imagePromptTemplate.pipe(chatModel).pipe(outputParser).invoke({
      story,
      tone: defaultTone,
      style: defaultStyle,
      imageArtStyle: resolvedImageSettings.artStyle,
      imageLighting: resolvedImageSettings.lighting,
      imageColorPalette: resolvedImageSettings.colorPalette,
      imageLens: resolvedImageSettings.lens,
      imageRendering: resolvedImageSettings.rendering,
      detailLevel: resolvedImageSettings.detailLevel
    })
  )

  let imageBase64: string | null = null

  if (generateImage) {
    const result = await binding.run("@cf/black-forest-labs/flux-1-schnell", {
      prompt: imagePrompt
    })

    if (isImageResponse(result)) {
      imageBase64 = result.image
    }
  }

  return {
    storyPlan,
    story,
    synopsis,
    imagePrompt,
    imageBase64,
    imageSettings: resolvedImageSettings
  }
}
