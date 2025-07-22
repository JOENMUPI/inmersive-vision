'use client'
import { BackgroundImage, Box, Container, Transition } from '@mantine/core';
import { CustomText } from '@/components/customText';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { DELAY_ANIMATION, PAGE_TEMPLPATE_1_ID } from '@/utils/consts';
import { data1I } from '@/app/template/utils/interfaces';
import { HeaderTemplateMenu } from './components/header';

export default function Page1({ data }: { data: data1I }) {
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  const widthTitle = isXS ? '100%' : '50%'

  return (
    <Transition
    mounted={true}
    transition='fade'
    duration={DELAY_ANIMATION}
    timingFunction='ease'
    >
      {(transitionStyle) => (
        <Container id={PAGE_TEMPLPATE_1_ID} style={{
          minWidth:'100%',
          height: '100vh',
          padding: 0,
        }}>
          <HeaderTemplateMenu />
          <BackgroundImage
            src={data.bgImg}
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
                height: '100%',
                justifyContent: 'end',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',  
              }}>
              <CustomText style={{
                fontWeight: '200',
                width: widthTitle,
                fontSize: getByBreakPoint<string>('1.5rem','2rem','3rem','3.5rem','3.5rem'),
                fontStyle: 'italic'
              }}>
                {data.title}
              </CustomText>
            </Box>
          </Box>
        </Container>
      )}
    </Transition>
  );
};