import SpaceCatScene from "@/components/scenes/SpaceCatScene"
import { FYSP_DEV_METADATA } from "@/constants/metadata"

export const metadata = {
  ...FYSP_DEV_METADATA,
  title: "Space Cat",
  description: "An interactive 3D space cat.",
}

export default function Page() {
  return (
    <article className="flex flex-col gap-7">
      <h1 className="text-2xl font-bold">Space Cat</h1>
      <p>Here is a cute space cat for you to pet. Click it!</p>
      <SpaceCatScene />
    </article>
  )
}
