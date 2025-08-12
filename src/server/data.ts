import { ME_PROFILE } from "@/constants/profile"
import { EXPERIENCES_DATA } from "@/constants/experiences"

export const getProfile = async () => {
    const { personal, socials } = ME_PROFILE
    return {
        personal,
        socials
    }
}

export const getExperiences = async () => {
    return EXPERIENCES_DATA
}
