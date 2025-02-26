'use client';
import { CustomText } from '@/components/customText';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { DELAY_ANIMATION, TEXT_COLOR_GRAY } from '@/utils/conts';
import { ActionIcon, Box, Button, Container, Image, Paper, Transition } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import { CustomTooltip } from '@/components/customTooltip';
import { NavBar } from './components/NavBar';
import CompanyLogo360 from '@/../public/page5/logo_360_pros.png';
import CompanyLogoAnaStudio from '@/../public/page5/logo_ana_studio.png';
import CompanyLogoAvalonPark from '@/../public/page5/logo_avalon_park.png';
import CompanyLogoFloridaHousePLan from '@/../public/page5/logo_Florida_house_plan.png';
import CompanyLogoH2Group from '@/../public/page5/logo_h2_group.png';
import CompanyLogoMVI from '@/../public/page5/logo_mvi.png';
import rosAvatar from '@/../public/page5/Ros_Photo.png';
import gotitasImg from '@/../public/page5/gotitas.png'
import joseColoAvatar from '@/../public/page5/Jose_colo_Photo.png';
import davidAvatar from '@/../public/page5/David_Photo.png';


interface IComments {
  name: string,
  company: string,
  rattings: number,
  img: string,
  comment: string,
  url: string,
}


interface data {
  title: string,
  googleReviewBtnText: string,
  comments: IComments[],
}

const data: data = {
  title: 'Inevitable Impact',
  googleReviewBtnText: 'Google Reviews',
  comments: [
    {
      name: 'Ros Halle',
      company: 'Avalon Park Group',
      rattings: 4,
      img: rosAvatar.src,
      comment: 'They brought the vision of Avalon Park to reality in a technological way, showing what Avalon Park Wesley Chapel is all about. Totally gratefull.',
      url: 'https://www.youtube.com/embed/jyznBJswDZc?si=HoRPijf6m0Tvslwu',
    }
  ]
}

const GRAY_COLOR_BTN = '#302c2c'

export default function Page5() {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [indexComment, setIndexComment] = useState<number>(0)
  const { getByBreakPoint } = useBreakPointHandler()
  const iconSize = getByBreakPoint<string>('1.5rem','1.5  rem','2rem','2.5rem','3rem')
  const comanyLogoSize = getByBreakPoint<string>('50%','60%','70%','70%','70%')
  const marginVideo = '5%'

  const nextFn = () => {

  }

  const previusFn = () => {

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
          <Box style={{ width: '100%', height: '100%', padding: '2% 3%', paddingBottom: 0 }}>
            <Box style={{ display: 'flex', width: '100%', height: '70%' }}>
              <Box style={{ width: '20%', height: '100%' }}>
                <CustomText style={{ fontSize: '2rem', fontStyle: 'italic', marginBottom: '30%' }}>
                  {data.title}
                </CustomText>
                <Paper style={{ width: '100%', height: '60%', backgroundColor: GRAY_COLOR_BTN }}>
                </Paper>
              </Box>
              <Box style={{ width: '80%', height: '100%', display: 'flex' }}>
                <Box style={{ width: marginVideo, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CustomTooltip label="Previous">
                    <ActionIcon
                      variant="transparent"
                      color="gray"
                      aria-label="rightArrow"
                      onClick={previusFn}
                      size={iconSize}
                      >
                      <IconChevronLeft style={{ transition: 'all .2s ease' }} size={iconSize} /> 
                    </ActionIcon>
                  </CustomTooltip>
                </Box>
                <iframe
                  style={{ border: `1px solid ${TEXT_COLOR_GRAY}`, borderRadius: '1rem' }}
                  width="90%"
                  height="100%"
                  src={data.comments[indexComment].url}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <Box style={{ width: marginVideo, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CustomTooltip label="Next">
                    <ActionIcon
                      variant="transparent"
                      color="gray"
                      aria-label="rightArrow"
                      onClick={nextFn}
                      size={iconSize}
                      >
                      <IconChevronRight style={{ transition: 'all .2s ease' }} size={iconSize} /> 
                    </ActionIcon>
                  </CustomTooltip>
                </Box>
              </Box>
            </Box>
            <Box style={{ width: '100%', height: '30%', }}>
              <Box style={{
                paddingRight: marginVideo,
                width: '100%',
                height: '64%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'end'
              }}>
                <NavBar length={data.comments.length} position={indexComment} style={{ height:'68%', marginRight: '2.5%' }} />
                <Button color={GRAY_COLOR_BTN} size='xl' style={{ width: '20%', height:'32%', borderRadius: '.7rem' }}>
                  {data.googleReviewBtnText}
                </Button>                
                
              </Box>
              <Box style={{ width: '100%', height: '35%', display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
                <Image 
                  src={CompanyLogo360.src}
                  alt='360 Pros'
                  style={{ transition: 'all .2s ease', width:'20%', height: comanyLogoSize }}
                />
                <Image
                  src={CompanyLogoAnaStudio.src}
                  alt='Ana Studio'
                  style={{ transition: 'all .2s ease', width:'20%', height: comanyLogoSize }}
                />
                <Image
                  src={CompanyLogoAvalonPark.src}
                  alt='Avalon Park'
                  style={{ transition: 'all .2s ease', width:'20%', height: comanyLogoSize }}
                />
                <Image
                  src={CompanyLogoFloridaHousePLan.src}
                  alt='Florida House Plan'
                  style={{ transition: 'all .2s ease', width:'20%', height: comanyLogoSize }}
                />
                <Image
                  src={CompanyLogoH2Group.src}
                  alt='H2 Group'
                  style={{ transition: 'all .2s ease', width:'20%', height: comanyLogoSize }}
                />
                <Image 
                  src={CompanyLogoMVI.src}
                  alt='MVI'
                  style={{ transition: 'all .2s ease', width:'20%', height: comanyLogoSize }}
                />
              </Box>  
            </Box>
          </Box>    
        </Container>
      )}
    </Transition>
  )
}