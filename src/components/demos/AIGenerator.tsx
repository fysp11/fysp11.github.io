import { useState, useEffect } from 'react';

export default function AIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [storyParts, setStoryParts] = useState<string[]>([]);
  const [imageBase64s, setImageBase64s] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeGeneration, setActiveGeneration] = useState<'story' | 'images' | null>(null);

  // Effect to restore state from URL on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const storyPartsFromURL = urlParams.get('story_parts');
    const promptFromURL = urlParams.get('prompt');

    if (storyPartsFromURL) {
      try {
        const parts = JSON.parse(decodeURIComponent(storyPartsFromURL));
        if (Array.isArray(parts) && parts.length > 0) {
          setStoryParts(parts);
        }
      } catch (e) {
        console.error("Failed to parse story parts from URL", e);
      }
    }
    if (promptFromURL) {
      setPrompt(decodeURIComponent(promptFromURL));
    }
  }, []);

  const handleGenerateStory = async () => {
    if (!prompt) {
      alert('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setActiveGeneration('story');
    setStoryParts([]);
    setImageBase64s([]);

    try {
      const response = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullStory = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullStory += chunk;
      }

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

      // Save state to URL
      const url = new URL(window.location.href);
      url.searchParams.set('story_parts', encodeURIComponent(JSON.stringify(parts)));
      if (prompt) {
        url.searchParams.set('prompt', encodeURIComponent(prompt));
      }
      window.history.pushState({}, '', url);

    } catch (error) {
      console.error('Error generating story:', error);
      setStoryParts(['Sorry, something went wrong while generating the story.']);
    } finally {
      setIsLoading(false);
      setActiveGeneration(null);
    }
  };

  const generateImageForPart = async (storyPart: string, index: number) => {
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: storyPart }),
      });

      const { imageBase64 } = await response.json();
      setImageBase64s(prev => {
        const newImages = [...prev];
        newImages[index] = imageBase64;
        return newImages;
      });
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  useEffect(() => {
    if (storyParts.length === 3 && storyParts.some(p => p.length > 0)) {
      setActiveGeneration('images');
      storyParts.forEach((part, index) => {
        if (part) { // Only generate image if the part is not empty
          generateImageForPart(part, index);
        }
      });
      setActiveGeneration(null);
    }
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
          onClick={handleGenerateStory}
          disabled={isLoading}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
        >
          Generate 3-Part Story
        </button>
      </div>

      {isLoading && (
        <div className="text-center my-8">
          <p className="text-lg text-gray-600 animate-pulse">Generating {activeGeneration}...</p>
        </div>
      )}

      <div className="space-y-12">
        {storyParts.map((storyPart, index) => (
          storyPart && (
            <div key={index} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8 items-center`}>
              <div className="w-2/3 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-primary">Chapter {index + 1}: Story</h2>
                <div className="prose prose-lg max-w-none text-gray-700">{storyPart}</div>
              </div>
              <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-primary">Chapter {index + 1}: Image</h2>
                {imageBase64s[index] ? (
                  <div className="flex justify-center">
                    <img src={`data:image/png;base64,${imageBase64s[index]}`} alt="Generated by AI" className="rounded-lg max-w-full h-auto" />
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
