'use client';
import { useState } from "react";
import { CustomText } from "@/components/customText";
import { DELAY_ANIMATION, PAGE_4_ID, TEXT_COLOR_GRAY_2 } from "@/utils/conts";
import { Box, Container, Transition } from "@mantine/core";
import { PreviewFrame } from "./components/previewFrame";
import { ViewFrame } from "./components/viewFrame";
import cfdPreview from '@/../public/page4/renders/cdf/CDF_BK_OPEN.png';
import cfdImg1 from '@/../public/page4/renders/cdf/WEB_00.png';
import cfdImg2 from '@/../public/page4/renders/cdf/WEB_00B.png';
import cfdImg3 from '@/../public/page4/renders/cdf/WEB_01.png';
import cfdImg4 from '@/../public/page4/renders/cdf/WEB_02.png';
import cfdImg5 from '@/../public/page4/renders/cdf/WEB_03.png';
import clarkePreview from '@/../public/page4/renders/clarke/Clarke_BK_OPEN.png';
import clarkeImg1 from '@/../public/page4/renders/clarke/AERIAL_PRO.png';
import clarkeImg2 from '@/../public/page4/renders/clarke/CHAIR_2_PRO.png';
import clarkeImg3 from '@/../public/page4/renders/clarke/LAMP_PRO.png';
import clarkeImg4 from '@/../public/page4/renders/clarke/MESITA_1_PRO.png';
import clarkeImg5 from '@/../public/page4/renders/clarke/Portada.png';
import clarkeImg6 from '@/../public/page4/renders/clarke/bar.png';
import renacerPreview from '@/../public/page4/renders/renacer/Renacer_BK_OPEN.png';
import renacerImg1 from '@/../public/page4/renders/renacer/4.png';
import renacerImg2 from '@/../public/page4/renders/renacer/6.png';
import renacerImg3 from '@/../public/page4/renders/renacer/7.png';
import renacerImg4 from '@/../public/page4/renders/renacer/Calidad_de_render_GOFT_3.jpg';
import renacerImg5 from '@/../public/page4/renders/renacer/SALA_MODIFICADA_RENANCER_PDF.png';
import avalonPreview from '@/../public/page4/renders/avalon/Avalon_Park_Wesley_Chapel_BK_OPEN.png';
import avalonImg1 from '@/../public/page4/renders/avalon/02_Modified.jpg';
import avalonImg2 from '@/../public/page4/renders/avalon/04_Standar_view.jpg';
import avalonImg3 from '@/../public/page4/renders/avalon/07.jpg';
import avalonImg4 from '@/../public/page4/renders/avalon/09_Standar_view_2_modified.jpg';
import avalonImg5 from '@/../public/page4/renders/avalon/11_Standar_view.jpg';
import avalonImg6 from '@/../public/page4/renders/avalon/14_Standar_view_modified.jpg';
import etherealPreview from '@/../public/page4/blueprints/OPEN_Ethereal_Series_BACKGROUND_PJ.png';
import groundedPreview from '@/../public/page4/blueprints/OPEN_Grounded_Edition_BACKGROUND_PJ.png';
import luminousPreview from '@/../public/page4/blueprints/OPEN_Luminous_Edition_BACKGROUND_PJ.png';
import TimelessPreview from '@/../public/page4/blueprints/OPEN_Timeless_Line_BACKGROUND_PJ.png';
import apgChapelPreview from '@/../public/page4/virtual_tour/SCROLL_APG_CHAPEL_BACKGROUND_PJ.png';
import ernaPreview from '@/../public/page4/virtual_tour/SCROLL_ERNA_BACKGROUND_PJ.png';
import rosaPreview from '@/../public/page4/virtual_tour/SCROLL_LA_ROSA_BACKGROUND_PJ.png';
import renacerTourPreview from '@/../public/page4/virtual_tour/SCROLL_RENACER_BACKGROUND_PJ.png';
import '@/app/page4/styles/page.css'
import { TextSelect } from "@/components/TextSelect";
import { useBreakPointHandler } from "@/hooks/breakpointHandler";

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

const data: dataI = {
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
          imgPreview: cfdPreview.src,
          title: 'Combat diver Fundation',
          useImgs: true,
          imgs: [cfdImg1.src, cfdImg2.src, cfdImg3.src, cfdImg4.src, cfdImg5.src]
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
        {
          useImgs: false,
          imgPreview: rosaPreview.src,
          title: 'La Rosa',
          subtitle: 'Immersive Pro',
          url: 'https://cloud.3dvista.com//hosting/7379150/34/index.htm',
        }
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
        {
          useImgs: false,
          imgPreview: TimelessPreview.src,
          title: 'Timeless Line',
        }
      ]
    }
  ]
}

export default function Page4() {
  const { getByBreakPoint } = useBreakPointHandler()
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [changePreviewFlag, setChangePreviewFlag] = useState<boolean>(true)
  const [previewMode, setPreviewMode] = useState<boolean>(true)
  const [indexService, setIndexService] = useState<number>(0)
  const [indexProject, setIndexProject] = useState<number>(0)

  const previewFlagHandler = () => {
    setChangePreviewFlag(prev => !prev)
    setTimeout(() => {
      setChangePreviewFlag(prev => !prev)
    }, DELAY_ANIMATION)
  }

  const changeServiceHandler = (index: number) => {
    if (index === indexService && previewMode) return
    setIsVisible(prev => !prev)
    if (!previewMode) previewFlagHandler()
    setTimeout(() => {
      setPreviewMode(true)
      setIndexService(index)
      setIndexProject(0)
      setIsVisible(prev => !prev)
    }, DELAY_ANIMATION)
  }

  const changeProjectHandler = (index: number) => {
    if (index === indexProject && !previewMode) return
    setIsVisible(prev => !prev)
    if (previewMode) previewFlagHandler()
    setTimeout(() => {
      setPreviewMode(false)
      setIndexProject(index)
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
          background: 'linear-gradient(180deg, #131313 0% 70%, #0a0a0a 70% 100%)',
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
              <Box style={{ ...transitionStyle, width: '100%', height: '85%', display: 'flex' }}>
                { previewMode
                  ? <PreviewFrame
                    changeProjectHandler={changeProjectHandler}
                    indexService={indexService}
                    data={data}
                  />
                  : <ViewFrame
                    backAction={restartPreviewMode}
                    project={data.services[indexService].projects[indexProject]}
                  />
                }
              </Box>
              <Transition
                mounted={changePreviewFlag}
                transition='fade'
                duration={DELAY_ANIMATION}
                timingFunction='ease'
              >
                {(transitionStyleByPreviewMode) => (
                  <Box style={{
                    ...transitionStyleByPreviewMode,
                    width: previewMode
                      ? getByBreakPoint<string>('95%', '85%', '75%', '65%', '55%')
                      : getByBreakPoint<string>('100%', '100%', '95%', '85%', '75%'),
                    height: '15%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    {(previewMode ? data.services : data.services[indexService].projects).map((item, index) => (
                      <TextSelect
                        textStyle={{
                          fontSize: getByBreakPoint<string>('.9rem', '1rem', '1.1rem', '1.2rem', '1.5rem'),
                          transition:'all .2s ease'
                        }}
                        key={index}
                        condition={(previewMode ? indexService : indexProject)  === index}
                        onClick={() => previewMode ? changeServiceHandler(index) : changeProjectHandler(index)}
                        title={item.title}
                      />
                    ))}
                  </Box>
                )}
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
                {data.title}
              </CustomText>
              <CustomText style={{
                  fontSize: '1.5rem',
                  height: '20%',
                  marginTop: '40%',
                  opacity: data.services[indexService].projects[indexProject].subtitle && !previewMode ? 1 : 0
                }}>
                {data.services[indexService].projects[indexProject].subtitle}
              </CustomText>
            </Box>
          </Box>
        </Container>
      )}
    </Transition>
  )
}