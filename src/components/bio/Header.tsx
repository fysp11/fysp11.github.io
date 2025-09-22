import { AVATAR_URL } from "@/constants/assets"

import { cn } from "@/lib/utils"

interface BioHeaderProps {
  name: string
  subtitle: string
}
export default function BioHeader({ name, subtitle }: BioHeaderProps) {
  const squareSize = 96

  const styles = {
    box: "flex justify-between gap-[3vw]",
    image: {
      root: "mt-4 shrink-0 md:ml-6 md:mt-0 text-center",
      border: cn(
        "size-24 border border-white",
        "inline-block overflow-hidden rounded-full"
      )
    }
  }

  return (
    <section className={styles.box}>
      <div className="shrink-1">
        <h2 className="text-2xl">{name}</h2>
        <p>{subtitle}</p>
      </div>
      <div className={styles.image.root}>
        <div className={styles.image.border}>
          <img
            src={AVATAR_URL}
            alt={`${name}'s avatar`}
            width={squareSize}
            height={squareSize}
            className="h-full w-full rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
