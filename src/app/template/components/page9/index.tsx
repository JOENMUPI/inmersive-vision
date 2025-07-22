'use client'
import { Box, Container, Image } from '@mantine/core';
import { PAGE_TEMPLPATE_9_ID, PRIMARY_COLOR_RGB } from '@/utils/consts';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import Autoplay from 'embla-carousel-autoplay';

import { CustomText } from '@/components/customText';
import { Carousel } from '@mantine/carousel';
import Link from 'next/link';
import { useRef } from 'react';
import { data9I } from '@/app/template/utils/interfaces';

export default function Page9({ data }: { data: data9I[] }) {
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  if (data.length === 0) return null
  return (
    <Container id={PAGE_TEMPLPATE_9_ID} style={{
      minWidth:'100%',
      height: isXS ? '40vh' : '115vh',
      padding: 0,
      }}>
      <Box style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        gap: '2rem',
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        paddingTop: '10vh',
        flexDirection: 'column',
      }}>
        <CustomText style={{
          fontWeight: '200',
          height: '10%',
          textAlign: 'center',
          fontSize: getByBreakPoint<string>('1.5rem','2rem','3rem','3.5rem','4rem'),
        }}>
          Other Relevant Projects
        </CustomText>
        <Carousel
          slideSize="70%"
          slideGap="md"
          controlsOffset="sm"
          controlSize={26}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={() => autoplay.current.play()}
          initialSlide={1}
          withControls={!isXS}
          withIndicators={false}
        >
          {data.map((val, index) =>
            <Carousel.Slide key={index}>
              <Link href={val.url} target="_blank">
                <Box style={{ height:'90%', width: '100%' }}>
                  <Image
                    alt={val.title}
                    src={val.img}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </Box>
                <Box style={{
                  height:'10%',
                  width: '100%',
                  backgroundColor: PRIMARY_COLOR_RGB(.4),
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 1rem 0 1rem'
                }}>
                  <CustomText style={{ 
                    fontSize: getByBreakPoint<string>('.8rem','1.1rem','1.2rem','1.3rem','1.5rem'),
                  }}>
                    {val.title}
                  </CustomText>
                </Box>
              </Link>
            </Carousel.Slide>  
          )}
        </Carousel>
      </Box>
    </Container>
  );
};