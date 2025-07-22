'use client'
import { BackgroundImage, Box, Container } from '@mantine/core';
import { CustomText } from '@/components/customText';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { BG_COLOR, PAGE_TEMPLPATE_3_ID, PRIMARY_COLOR_RGB, TEXT_COLOR_GRAY } from '@/utils/consts';
import { data3I } from '@/app/template/utils/interfaces';

export default function Page3({ data }: { data: data3I }) {
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  const widthTitle = isXS ? '100%' : '50%'
  const textSize = getByBreakPoint<string>('1rem','1.1rem','1.2rem','1.3rem','1.2rem')

  return (
    <Container id={PAGE_TEMPLPATE_3_ID} style={{
      minWidth:'100%',
      height: '100vh',
      padding: 0,
      }}>
      <BackgroundImage
        src={data.bgImg}
        style={{
          zIndex: -2,
          minHeight: '100vh',
          position: 'absolute',
        }}
      />  
      <Box style={{
        minHeight: '100vh',
        position: 'absolute',
        width: '100%',
        zIndex: -1,
        background: `linear-gradient(90deg, ${BG_COLOR}, rgba(19, 19, 19, 0))`,
      }}/>
      <Box style={{
        zIndex: 1,
        width: '100%',
        height: '100%',
        paddingTop: '15vh',
        paddingLeft: '11vw',
        paddingRight: '7vw',
      }}>
        <Box
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'start',
            display: 'flex',
            flexDirection: 'column',
          }}>
          {data.units.map((val, index) => 
            <Box key={index}>
              <CustomText style={{
                fontWeight: '600',
                width: widthTitle,
                fontSize: textSize,
              }}>
                {val.title}
              </CustomText>
              <CustomText style={{
                fontWeight: '200',
                width: widthTitle,
                color: TEXT_COLOR_GRAY,
                fontSize: textSize,
              }}>
                {val.description}
              </CustomText>    
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};