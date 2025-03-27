'use client'
import { useState } from 'react';
import { BackgroundImage, Box, Container, Transition } from '@mantine/core';
import { indxeListI, useIndexList } from '@/hooks/indexList';
import { NavBar } from '@/app/page1/components/NavBar';
import img1 from '@/../public/page1/Foto_web_portada_01.webp';
import img2 from '@/../public/page1/Foto_web_portada_02.webp';
import img3 from '@/../public/page1/Foto_web_portada_03.webp';
import { CustomText } from '@/components/customText';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { DELAY_ANIMATION, PAGE_1_ID, TEXT_COLOR_GRAY } from '@/utils/conts';

interface data {
  img: string,
  title: string,
  text: string,
  projectName: string,
  companyName: string,
}

const data: data[] = [
  {
    img: img1.src,
    title: 'We craft immersive experiences.',
    text: 'Every space tells a story.',
    projectName: 'Avalon Park Wesley Chapel',
    companyName: 'Avalon Park Group',
  }, {
    img: img2.src,
    title: 'Contemporary elegance.',
    text: 'A sophisticated design with a timeless essence that expresses exclusivity.',
    projectName: 'Renacer',
    companyName: 'Florida House Plan',
  }, {
    img: img3.src,
    title: 'Walking into the future.',
    text: '"Museum" – An innovative concept inspired by the history of its founders, set within a marine environment.',
    projectName: 'CDF Museum',
    companyName: 'Combat diver foundation, 360 Pros Virtual Media Inc.'
  },
]

const DEFAIULT_INDEX_LIST: indxeListI = {
  length: data.length,
  initIndex: 0,
}

export default function Page1() {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const { dataIndex, nextIndex, prevIndex } = useIndexList(DEFAIULT_INDEX_LIST)
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  
  const widthTitle = isXS ? '100%' : '50%'

  const nextImg = () => {
    setIsVisible(prev => !prev)
    setTimeout(() => {
      nextIndex()
      setIsVisible(prev => !prev)
    }, DELAY_ANIMATION)
  }

  const prevImg = () => {
    setIsVisible(prev => !prev)
    setTimeout(() => {
      prevIndex()
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
        <Container id={PAGE_1_ID} style={{
          minWidth:'100%',
          height: '100vh',
          padding: 0,
          }}>
          <BackgroundImage
            src={data[dataIndex].img}
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
            paddingLeft: '11vw',
            paddingRight: '7vw',
            paddingBottom: '9vh',
          }}>
            <Box
              style={{
                ...transitionStyle,
                width: '100%',
                height: '75%',
                justifyContent: 'end',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',  
              }}>
              <CustomText style={{
                fontWeight: '200',
                width: widthTitle,
                lineHeight: '1.2',
                fontSize: getByBreakPoint<string>('1.5rem','2rem','3rem','3.5rem','3.5rem'),
                fontStyle: 'italic'
              }}>
                {data[dataIndex].title}
              </CustomText>
              <CustomText style={{
                fontWeight: '600',
                width: widthTitle,
                fontSize: getByBreakPoint<string>('.7rem','1rem','1.5rem','1.8rem','2rem')
              }}>
                {data[dataIndex].text}
              </CustomText>
            </Box>
            <Box
              style={{
                width: '100%',
                height: '25%',
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'end',
                flexDirection: 'column',
              }}>
              <NavBar
               prevFn={prevImg}
               nextFn={nextImg}
               length={data.length}
               position={dataIndex}
              />
              <CustomText style={{
                ...transitionStyle,
                textAlign: 'right',
                fontSize: getByBreakPoint<string>('.9rem','1rem','1.2rem','1.3rem','1.3rem'),
              }}>
                {data[dataIndex].projectName}
              </CustomText>
              <CustomText style={{
                ...transitionStyle,
                textAlign: 'right',
                fontSize: getByBreakPoint<string>('.6rem','.7rem','.8rem','.9rem','.9rem'),
                fontStyle: 'italic',
                color: TEXT_COLOR_GRAY
              }}>
                {data[dataIndex].companyName}
              </CustomText>
            </Box>
          </Box>
        </Container>
      )}
    </Transition>
  );
};