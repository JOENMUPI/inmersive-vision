'use client'
import { Box, Container, Grid, Image, Transition } from '@mantine/core';
import { DELAY_ANIMATION, PAGE_TEMPLPATE_5_ID, PRIMARY_COLOR_RGB, TEXT_COLOR_GRAY } from '@/utils/consts';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { CustomText } from '@/components/customText';
import { useIndexList } from '@/hooks/indexList';
import { useState } from 'react';
import { NavBar } from '@/app/template/components/page5/components/NavBar';
import { data5I } from '@/app/template/utils/interfaces';

export default function Page5({ data }: { data: data5I }) {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  const { dataIndex, nextIndex, prevIndex } = useIndexList({
    length: data.units.length,
    initIndex: 0,
  })

  const textSize = getByBreakPoint<string>('1rem','1.1rem','1.2rem','1.3rem','1rem')

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
        <Container id={PAGE_TEMPLPATE_5_ID} style={{
          minWidth:'100%',
          height: '130vh',
          padding: 0,
          }}>
          <Box style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '10vh',
            paddingLeft: '11vw',
            paddingRight: '7vw',
            paddingBottom: '9vh',
            background: `linear-gradient(180deg, ${PRIMARY_COLOR_RGB(.2)}, rgba(19, 19, 19, 0) 10%)`,
          }}>
            <CustomText style={{
              fontWeight: '200',
              textAlign: 'center',
              fontSize: getByBreakPoint<string>('1.5rem','2rem','3rem','3.5rem','2.5rem'),
            }}>
              {data.title}  
            </CustomText>
            <CustomText style={{
              marginTop: '5rem',
              fontWeight: '600',
              width: '100%',
              fontSize: getByBreakPoint<string>('1.5rem','2rem','3rem','3.5rem','4rem'),
            }}>
              {data.subTitle}  
            </CustomText>
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
              <Grid h='100%'>
                <Grid.Col h='100%' span={{ base: 12, xs: 8 }}>
                  <Image
                    alt='img ref'
                    src={data.units[dataIndex].img}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />  
                </Grid.Col>
                <Grid.Col h='100%' span={{ base: 0, xs: .3 }} />
                <Grid.Col h='100%' span={{ base: 12, xs: 3.7 }}>
                  <CustomText style={{
                    fontWeight: '200',
                    marginBottom: '2rem',
                    fontSize: getByBreakPoint<string>('1.5rem','2rem','3rem','3.5rem','3.5rem'),
                  }}>
                    {data.units[dataIndex].title}
                  </CustomText>     
                  {data.units[dataIndex].units.map((val, index) => 
                    <Box key={index}>
                      <CustomText style={{
                        fontWeight: '600',
                        fontSize: textSize,
                      }}>
                        {val.title}
                      </CustomText>
                      <CustomText style={{
                        fontWeight: '200',
                        color: TEXT_COLOR_GRAY,
                        fontSize: textSize,
                      }}>
                        {val.description}
                      </CustomText>    
                    </Box>
                  )}
                </Grid.Col>
              </Grid>
            </Box>
            <Box
              style={{
                width: '100%',
                height: '25%',
                display: 'flex',
                alignItems: isXS ? 'start' : 'end',
              }}>
              <NavBar
               prevFn={prevImg}
               nextFn={nextImg}
               length={data.units.length}
               position={dataIndex}
              />
            </Box>
          </Box>
        </Container>
      )}
    </Transition>
  );
};