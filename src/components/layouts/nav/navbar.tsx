"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AVATAR_URL } from "@/constants/assets"

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

  const styles = {
    root: cn(
      "sticky top-0 z-10",
      "flex flex-row justify-between",
      "px-[.5vw] py-3 sm:px-[2vw]",
      { "backdrop-blur-md": !enableTopBar }
    ),
    image: cn("transition-opacity duration-300 ease-in-out", {
      "opacity-0": enableTopBar
    })
  }

  return (
    <nav className={styles.root}>
      <div className={styles.image}>
        <Image
          src={AVATAR_URL}
          alt="Profile Image"
          className="rounded-full"
          width={50}
          height={50}
          priority
        />
      </div>
      <div className="flex items-center gap-4">
        <Link href="/space-cat" className="hover:underline">
          Space Cat
        </Link>
        <ThemeToggleButton />
      </div>
    </nav>
  )
}
