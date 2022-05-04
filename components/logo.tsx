import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { Text, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'

const LogoBox = styled.span`
    font-weight: bold;
    font-size: 18px;
    display: inline-flex;
    align-items: center;
    height: 30px;
    line-height: 20px;
    padding: 10px;
    img {
        transition: 200ms ease;
    }
    &:hover img {
        transform: rotate(20deg);
    }
`

interface LogoProps {
    text: string
    logo: StaticImageData | string
}


const Logo = ({ text, logo }: LogoProps) => {
    // const footPrintImg = `/images/footprint${useColorModeValue('', '-dark')}.png`

    return (
        <Link href="/" scroll={false}>
            <a>
                <LogoBox>
                    <Image src={logo} width={20} height={20} alt="logo" />
                    <Text
                        color={useColorModeValue('gray.800', 'whiteAlpha.900')}
                        fontFamily='M PLUS Rounded 1c", sans-serif'
                        fontWeight="bold"
                        ml={3}
                    >
                        {text}
                    </Text>
                </LogoBox>
            </a>
        </Link>
    )
}

export default Logo