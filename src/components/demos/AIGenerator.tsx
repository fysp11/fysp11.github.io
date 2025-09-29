import { useState, useEffect } from 'react';
import { actions } from 'astro:actions';

interface Props {
  initialPrompt?: string;
}
export default function AIGenerator({ initialPrompt }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [storyParts, setStoryParts] = useState<string[]>([]);
  const [imageBase64s, setImageBase64s] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeGeneration, setActiveGeneration] = useState<'story' | 'images' | null>(null);
  const [error, setError] = useState<string | null>(null);


  const handleGenerateStory = async () => {
    if (!prompt) {
      alert('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setActiveGeneration('story');
    setStoryParts([]);
    setImageBase64s([]);
    setError(null);

    try {
      const { data, error } = await actions.ai.generateStory({ prompt });

      if (error) {
        throw new Error(error.message || 'Failed to generate story');
      }

      const fullStory = data?.story || '';

      // Split into 3 parts with shorter, balanced paragraphs
      const paragraphs = fullStory.split(/\n\s*\n/);
      const parts = [];
      let currentPart = '';
      let currentLength = 0;
      const targetLength = Math.floor(fullStory.length / 3);

      for (const paragraph of paragraphs) {
        if (currentLength + paragraph.length > targetLength && currentPart) {
          parts.push(currentPart.trim());
          currentPart = paragraph;
          currentLength = paragraph.length;
        } else {
          currentPart += (currentPart ? '\n\n' : '') + paragraph;
          currentLength += paragraph.length;
        }
      }
      if (currentPart) {
        parts.push(currentPart.trim());
      }

      // Ensure exactly 3 parts
      while (parts.length < 3) {
        parts.push(''); // Add empty parts if needed
      }
      if (parts.length > 3) {
        parts.splice(3); // Keep only first 3
      }

      setStoryParts(parts);



    } catch (error) {
      console.error('Error generating story:', error);
      setStoryParts([((error as Error).message || 'Failed to generate story')]);
    } finally {
      setIsLoading(false);
      setActiveGeneration(null);
    }
  };

  const generateImageForPart = async (storyPart: string, index: number) => {
    try {
      const { data, error } = await actions.ai.generateImage({ prompt: storyPart });

      if (error) {
        throw new Error(error.message || 'Failed to generate image');
      }

      if (data) {
        setImageBase64s(prev => {
          const newImages = [...prev];
          newImages[index] = data.imageBase64;
          return newImages;
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      throw error
    }
  };

  useEffect(() => {
    const generateImagesSequentially = async () => {
      if (storyParts.length === 3 && storyParts.some(p => p.length > 0)) {
        setActiveGeneration('images');
        setIsLoading(true);

        for (let i = 0; i < storyParts.length; i++) {
          const part = storyParts[i];
          if (part) {
            try {
              await generateImageForPart(part, i);
            } catch (e: any) {
              setError(`Error in Chapter ${i + 1}: ${e.message}`);
              break;
            }
          }
        }

        setIsLoading(false);
        setActiveGeneration(null);
      }
    };

    generateImagesSequentially();
  }, [storyParts]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <label htmlFor="prompt-input" className="block text-lg font-medium text-gray-700 mb-2">Your Prompt</label>
        <textarea
          id="prompt-input"
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          placeholder="A brave knight on a quest to find a legendary sword..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={()=>handleGenerateStory()}
          disabled={isLoading}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
        >
          Generate 3-Part Story
        </button>
      </div>

      {error && (
        <div className="overflow-x-auto text-left my-8 p-4 bg-red-100 text-red-700 rounded-lg">
          <p className="whitespace-pre">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center my-8">
          <p className="text-lg text-gray-600 animate-pulse">Generating {activeGeneration}...</p>
        </div>
      )}

      <div className="space-y-12">
        {storyParts.map((storyPart, index) => (
          storyPart && (
            <div key={index} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8 items-start`}>
              <div className="w-2/3 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-primary">Chapter {index + 1}: Story</h2>
                <div className="prose prose-lg max-w-none text-gray-700">{storyPart}</div>
              </div>
              <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-primary">Chapter {index + 1}: Image</h2>
                {imageBase64s[index] ? (
                  <div className="flex justify-center">
                    <img src={`data:image/png;base64,${imageBase64s[index]}`} alt="Generated by AI" className="rounded-lg max-w-full h-full object-cover" />
                  </div>
                ) : (
                  <p className="text-gray-500">Generating image...</p>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
