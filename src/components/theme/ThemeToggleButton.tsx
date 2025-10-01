import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "../ui/button"

export default function ThemeToggleButton() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null)

  useEffect(() => {
    // Initialize from localStorage or system preference, falling back to DOM class
    try {
      const stored = localStorage.getItem("theme")
      const prefersDark =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      const isDomDark = document.documentElement.classList.contains("dark")
      const initial = stored
        ? (stored as "light" | "dark")
        : prefersDark
          ? "dark"
          : isDomDark
            ? "dark"
            : "light"
      setTheme(initial)
    } catch (e) {
      console.error("Failed to initialize theme:", e)
      const isDark = document.documentElement.classList.contains("dark")
      setTheme(isDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  if (!theme) {
    return null
  }

  return (
    <Button
      variant="ghost"
      className="bg-accent-foreground text-accent cursor-pointer"
      size="icon"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
