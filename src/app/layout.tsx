import { M_PLUS_Rounded_1c } from "next/font/google"

import NavBar from "@/components/layouts/nav/navbar"

import "@/styles/globals.css"

import type { PropsWithChildren } from "react"

import Container from "@/components/ui/Container"
import Footer from "@/components/layouts/footer"
import Providers from "@/components/providers"

const fontFamily = M_PLUS_Rounded_1c({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap"
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={fontFamily.className} suppressHydrationWarning>
      <body>
        <Providers>
          <NavBar />
          <Container className="mx-[1.5vw] my-[1vh] sm:m-auto">
            {children}
          </Container>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
