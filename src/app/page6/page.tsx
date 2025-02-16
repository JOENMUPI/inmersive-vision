'use client';
import bgImg from '@/../public/page6/Background_contact_form.png';
import { BackgroundImage, Box, Container } from '@mantine/core';

// interface data {

// }

// const data: data[] = [
//   {

//   },
// ]

export default function Page6() {
  return (
    <Container style={{
      minWidth:'100%',
      height: '100vh',
      padding: 0,
    }}>
      <Box style={{
        height: '100vh',
        backgroundColor: '#0a0a0a'
      }}>
        <Box style={{ height:'12.5%'}} />
        <Box style={{
          width: '100%',
          height: '75%',
        }}>
          <BackgroundImage
            src={bgImg.src}
            style={{ height: '100%', zIndex: -1 }}  
          />
          <Box style={{ backgroundColor: 'red' }}>
           {""}
          </Box>
        </Box>
        <Box style={{ height:'12.5%'}}>
        </Box>
      </Box>
    </Container>
  )
}