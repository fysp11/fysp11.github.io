import { useState, useEffect } from "react"
import { actions } from "astro:actions"
import NiceButton from "../ui/NiceButton"
import { LucideDices, LucideStar } from "lucide-react"

interface Props {
  initialPrompt?: string
}
export default function AIGenerator({ initialPrompt }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt || "")
  const [storyParts, setStoryParts] = useState<string[]>([])
  const [imageBase64s, setImageBase64s] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeGeneration, setActiveGeneration] = useState<"story" | "images" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateStory = async (customPrompt?: string) => {
    const innerPrompt = customPrompt || prompt
    if (!innerPrompt) {
      alert("Please enter a prompt.")
      return
    }

    setIsLoading(true)
    setActiveGeneration("story")
    setStoryParts([])
    setImageBase64s([])
    setError(null)

    try {
      const { data, error } = await actions.ai.generateStory({
        prompt: innerPrompt
      })

      if (error) {
        throw new Error(error.message || "Failed to generate story")
      }

      const fullStory = data?.story || ""

      // Split into 3 parts with shorter, balanced paragraphs
      const paragraphs = fullStory.split(/\n\s*\n/)
      const parts = []
      let currentPart = ""
      let currentLength = 0
      const targetLength = Math.floor(fullStory.length / 3)

      for (const paragraph of paragraphs) {
        if (currentLength + paragraph.length > targetLength && currentPart) {
          parts.push(currentPart.trim())
          currentPart = paragraph
          currentLength = paragraph.length
        } else {
          currentPart += (currentPart ? "\n\n" : "") + paragraph
          currentLength += paragraph.length
        }
      }
      if (currentPart) {
        parts.push(currentPart.trim())
      }

      // Ensure exactly 3 parts
      while (parts.length < 3) {
        parts.push("") // Add empty parts if needed
      }
      if (parts.length > 3) {
        parts.splice(3) // Keep only first 3
      }

      setStoryParts(parts)
    } catch (error) {
      console.error("Error generating story:", error)
      setStoryParts([(error as Error).message || "Failed to generate story"])
    } finally {
      setIsLoading(false)
      setActiveGeneration(null)
    }
  }

  const generateImageForPart = async (storyPart: string, index: number) => {
    try {
      const { data, error } = await actions.ai.generateImage({ prompt: storyPart })

      if (error) {
        throw new Error(error.message || "Failed to generate image")
      }

      if (data) {
        setImageBase64s((prev) => {
          const newImages = [...prev]
          newImages[index] = data.imageBase64
          return newImages
        })
      }
    } catch (error) {
      console.error("Error generating image:", error)
      throw error
    }
  }

  const handlerFeelingLucky = async () => {
    const createdRandomPrompt = await actions.ai.createRandomPrompt()
    if (createdRandomPrompt) {
      setPrompt(createdRandomPrompt.data || "")
      handleGenerateStory(createdRandomPrompt.data)
    }
  }

  useEffect(() => {
    const generateImagesSequentially = async () => {
      if (storyParts.length === 3 && storyParts.some((p) => p.length > 0)) {
        setActiveGeneration("images")
        setIsLoading(true)

        for (let i = 0; i < storyParts.length; i++) {
          const part = storyParts[i]
          if (part) {
            try {
              await generateImageForPart(part, i)
            } catch (e: unknown) {
              if (e instanceof Error) {
                setError(`Error in Chapter ${i + 1}: ${e.message}`)
              } else {
                setError(`Error in Chapter ${i + 1}: An unknown error occurred`)
              }
              break
            }
          }
        }

        setIsLoading(false)
        setActiveGeneration(null)
      }
    }

    generateImagesSequentially()
  }, [storyParts])

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <label
          htmlFor="prompt-input"
          className="text-backgound-foreground mb-2 block text-lg font-medium"
        >
          Your Prompt
        </label>
        <textarea
          id="prompt-input"
          rows={3}
          className="focus:ring-accent focus:border-accent w-full rounded-lg border border-gray-300 p-3 shadow-sm transition-all focus:ring-2"
          placeholder="A brave knight on a quest to find a legendary sword..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="mb-12 flex justify-center gap-4">
        <NiceButton onClick={() => handleGenerateStory()} disabled={isLoading} variant="button">
          <LucideStar />
          Generate 3-Part Story
        </NiceButton>
        {/* im lucky button */}
        <NiceButton variant="button" onClick={() => handlerFeelingLucky()} disabled={isLoading}>
          <LucideDices />
          I'm Feeling Lucky
        </NiceButton>
      </div>

      {error && (
        <div className="my-8 overflow-x-auto rounded-lg bg-red-100 p-4 text-left text-red-700">
          <p className="whitespace-pre">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="my-8 text-center">
          <p className="animate-pulse text-lg text-gray-600">Generating {activeGeneration}...</p>
        </div>
      )}

      <div className="space-y-12">
        {storyParts.map(
          (storyPart, index) =>
            storyPart && (
              <div key={index} className="flex flex-col items-start gap-8">
                <div className="bg-card text-card-foreground w-full rounded-md border p-2 shadow-lg">
                  <div className="prose prose-lg max-w-none">{storyPart}</div>
                </div>
                <div className="bg-card text-card-foreground w-full rounded-md border p-2 shadow-lg">
                  {imageBase64s[index] ? (
                    <div className="flex justify-center">
                      <img
                        src={`data:image/png;base64,${imageBase64s[index]}`}
                        alt="Generated by AI"
                        className="h-full max-w-full rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-loader animate-spin"
                      >
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  )
}
