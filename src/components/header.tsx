'use client';
import { Box, Image } from '@mantine/core';
import { ScrollDirection, useScrollTracker } from '@/hooks/scrollTracker';
import logoComppany from '@/../public/page6/LOGO_IMVI.webp';
import { TextSelect } from '@/components/TextSelect';
import { PAGE_1_ID, PAGE_3_ID, PAGE_4_ID, PAGE_5_ID } from '@/utils/consts';
import { useEffect, useState } from 'react';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';

interface linksProps {
  label: string;
  idPoint: string;
}

const links: linksProps[] = [
  {
    label: 'Home',
    idPoint: PAGE_1_ID,
  }, {
    label: 'Services',
    idPoint: PAGE_3_ID,
  }, {
    label: 'Projects',
    idPoint: PAGE_4_ID,
  }, {
    label: 'About Us',
    idPoint: PAGE_5_ID,
  },
];

const noShowheaderlist = [
  'tours-contact',
  'app',
  'template'
]

export function HeaderMenu() {
  const { scrollDirection } = useScrollTracker();
  const { getByBreakPoint } = useBreakPointHandler();
  const [activeSection, setActiveSection] = useState<string>(PAGE_1_ID)
  const sections: string[] = [PAGE_1_ID, PAGE_3_ID, PAGE_4_ID, PAGE_5_ID]
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
      opacity: scrollDirection === ScrollDirection.DOWN ? 0 : 1,
      transition: 'all .2s ease',
      width: '100%',
      height: '15vh',
      zIndex: 1000,
      top: -10,
      backgroundColor: '#131313',
      display: 'flex',
      justifyContent: getByBreakPoint<string>('center', 'center', 'space-between', 'space-between', 'space-between'),
      alignItems: 'center',
      position: 'fixed',
      padding:'0 7vw 0 11vw',
      background: `linear-gradient(180deg, rgba(19, 19, 19, 0.8), rgba(19, 19, 19, 0))`,
    }}>
      <Image
        alt='Company logo'
        fit='contain'
        src={logoComppany.src}
        style={{ objectPosition: 'left center', display: getByBreakPoint<string>('none', 'none', 'block', 'block', 'block'), height:'20%' }}
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