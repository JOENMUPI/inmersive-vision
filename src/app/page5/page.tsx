'use client';
import { CustomText } from '@/components/customText';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { BG_COLOR, DELAY_ANIMATION, PAGE_5_ID, PRIMARY_COLOR_HEX_3, TEXT_COLOR_GRAY } from '@/utils/conts';
import { ActionIcon, Avatar, Box, Button, Container, Image, Paper, Rating, Transition } from '@mantine/core';
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
// import joseColoAvatar from '@/../public/page5/Jose_colo_photo.png';
import davidAvatar from '@/../public/page5/David_Photo.png';
import { QuotIcon } from '../../../public/Iconos/icons';


interface IComments {
  name: string,
  company: string,
  ratings: number,
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
      ratings: 4,
      img: rosAvatar.src,
      comment: 'They brought the vision of Avalon Park to reality in a technological way, showing what Avalon Park Wesley Chapel is all about. Totally gratefull.',
      url: 'https://www.youtube.com/embed/jyznBJswDZc?si=HoRPijf6m0Tvslwu',
    // }, {
    //   name: 'Jose Colon',
    //   company: 'MVI modern homes',
    //   ratings: 5,
    //   img: joseColoAvatar.src,
    //   comment: 'Brighing our desings to life before contruction was a game-changer. The immersive toour elevated our presentation, giving clients a true sense of space and exclusivity.',
    //   url: 'https://www.youtube.com/embed/bylU-_5BihU',
    }, {
      name: 'Davis Rodriguez',
      company: 'Total Building Desing',
      ratings: 5,
      img: davidAvatar.src,
      comment: 'their immersive approach allowed us to showcase our custom homes with unmatched realism. The level of detail and presision transformed the way our clinets experience their futures homes.',
      url: 'https://www.youtube.com/embed/bylU-_5BihU',
    }
  ]
}

const GRAY_COLOR_BTN = '#302c2c'

export default function Page5() {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [indexComment, setIndexComment] = useState<number>(0)
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  const iconSize = getByBreakPoint<string>('1.5rem','1.5  rem','2rem','2.5rem','3rem')
  const comanyLogoSize = getByBreakPoint<string>('30%','60%','70%','70%','70%')
  const marginVideo = isXS ? '0%' : '5%'
  const paperTextSize = getByBreakPoint<string>('.4rem','.5rem','.6rem','.7rem','.9rem')

  const changeHandler = <T,>(caseA: T, caseB: T) => getByBreakPoint<T>(caseA, caseA, caseA, caseB, caseB)
  
  const nextFn = () => {
    setIsVisible(false)
    setTimeout(() => {
      setIndexComment(indexComment === data.comments.length - 1 ? 0 : indexComment + 1)
      setIsVisible(true)
    }, DELAY_ANIMATION)
  }

  const previusFn = () => {
    setIsVisible(false)
    setTimeout(() => {
      setIndexComment(indexComment === 0 ? data.comments.length - 1 : indexComment - 1)
      setIsVisible(true)
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
        <Container id={PAGE_5_ID} style={{
          minWidth:'100%',
          height: '100vh',
          padding: 0,
        }}>
          <Box style={{ width: '100%', height: '100%', padding: '2% 3%', backgroundColor: BG_COLOR, paddingBottom: 0 }}>
            <Box style={{
              display: 'flex',
              flexDirection: changeHandler('column', 'row'),
              justifyContent: isXS ? 'end' : 'start',
              width: '100%',
              height: '70%',
            }}>
              <Box style={{ width: changeHandler<string>('100%', '20%'), height: isXS ? '10%' : changeHandler<string>('15%', '100%'), }}>
                <CustomText style={{
                  fontSize: '2.5rem',
                  fontStyle: 'italic',
                  marginBottom: '30%',
                  textAlign: isXS ? 'center' : 'left',
                }}>
                  {data.title}
                </CustomText>
                <Paper style={{
                  ...transitionStyle,
                  display: changeHandler<string>('none', 'block'),
                  width: '100%',
                  height: '60%',
                  borderRadius: '1.5rem',
                  padding:'3% 7%',
                  backgroundColor: GRAY_COLOR_BTN
                }}>
                  <Box style={{ position: 'relative', top: '-15%' }}>
                    <QuotIcon color={PRIMARY_COLOR_HEX_3} height='4rem' />
                  </Box>
                  <CustomText style={{
                      width: '100%',
                      height: '40%',
                      fontSize: paperTextSize,
                      fontStyle: 'italic',
                      color: 'white'
                    }}>
                    {data.comments[indexComment].comment}
                  </CustomText>
                  <Box style={{ background: TEXT_COLOR_GRAY, width: '100%', height: '.1rem' }} />
                  <Box style={{ height: '40%', display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={data.comments[indexComment].img}
                      style={{ transition: 'all .2s ease' }}
                      size={getByBreakPoint<string>('3rem','4rem','5rem','6rem','7rem')}
                      alt="photo ceo"
                    />
                    <Box style={{ paddingLeft: '5%' }}>
                      <CustomText style={{ fontSize: paperTextSize, fontWeight: 600 }}>
                        {data.comments[indexComment].name}
                      </CustomText>
                      <CustomText style={{ fontSize: paperTextSize, color: TEXT_COLOR_GRAY }}>
                        {data.comments[indexComment].company}
                      </CustomText>
                      <Rating color={PRIMARY_COLOR_HEX_3}  defaultValue={data.comments[indexComment].ratings} />
                    </Box>
                  </Box>

                </Paper>
              </Box>             
              <Box style={{
                width: changeHandler('100%','80%'),
                height: isXS ? '35%' : changeHandler<string>('85%', '100%'),
                display: 'flex'
              }}>
                <Box style={{
                  width: marginVideo,
                  height: '100%',
                  display: isXS ? 'none' : 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
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
                  style={{ border: `1px solid ${TEXT_COLOR_GRAY}`, borderRadius: isXS ? 0 : '1rem' }}
                  width={isXS ? '100%' : "90%"}
                  height="100%"
                  src={data.comments[indexComment].url}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <Box style={{
                  width: marginVideo,
                  height: '100%',
                  display: isXS ? 'none' : 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
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
                {isXS
                  ? <Box style={{
                    display:'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}>
                    <Box style={transitionStyle}>
                      <CustomText style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>
                        {data.comments[indexComment].name}
                      </CustomText>
                      <CustomText >
                        {data.comments[indexComment].company}
                      </CustomText>
                    </Box>
                    <Box style={{
                      display:'flex',
                      justifyContent: 'end',
                      gap: '.5rem'
                    }}>
                      <ActionIcon
                        size='xl'
                        variant='light'
                        color='white'
                        onClick={previusFn}
                        style={{ backgroundColor: 'rgba(48,48,48,255)', borderRadius: '100rem' }}
                      >
                        <IconChevronLeft/>
                      </ActionIcon>
                      <ActionIcon
                        size='xl'
                        color='white'
                        onClick={nextFn}
                        style={{ backgroundColor: 'rgba(48,48,48,255)', borderRadius: '100rem' }}
                        variant='light'
                      >
                        <IconChevronRight/>
                      </ActionIcon>
                    </Box>
                  </Box>
                  : <NavBar
                    length={data.comments.length}
                    position={indexComment}
                    style={{ height:'68%', marginRight: '2.5%' }}
                  />
                }
                <Button
                  color={GRAY_COLOR_BTN}
                  size='xl'
                  style={{
                    opacity: 0, // hidden
                    transition:'all .2s ease',
                    width: getByBreakPoint('60%', '40%', '30%', '25%', '20%'),
                    height:'32%',
                    borderRadius: '.7rem'
                  }}
                >
                  {data.googleReviewBtnText}
                </Button>                
              </Box>
              <Box style={{ width: '100%', height: '35%', display: 'flex', justifyContent: 'center', alignItems: isXS ? 'center' : 'end' }}>
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