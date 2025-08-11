import { qna } from "@/constants/recruiter-qa"

import Section from "@/components/ui/Section"
import SectionTitle from "@/components/ui/SectionTitle"

// TODO: Move this to an environment variable
const SECRET_TOKEN = "my-secret-recruiter-token"

export default function RecruiterQAPage({
  searchParams
}: {
  searchParams: { token?: string }
}) {
  const { token } = searchParams

  if (token !== SECRET_TOKEN) {
    return (
      <Section>
        <SectionTitle>Unauthorized</SectionTitle>
        <p>You are not authorized to view this page.</p>
      </Section>
    )
  }

  return (
    <Section>
      <SectionTitle>Recruiter Q&A</SectionTitle>
      <div className="flex flex-col gap-6">
        {qna.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">{item.question}</h3>
            <p className="text-gray-700 dark:text-gray-300">{item.answer}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
