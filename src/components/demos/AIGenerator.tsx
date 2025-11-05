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
    handleFeelingLucky
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
      />

      {result && <CreativeAgentResults result={result} />}

      {error && (
        <p className="text-destructive text-center text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
