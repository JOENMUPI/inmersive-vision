'use client'
import { Box, Container, Image } from '@mantine/core';
import { PAGE_TEMPLPATE_10_ID, PRIMARY_COLOR_RGB } from '@/utils/consts';
import logoComppany from '@/../public/page6/LOGO_IMVI.webp';


export default function Page10() {
  return (
    <Container id={PAGE_TEMPLPATE_10_ID} style={{
      minWidth:'100%',
      height: '70vh',
      padding: 0,
      }}>
      <Box style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: '#0a0a0a',
        justifyContent: 'center',
        background: `linear-gradient(0deg, ${PRIMARY_COLOR_RGB(.3)}, rgba(19, 19, 19, 0) 80%)`,
        padding: '15vh 0 0 0',
      }}>
        <Image
          fit="contain"
          alt='kuku'
          h='auto'
          w='20vw'
          src={logoComppany.src}
        />  
      </Box>
    </Container>
  );
};