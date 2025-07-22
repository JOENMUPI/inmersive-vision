'use client'
import { Accordion, Box, Button, Container, Grid, Transition } from '@mantine/core';
import { DELAY_ANIMATION, PAGE_TEMPLPATE_7_ID, TEXT_COLOR_GRAY } from '@/utils/consts';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { CustomText } from '@/components/customText';
import { useState } from 'react';
import { data7I } from '@/app/template/utils/interfaces';

export default function Page7({ data }: { data: data7I }) {
  const [sectionSelected, setSectionSelected] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const { isXS, getByBreakPoint } = useBreakPointHandler()

  const changeFaq = (index: number) => {
    if (index === sectionSelected) return;
    
    setIsVisible(prev => !prev)
    setTimeout(() => {
      setSectionSelected(index)
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
        <Container id={PAGE_TEMPLPATE_7_ID} style={{
          minWidth:'100%',
          height: '100vh',
          padding: 0,
        }}>
          <Box style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#0a0a0a',
            padding: '10vh 12vw 0 12vw  '
          }}>
            <CustomText style={{ fontSize:'1rem', fontWeight: 600 }}>
              F A Q S
            </CustomText>
            <Grid gutter='xl'>
              <Grid.Col h={isXS ? '10vh' : '40vh'} span={{ base: 12, xs: 8 }}>
                <CustomText style={{ fontSize: getByBreakPoint<string>('2rem', '2rem','3.5rem','4rem', '5rem'), fontWeight: 600, color: 'white' }}>
                  {data.title}
                </CustomText>
              </Grid.Col>
              <Grid.Col h={isXS ? '10vh' : '30vh'} span={{ base: 12, xs: 4 }} style={{ display: 'flex', alignItems: 'end' }}>
                <CustomText style={{ fontSize: '1rem', lineHeight: '2rem', fontWeight: 200, color: TEXT_COLOR_GRAY }}>
                  {data.description}
                </CustomText>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 4 }} style={{ display: 'flex', flexDirection: isXS ? 'row' : 'column', gap: '2rem' }}>
                {data.sections.map((val, index) =>
                  <Button
                    key={index}
                    variant='transparent'
                    onClick={() => changeFaq(index)}
                    style={{
                      transition:'all .2s ease',
                      fontSize: getByBreakPoint<string>('1rem', '1.1rem','1.2rem','1.3rem', '1.5rem'),
                      color:'white',
                      borderRadius: '.7rem',
                      height: '5rem',
                      backgroundColor: sectionSelected === index ? '#636363' : '#2a2a2a'
                    }}
                  >
                    {val.title}
                  </Button>
                )}
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 8 }}>
                <Accordion variant='separated' style={{ ...transitionStyle }}>
                  {data.sections[sectionSelected].questions.map((val, index) =>
                    <Accordion.Item key={index} style={{ borderRadius: '1rem', marginBottom: '1rem', backgroundColor: '#2a2a2a' }} value={val.question}>
                      <Accordion.Control>
                        <CustomText style={{ fontSize: '1.2rem', fontWeight: 500 }}>                    
                          {val.question}
                        </CustomText>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <CustomText style={{ color: TEXT_COLOR_GRAY, lineHeight: '2rem' }}>
                          {val.response}
                        </CustomText>
                      </Accordion.Panel>
                    </Accordion.Item>
                  )}
                </Accordion>
              </Grid.Col>
            </Grid>
          </Box>
        </Container>
      )}
    </Transition>
  );
};