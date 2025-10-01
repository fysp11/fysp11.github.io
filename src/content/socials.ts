import type { ISocialItem } from "../lib/types"
import { IoLogoGithub } from "react-icons/io5"
import { FaEthereum } from "react-icons/fa"
import { IoLogoTwitter } from "react-icons/io5"
import { BiDonateHeart } from "react-icons/bi"
import { FaCalendarPlus } from "react-icons/fa"
import { FaEnvelope } from "react-icons/fa"

export const socials: ISocialItem[] = [
  {
    label: "github",
    url: "https://github.com/fysp11",
    icon: IoLogoGithub
  },
  {
    label: "poap",
    url: "https://app.poap.xyz/scan/fysp.eth",
    icon: FaEthereum
  },
  {
    label: "twitter",
    url: "https://twitter.com/fysp",
    icon: IoLogoTwitter
  },
  {
    label: "support",
    url: "https://apoia.se/cozinhasolidaria",
    icon: BiDonateHeart
  },
  {
    label: "contact",
    url: "https://app.reclaim.ai/m/fysp",
    icon: FaCalendarPlus
  },
  {
    label: "email",
    url: "mailto:contact@fysp.dev",
    icon: FaEnvelope
  }
]
