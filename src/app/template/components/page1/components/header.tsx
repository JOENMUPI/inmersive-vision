'use client';
import { Box, Image } from '@mantine/core';
import logoComppany from '@/../public/page6/LOGO_IMVI.webp';
import { TextSelect } from '@/components/TextSelect';
import { PAGE_TEMPLPATE_1_ID, PAGE_TEMPLPATE_2_ID, PAGE_TEMPLPATE_4_ID, PAGE_TEMPLPATE_5_ID, PAGE_TEMPLPATE_6_ID, PAGE_TEMPLPATE_8_ID } from '@/utils/consts';
import { useEffect, useState } from 'react';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';

interface linksProps {
  label: string;
  idPoint: string;
}

const links: linksProps[] = [
  {
    label: 'Description',
    idPoint: PAGE_TEMPLPATE_2_ID,
  }, {
    label: 'Gallery',
    idPoint: PAGE_TEMPLPATE_4_ID,
  }, {
    label: 'Space',
    idPoint: PAGE_TEMPLPATE_5_ID,
  }, {
    label: 'Experience',
    idPoint: PAGE_TEMPLPATE_6_ID,
  }, {
    label: 'Contact',
    idPoint: PAGE_TEMPLPATE_8_ID,
  },
];

const noShowheaderlist: string[] = []

export function HeaderTemplateMenu() {
  const { getByBreakPoint } = useBreakPointHandler();
  const [activeSection, setActiveSection] = useState<string>(PAGE_TEMPLPATE_1_ID)
  const sections: string[] = [PAGE_TEMPLPATE_2_ID, PAGE_TEMPLPATE_4_ID, PAGE_TEMPLPATE_5_ID, PAGE_TEMPLPATE_6_ID, PAGE_TEMPLPATE_8_ID]
  const [endpoint, setEndpoint] = useState<string>()

  useEffect(() => {
    const checkVisibility = () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (typeof window !== 'undefined' && rect.top >= 0 && rect.top < window.innerHeight) {
            setActiveSection(section);
          }
        }
      })
    }

    setEndpoint(window.location.pathname.split('/')[1])
    window.addEventListener('scroll', checkVisibility)
    
    return () => {
      window.removeEventListener('scroll', checkVisibility)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    console.log(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  if (endpoint && noShowheaderlist.includes(endpoint)) return null
  return (<header style={{
      width: '100%',
      height: '30vh',
      top: -10,
      backgroundColor: '#131313',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: getByBreakPoint<string>('center', 'center', 'start', 'start', 'start'),
      gap: '3rem',
      alignItems: 'center',
      zIndex: 1000,
      position: 'absolute',
      padding:'5vh 11vw 2vh 11vw',
      background: `linear-gradient(180deg, rgba(19, 19, 19, 1), rgba(19, 19, 19, 0))`,
    }}>
      <Image
        alt='Company logo'
        src={logoComppany.src}
        style={{ display: getByBreakPoint<string>('none', 'none', 'block', 'block', 'block'), width: 'auto', height: '5vh' }}
      />
      <Box style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: getByBreakPoint<string>('1rem', '2rem', '3rem', '4rem', '5rem')
      }}>
        {links.map((el, index) => {
          return (
            <TextSelect
              key={index}
              textStyle={{ fontSize: getByBreakPoint<string>('1.1rem','1.1rem', '1.2rem', '1.3rem', '1.4rem') }}
              condition={activeSection === el.idPoint}
              onClick={() => { scrollToElement(el.idPoint) }}
              title={el.label}
            />
          )
        })}
      </Box>
    </header>
  )
}