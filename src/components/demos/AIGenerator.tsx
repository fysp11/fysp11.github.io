import CreativeAgentForm from "./CreativeAgentForm"
import CreativeAgentResults from "./CreativeAgentResults"
import { useCreativeAgent } from "./useCreativeAgent"

interface Props {
  initialPrompt?: string
}

export default function AIGenerator({ initialPrompt }: Props) {
  const {
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
  } = useCreativeAgent(initialPrompt)

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <CreativeAgentForm
        formState={formState}
        formHandlers={formHandlers}
        options={options}
        statusMessage={statusMessage}
        isLoading={isLoading}
        handleGenerate={handleGenerate}
        handleFeelingLucky={handleFeelingLucky}
        audioState={audioState}
        videoState={videoState}
        handleTranscribeAudio={handleTranscribeAudio}
        handleSpeak={handleSpeak}
        handleGenerateVideo={handleGenerateVideo}
        handleCancelVideo={handleCancelVideo}
      />

      {result && (
        <CreativeAgentResults
          result={result}
          audioState={audioState}
          videoState={videoState}
          handleSpeak={handleSpeak}
        />
      )}

      {error && (
        <p className="text-destructive text-center text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
