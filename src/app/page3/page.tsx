'use client';
import { ReactNode, useState } from "react";
import { BackgroundImage, Box, Container, Transition } from "@mantine/core";
import bgImg1 from '@/../public/page3/Rendering_BACKGROUND_FINAL.png';
import previewImg1 from '@/../public/page3/Rendering_SMALL_FINAL.png';
import bgImg2 from '@/../public/page3/Virtual_tour_BACKGROUND_FINAL.png';
import previewImg2 from '@/../public/page3/Virtual_tour_SMALL_FINAL.png';
import previewImg3 from '@/../public/page3/marketing_FP_SMALL_FINAL.png';
import bgImg3 from '@/../public/page3/marketing_FP_BACKGROUND_FINAL.png';
import { Tour360Icon, RenderIcon, FloorPlanIcon } from '@/../public/Iconos/icons'
import { Preview } from "@/app/page3/components/preview";
import { CustomText } from "@/components/customText";
import { DELAY_ANIMATION } from "@/utils/conts";
import { useBreakPointHandler } from "@/hooks/breakpointHandler";

interface data {
  img: string,
  title: string,
  text: string,
  imgPreview: string,
  titlePreview: string,
  slogan: string,
  icon: ReactNode,
}

const data: data[] = [
  {
    img: bgImg1.src,
    imgPreview: previewImg1.src,
    title: 'Inspiring spaces.',
    text: 'Convey elegance and excitement—showcase the true value of your project with inspiring images..',
    slogan: 'Elevating Your Vision',
    titlePreview: 'Vision Rendering',
    icon: <RenderIcon color="white" height="3rem" />,
  }, {
    img: bgImg2.src,
    imgPreview: previewImg2.src,
    title: 'Immersive Experiences.',
    text: 'Transform your project into an immersive experience, elevating your brand’s perceived value.',
    slogan: 'Elevating Your Vision',
    titlePreview: 'Immersive Tours',
    icon: <Tour360Icon color="white" height="3rem" />,
  }, {
    img: bgImg3.src,
    imgPreview: previewImg3.src,
    title: 'Communicating exclusivity.',
    text: 'Turn your blueprints into a narrative that conveys exclusivity.',
    slogan: 'Elevating Your Vision',
    titlePreview: 'Apex Blueprints',
    icon: <FloorPlanIcon color="white" height="3rem" />,
  },
]

export default function Page3() {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [indexData, setIndexData] = useState<number>(0)
  const { getByBreakPoint, isXS } = useBreakPointHandler()

  const indexHandler = (index: number) => {
    if (index === indexData) return
    setIsVisible(prev => !prev)
    setTimeout(() => {
      setIndexData(index)
      setIsVisible(prev => !prev)
    }, DELAY_ANIMATION)
  }
  
  return (
    <Transition
      mounted={isVisible}
      transition='fade'
      duration={DELAY_ANIMATION}
      timingFunction='ease'
    >
      {(transitionStyle) => (
        <Container style={{
          minWidth:'100%',
          height: '100vh',
          padding: 0,
        }}>
          <BackgroundImage
            src={data[indexData].img}
            style={{
              ...transitionStyle,
              zIndex: -1,
              minHeight: '100vh',
              position: 'absolute',
            }}
          />
          <Box style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            paddingLeft: '11vw',
            paddingRight: '7vw',
            paddingTop: '20vh',
            paddingBottom: '10vh',
            flexDirection: 'column',
          }}>
            <Box style={{
              display: 'flex',
              alignItems: isXS ? 'end' : 'start',
              justifyContent: isXS ? 'center' : 'end',
              gap: '.3rem',
              width: '100%',
              height: '70%',
            }}>
              {data.map((item, index) => (
                <Preview
                  key={index}
                  isSelected={indexData === index}
                  icon={item.icon}
                  image={item.imgPreview}
                  title={item.titlePreview}
                  onClick={indexHandler.bind(null, index)}
                />
              ))}
            </Box>
            <Box style={{ height: '20%' }}>
              <CustomText style={{
                color: '#dfdfe0',
                fontSize: getByBreakPoint<string>('1.6rem', '1.7rem', '1.9rem', '2.1rem', '2.3rem'),
                fontStyle: 'italic',
                ...transitionStyle,
              }}>
                {data[indexData].title}
              </CustomText>
              <CustomText style={{
                fontSize: getByBreakPoint<string>('.8rem', '.9rem', '1rem', '1.1rem', '1.3rem'),
                lineHeight: '1.2',
                width: getByBreakPoint<string>('55%', '50%', '45%', '40%', '40%'),
                ...transitionStyle,
              }}>
                {data[indexData].text}
              </CustomText>
            </Box>
            <Box style={{ height: '10%', display: 'flex', justifyContent: 'end', alignItems: 'end' }}>
              <CustomText style={{
                fontSize: getByBreakPoint<string>('.8rem', '.9rem', '1.1rem', '1.3rem', '1.5rem'),
                fontStyle: 'italic',
                textAlign: 'end',
                ...transitionStyle,
              }}>
                {data[indexData].slogan}
              </CustomText>
            </Box>
          </Box>
        </Container>
      )}
    </Transition>
  )
}