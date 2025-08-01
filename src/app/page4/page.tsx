'use client';
import { useEffect, useState } from "react";
import { CustomText } from "@/components/customText";
import { BG_COLOR, DELAY_ANIMATION, PAGE_4_ID, TEXT_COLOR_GRAY_2 } from "@/utils/consts";
import { ActionIcon, Box, Button, Container, Transition } from "@mantine/core";
import { PreviewFrame } from "./components/previewFrame";
import { ViewFrame } from "./components/viewFrame";
import cfdPreview from '@/../public/page4/renders/cdf/CDF_BK_OPEN.webp';
import cfdImg1 from '@/../public/page4/renders/cdf/WEB_00.webp';
import cfdImg2 from '@/../public/page4/renders/cdf/WEB_00B.webp';
import cfdImg3 from '@/../public/page4/renders/cdf/WEB_01.webp';
import cfdImg4 from '@/../public/page4/renders/cdf/WEB_02.webp';
import cfdImg5 from '@/../public/page4/renders/cdf/WEB_03.webp';
import clarkePreview from '@/../public/page4/renders/clarke/Clarke_BK_OPEN.webp';
import clarkeImg1 from '@/../public/page4/renders/clarke/AERIAL_PRO.webp';
import clarkeImg2 from '@/../public/page4/renders/clarke/CHAIR_2_PRO.webp';
import clarkeImg3 from '@/../public/page4/renders/clarke/LAMP_PRO.webp';
import clarkeImg4 from '@/../public/page4/renders/clarke/MESITA_1_PRO.webp';
import clarkeImg5 from '@/../public/page4/renders/clarke/Portada.webp';
import clarkeImg6 from '@/../public/page4/renders/clarke/bar.webp';
import renacerPreview from '@/../public/page4/renders/renacer/Renacer_BK_OPEN.webp';
import renacerImg1 from '@/../public/page4/renders/renacer/4.webp';
import renacerImg2 from '@/../public/page4/renders/renacer/6.webp';
import renacerImg3 from '@/../public/page4/renders/renacer/7.webp';
import renacerImg4 from '@/../public/page4/renders/renacer/Calidad_de_render_GOFT_3.webp';
import renacerImg5 from '@/../public/page4/renders/renacer/SALA_MODIFICADA_RENANCER_PDF.webp';
import avalonPreview from '@/../public/page4/renders/avalon/Avalon_Park_Wesley_Chapel_BK_OPEN.webp';
import avalonImg1 from '@/../public/page4/renders/avalon/02_Modified.webp';
import avalonImg2 from '@/../public/page4/renders/avalon/04_Standar_view.webp';
import avalonImg3 from '@/../public/page4/renders/avalon/07.webp';
import avalonImg4 from '@/../public/page4/renders/avalon/09_Standar_view_2_modified.webp';
import avalonImg5 from '@/../public/page4/renders/avalon/11_Standar_view.webp';
import avalonImg6 from '@/../public/page4/renders/avalon/14_Standar_view_modified.webp';
import etherealPreview from '@/../public/page4/blueprints/OPEN_Ethereal_Series_BACKGROUND_PJ.webp';
import groundedPreview from '@/../public/page4/blueprints/OPEN_Grounded_Edition_BACKGROUND_PJ.webp';
import luminousPreview from '@/../public/page4/blueprints/OPEN_Luminous_Edition_BACKGROUND_PJ.webp';
import TimelessPreview from '@/../public/page4/blueprints/OPEN_Timeless_Line_BACKGROUND_PJ.webp';
import apgChapelPreview from '@/../public/page4/virtual_tour/SCROLL_APG_CHAPEL_BACKGROUND_PJ.webp';
import ernaPreview from '@/../public/page4/virtual_tour/SCROLL_ERNA_BACKGROUND_PJ.webp';
import rosaPreview from '@/../public/page4/virtual_tour/SCROLL_LA_ROSA_BACKGROUND_PJ.webp';
import renacerTourPreview from '@/../public/page4/virtual_tour/SCROLL_RENACER_BACKGROUND_PJ.webp';
import { TextSelect } from "@/components/TextSelect";
import { useBreakPointHandler } from "@/hooks/breakpointHandler";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useIndexList } from "@/hooks/indexList";

enum directionActionList {
  NEXT,
  PREV
}

interface servicesI {
  title: string,
  projects: projectI[]
} 

export interface projectI {
  imgPreview: string,
  title: string,
  subtitle?: string,
  url?: string,
  imgs?: string[],
  useImgs: boolean
}

export interface dataI {
  title: string,
  services: servicesI[]
}

const data_base: dataI = {
  title: 'Projects',
  services: [
    {
      title: 'Vision Rendering',
      projects: [
        {
          imgPreview: avalonPreview.src,
          title: 'Avalon Park Wesley Chapel',
          useImgs: true,
          imgs: [avalonImg1.src, avalonImg2.src, avalonImg3.src, avalonImg4.src, avalonImg5.src, avalonImg6.src]
        },
        {
          imgPreview: renacerPreview.src,
          title: 'Renacer',
          useImgs: true,
          imgs: [renacerImg1.src, renacerImg2.src, renacerImg3.src, renacerImg4.src, renacerImg5.src]
        },
        {
          imgPreview: clarkePreview.src,
          title: 'Clarke',
          useImgs: true,
          imgs: [clarkeImg1.src, clarkeImg2.src, clarkeImg3.src, clarkeImg4.src, clarkeImg5.src, clarkeImg6.src]
        }
      ]
    },
    {
      title: 'Immersive Tour',
      projects: [
        {
          useImgs: false,
          imgPreview: apgChapelPreview.src,
          title: 'Avalon Park Wesley Chapel',
          subtitle: 'Immersive Master piece',
          url: 'https://cloud.3dvista.com//hosting/7379150/14/index.htm',
        },
        {
          useImgs: false,
          imgPreview: renacerTourPreview.src,
          title: 'Renacer',
          subtitle: 'Immersive Pro',
          url: 'https://cloud.3dvista.com//hosting/7379150/31/index.htm',
        },
        {
          useImgs: false,
          imgPreview: ernaPreview.src,
          title: 'Erna',
          subtitle: 'Immersive Pro',
          url: 'https://cloud.3dvista.com//hosting/7379150/67/index.htm',
        },
      ]
    },
    {
      title: 'Apex BluePrint',
      projects: [
        {
          useImgs: false,
          imgPreview: etherealPreview.src,
          title: 'Grounded Edition',
        },
        {
          useImgs: false,
          imgPreview: groundedPreview.src,
          title: 'Ethereal Series',
        },
        {
          useImgs: false,
          imgPreview: luminousPreview.src,
          title: 'Luminous Edition',
        },
      ]
    }
  ]
}

const data_extended: dataI = JSON.parse(JSON.stringify(data_base))
data_extended.services[0].projects.push({
  imgPreview: cfdPreview.src,
  title: 'Combat diver Fundation',
  useImgs: true,
  imgs: [cfdImg1.src, cfdImg2.src, cfdImg3.src, cfdImg4.src, cfdImg5.src]
})
data_extended.services[1].projects.push({
  useImgs: false,
  imgPreview: rosaPreview.src,
  title: 'La Rosa',
  subtitle: 'Immersive Pro',
  url: 'https://cloud.3dvista.com//hosting/7379150/34/index.htm',
})
data_extended.services[2].projects.push({
    useImgs: false,
    imgPreview: TimelessPreview.src,
    title: 'Timeless Line',
})

export default function Page4() {
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [changePreviewFlag, setChangePreviewFlag] = useState<boolean>(true)
  const [previewMode, setPreviewMode] = useState<boolean>(true)
  const [data, setData] = useState<dataI>(data_base)
  const {
    nextIndex: serviceNextIndex,
    prevIndex: servicePrevIndex,
    dataIndex: serviceDataIndex,
    setDataIndex:  setServiceDataIndex
  } = useIndexList({ length: data.services.length, initIndex: 0 })
  const {
    nextIndex: projectNextIndex,
    prevIndex: projectPrevIndex,
    dataIndex: projectDataIndex,
    setDataIndex: setProjectDataIndex
  } = useIndexList({ length: data.services[serviceDataIndex].projects.length, initIndex: 0 })
  
  useEffect(() => {
    if (isXS) setData({ ...data_base })
    else setData({ ...data_extended })
  }, [isXS])

  const previewFlagHandler = () => {
    setChangePreviewFlag(prev => !prev)
    setTimeout(() => {
      setChangePreviewFlag(prev => !prev)
    }, DELAY_ANIMATION)
  }  

  const serviceHandler = (dir: directionActionList) => {
    setIsVisible(prev => !prev)
    if (!previewMode) previewFlagHandler()
    setTimeout(() => {
      setPreviewMode(true)
      if (dir === directionActionList.NEXT) serviceNextIndex()
      else servicePrevIndex()
      setProjectDataIndex(0)
      setIsVisible(prev => !prev)
    }, DELAY_ANIMATION)
  }

  const projectHandler = (dir: directionActionList) => {
    setIsVisible(prev => !prev)
    if (!previewMode) previewFlagHandler()
    setTimeout(() => {
      setPreviewMode(false)
      if (dir === directionActionList.NEXT) projectNextIndex()
      else projectPrevIndex()
      setIsVisible(prev => !prev)
    }, DELAY_ANIMATION)
  }

  const changeServiceHandler = (index: number) => {
    if (index === serviceDataIndex && previewMode) return
    setIsVisible(prev => !prev)
    if (!previewMode) previewFlagHandler()
    setTimeout(() => {
      setPreviewMode(true)
      setServiceDataIndex(index)
      setProjectDataIndex(0)
      setIsVisible(prev => !prev)
    }, DELAY_ANIMATION)
  }

  const changeProjectHandler = (index: number) => {
    if (index === projectDataIndex && !previewMode) return
    setIsVisible(prev => !prev)
    if (previewMode) previewFlagHandler()
    setTimeout(() => {
      setPreviewMode(false)
      setProjectDataIndex(index)
      setIsVisible(prev => !prev)
    }, DELAY_ANIMATION)
  }

  const restartPreviewMode = () => {
    if (previewMode) return
    setIsVisible(prev => !prev)
    if (!previewMode) previewFlagHandler()
    setTimeout(() => {
      setPreviewMode(true)
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
        <Container id={PAGE_4_ID} style={{
          minWidth:'100%',
          height: '100vh',
          background: `linear-gradient(180deg, #131313 0% 70%, ${BG_COLOR} 70% 100%)`,
          padding: 0,
        }}>
          <Box style={{ width: '100%', height: '100%', display: 'flex', padding: '6% 5% 1% 6%' }}>
            <Box style={{
              width: getByBreakPoint<string>('100%', '100%', '100%', '85%', '85%'),
              height: '100%',
              transition: 'all .2s ease',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box style={{ ...transitionStyle, width: '100%', height: isXS ? '75%' : '85%', display: 'flex' }}>
                { previewMode
                  ? <PreviewFrame
                    changeProjectHandler={changeProjectHandler}
                    indexService={serviceDataIndex}
                    data={data}
                  />
                  : <ViewFrame
                    backAction={restartPreviewMode}
                    project={data.services[serviceDataIndex].projects[projectDataIndex]}
                  />
                }
              </Box>
              <Transition
                  mounted={changePreviewFlag}
                  transition='fade'
                  duration={DELAY_ANIMATION}
                  timingFunction='ease'
                >
                  {(transitionStyleByPreviewMode) => {
                    if (isXS) return <Box style={{ height: '20%', width: '100%' }}>
                      <Box style={{ width: '100%', height: '25%', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <ActionIcon
                          size='xl'
                          variant='transparent'
                          color="white"
                          onClick={() => previewMode ? serviceHandler(directionActionList.PREV) : projectHandler(directionActionList.PREV)}
                        >
                          <IconChevronLeft />
                        </ActionIcon>
                        <CustomText style={{ ...transitionStyleByPreviewMode, fontWeight: 600, fontSize:'1.2rem', color: 'white' }}>
                          {previewMode
                            ? data.services[serviceDataIndex].title
                            : data.services[serviceDataIndex].projects[projectDataIndex].title
                          }
                        </CustomText>
                        <ActionIcon
                          size='xl'
                          variant='transparent'
                          color="white"
                          onClick={() => previewMode ? serviceHandler(directionActionList.NEXT) : projectHandler(directionActionList.NEXT)}
                        >
                          <IconChevronRight />
                        </ActionIcon>
                      </Box>
                      <Box style={{
                        width: '100%',
                        transition:'all .2s ease',
                        opacity: previewMode ? 0 : 1,
                        paddingTop: '2%',
                        height: '75%',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '.1rem'
                      }}>
                        <Button
                          onClick={restartPreviewMode}
                          leftSection={<IconChevronLeft/>}
                          variant="transparent"
                          color="white"
                          style={{ display:'flex', alignItems:'center' }}
                        >
                          <CustomText style={{ color:'white' }}>
                            Go Back
                          </CustomText>
                        </Button>
                      </Box>
                    </Box>
                    else return <Box style={{
                      ...transitionStyleByPreviewMode,
                      width: previewMode
                        ? getByBreakPoint<string>('95%', '85%', '75%', '65%', '55%')
                        : getByBreakPoint<string>('100%', '100%', '95%', '85%', '75%'),
                      height: '15%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      {(previewMode ? data.services : data.services[serviceDataIndex].projects).map((item, index) => (
                        <TextSelect
                          textStyle={{
                            fontSize: getByBreakPoint<string>('.9rem', '1rem', '1.1rem', '1.2rem', '1.5rem'),
                            transition:'all .2s ease'
                          }}
                          key={index}
                          condition={(previewMode ? serviceDataIndex : projectDataIndex)  === index}
                          onClick={() => previewMode ? changeServiceHandler(index) : changeProjectHandler(index)}
                          title={item.title}
                        />
                      ))}
                    </Box>
                  }}
              </Transition>
            </Box>
            <Box style={{
              width: '15%',
              height: '100%',
              display: getByBreakPoint<string>('none', 'none', 'none', 'flex', 'flex'),
              paddingLeft: '3%',
              flexDirection:'column',
              alignItems: 'center',
            }}>
              <CustomText style={{
                color: TEXT_COLOR_GRAY_2,
                fontSize: '4rem',
                height: '60%',
                writingMode: 'vertical-lr',
                transform:'rotate(180deg)'
              }}>
                {data_base.title}
              </CustomText>
              <CustomText style={{
                fontSize: '1.5rem',
                height: '20%',
                marginTop: '40%',
                opacity: data.services[serviceDataIndex].projects[projectDataIndex].subtitle && !previewMode ? 1 : 0
              }}>
                {data.services[serviceDataIndex].projects[projectDataIndex].subtitle}
              </CustomText>
            </Box>
          </Box>
        </Container>
      )}
    </Transition>
  )
}