'use client';
import { ReactNode, useEffect, useState } from "react";
import { BackgroundImage, Box, Container, Transition } from "@mantine/core";
import bgImg1 from '@/../public/page3/Rendering_BACKGROUND_FINAL.webp';
import previewImg1 from '@/../public/page3/Rendering_SMALL_FINAL.webp';
import bgImg2 from '@/../public/page3/Virtual_tour_BACKGROUND_FINAL.webp';
import bgImg2Mobile from '@/../public/page3/Virtual_tour_BACKGROUND_FINAL_movil.webp';
import previewImg2 from '@/../public/page3/Virtual_tour_SMALL_FINAL.webp';
import previewImg3 from '@/../public/page3/marketing_FP_SMALL_FINAL.webp';
import bgImg3 from '@/../public/page3/marketing_FP_BACKGROUND_FINAL.webp';
import { Tour360Icon, RenderIcon, FloorPlanIcon } from '@/../public/Iconos/icons'
import { Preview } from "@/app/page3/components/preview";
import { CustomText } from "@/components/customText";
import { DELAY_ANIMATION, PAGE_3_ID } from "@/utils/consts";
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

const data_base: data[] = [
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

const data_mod: data[] = JSON.parse(JSON.stringify(data_base))
data_mod[0].icon = <RenderIcon color="white" height="2.5rem" /> // al crear un nuevo objj se re asignan los icons ya q se corrompen
data_mod[1].icon = <Tour360Icon color="white" height="2.5rem" />
data_mod[2].icon = <FloorPlanIcon color="white" height="2.5rem" />
data_mod[1].img = bgImg2Mobile.src

export default function Page3() {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [indexData, setIndexData] = useState<number>(1)
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  const [data, setData] = useState<data[]>(data_base)

  useEffect(() => {
    if (isXS) setData(data_mod)
    else setData(data_base)
  }, [isXS])

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
        <Container id={PAGE_3_ID} style={{
          minWidth:'100%',
          height: '100vh',
          padding: 0,
        }}>
          <Box style={{ backgroundColor: '#131313', zIndex: -1, height: '100vh', width: '100%', position: 'absolute' }} >
            <BackgroundImage
              src={data[indexData].img}
              style={{
                ...transitionStyle,
                minHeight: isXS ? '80vh' :'100vh',
              }}
            />
          </Box>
          <Box style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            paddingLeft: '11vw',
            paddingRight: '7vw',
            paddingTop: '20vh',
            paddingBottom: '10vh',
            ...(isXS ? { padding: '15% 10%' } : {}),
            flexDirection: isXS ? 'column-reverse' : 'column',
          }}>
            {isXS
              ? <CustomText style={{
                width:'100%',
                height:'5%',
                textAlign: 'center',
                fontSize: '1.5rem',
                ...transitionStyle,
              }}>
                {data[indexData].titlePreview}
              </CustomText>
              : <></> 
            }
            <Box style={{
              display: 'flex',
              justifyContent: isXS ? 'center' : 'end',
              gap: '.3rem',
              width: '100%',
              height: isXS ? '20%' : '70%',
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
            <Box style={{
              height: isXS ? '70%' : '20%',
              display: 'flex',
              flexDirection: 'column',
              gap: isXS ? '.4rem': 0,
              alignItems: isXS ? 'center' : 'start',
            }}>
              <CustomText style={{
                color: '#dfdfe0',
                fontSize: getByBreakPoint<string>('1.6rem', '1.7rem', '1.9rem', '2.1rem', '2.3rem'),
                fontStyle: 'italic',
                textAlign: isXS ? 'center' : 'left',
                ...transitionStyle,
              }}>
                {data[indexData].title}
              </CustomText>
              <CustomText style={{
                textAlign: isXS ? 'center' : 'left',
                fontSize: getByBreakPoint<string>('.8rem', '.9rem', '1rem', '1.1rem', '1.3rem'),
                lineHeight: '1.2',
                width: getByBreakPoint<string>('85%', '50%', '45%', '40%', '40%'),
                ...transitionStyle,
              }}>
                {data[indexData].text}
              </CustomText>
            </Box>
            {!isXS
              ? <Box style={{ height: '10%', display: 'flex', justifyContent: 'end', alignItems: 'end' }}>
                <CustomText style={{
                  fontSize: getByBreakPoint<string>('.8rem', '.9rem', '1.1rem', '1.3rem', '1.5rem'),
                  fontStyle: 'italic',
                  textAlign: 'end',
                  ...transitionStyle,
                }}>
                  {data[indexData].slogan}
                </CustomText>
              </Box>
              : <></>
            }
          </Box>
        </Container>
      )}
    </Transition>
  )
}