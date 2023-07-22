import { useEffect, useState } from "react"
import Image from "next/image"
import logo from "@/assets/img/fysp_aigen1.jpg"

import { cn } from "@/lib/utils"
import ThemeToggleButton from "@/components/ui/ThemeToggleButton"

export default function Navbar() {
  const [pageYOffset, setPageYOffset] = useState(0)

  const handleScroll = () => {
    const position = window.scrollY
    setPageYOffset(position)
  }

  const enableTopBar = pageYOffset < 150

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navClass = cn(
    "sticky top-0 z-10",
    "flex flex-row justify-between",
    "px-[.5vw] py-3 sm:px-[2vw]",
    { "backdrop-blur-md": !enableTopBar }
  )

  const imageClasses = cn("rounded-full", {
    "opacity-0": enableTopBar
  })

  return (
    <nav className={navClass}>
      <Image
        src={logo}
        alt="Profile Image"
        width={50}
        height={50}
        className={imageClasses}
        priority
      />
      <ThemeToggleButton />
    </nav>
  )
}
