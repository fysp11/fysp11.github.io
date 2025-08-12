import type { IPersonalInfo } from "@/lib/types"
import BioContent from "@/components/bio/Content"
import BioHeader from "@/components/bio/Header"

interface BioProps {
  personal: IPersonalInfo
}
export default function BioView({ personal }: BioProps) {
  return (
    <section className="flex flex-col gap-5">
      <BioHeader {...personal} />
      <BioContent contents={personal.bio} />
    </section>
  )
}
