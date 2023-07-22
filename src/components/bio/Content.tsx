import React from "react"

import SectionTitle from "@/components/ui/SectionTitle"

export default function BioContent({ contents }: { contents: string[] }) {
  return (
    <div>
      <SectionTitle>Bio</SectionTitle>
      {contents.map((paragraph) => (
        <div key={paragraph}>{paragraph.trim()}</div>
      ))}
    </div>
  )
}
