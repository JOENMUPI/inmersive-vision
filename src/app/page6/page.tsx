'use client';
import bgImg from '@/../public/page6/Background_contact_form.png';
import logoImg from '@/../public/page6/LOGO_IMVI.png';
import { CustomFileInput, CustomNumberInput, CustomTextInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { LineBottom } from '@/components/lineBotton';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { PAGE_6_ID, TEXT_COLOR_GRAY, TEXT_COLOR_GRAY_2 } from '@/utils/conts';
import { BackgroundImage, Box, Button, Container, Image } from '@mantine/core';
import { useForm } from '@mantine/form';

interface data {
  highlight: string,
  title: string,
  subTitle?: string,
  call: string,
  companyName: string,
}

const data: data = {
  highlight: 'Exclusivity',
  title: 'begins here.',
  subTitle: 'Join the vision',
  call: 'Making a diference is our mission this is',
  companyName: 'Inmersive Vision',
} 

interface formI {
  name: string,
  email: string,
  description: string,
  phone: string,
}

const INIT_FORM_VALUES: formI = {
  name: '',
  email: '',
  description: '',
  phone: '',
}

export default function Page6() {
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_FORM_VALUES,
    validate: {
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const titleSize = getByBreakPoint('1.5rem', '2rem', '2.5rem', '3rem', '3rem')

  return (
    <Container id={PAGE_6_ID} style={{
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
          borderTop: '3px solid #353535',
        }}>
          <BackgroundImage
            src={bgImg.src}
            style={{ height: '100%', zIndex: -1 }}  
          />
          <Box style={{
            height: '100%',
            position: 'relative',
            top: '-100%', 
            paddingTop: '3%',
            paddingRight: '8%',
            paddingLeft:  '8%',
            paddingBottom: '2%',
          }}>
            <Box style={{ display: 'flex', width: '100%', height:'20%', gap: '.8rem' }}>
              <LineBottom>
                <CustomText style={{ color: 'white', fontSize: titleSize, fontStyle: 'italic' }}>
                  {data.highlight}
                </CustomText>
              </LineBottom>
              <CustomText style={{ color: TEXT_COLOR_GRAY, fontSize: titleSize, fontStyle: 'italic'}}>
                {data.title}
              </CustomText>
            </Box>
            <CustomText style={{
              color: 'white',
              fontWeight: 600,
              height: '25%',
              fontSize: getByBreakPoint<string>('1.2rem', '1.3rem', '1.4rem', '1.6rem', '1.6rem'),
              fontStyle: 'italic'
            }}>
              {data.subTitle}
            </CustomText>
            <Box style={{
              display: 'flex',
              gap: '10%',
              transition: 'all .2s ease',
              flexDirection: 'column',
              height: '50%',
              width: getByBreakPoint<string>('60%', '50%', '40%', '30%', '20%')
            }}>
              <CustomTextInput value={form.getValues().name} onChange={(data => form.setFieldValue('name', data))} label='Name' />
              <CustomTextInput value={form.getValues().email} onChange={(data => form.setFieldValue('email', data))} label='Email' />
              <CustomTextInput value={form.getValues().phone} onChange={(data => form.setFieldValue('phone', data.toString()))} label='Phone' />
              <Button color={TEXT_COLOR_GRAY_2}>
                Send
              </Button>
            </Box>
          </Box>
        </Box>
        <Box style={{
          paddingRight: '8%',
          paddingLeft:  '8%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height:'12.5%'
        }}>
            <Image
              src={logoImg.src}
              style={{ width: '20%', height: '20%', display: isXS ? 'none' : 'block' }}
              alt='logo img inmersive vision'
            />
          <Box style={{
            width: isXS ? '100%' : '80%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent:'center',
            flexDirection: 'column'
          }} >
            <CustomText style={{ color: TEXT_COLOR_GRAY, fontSize: getByBreakPoint<string>('.8rem', '.9rem', '1.1rem', '1.3rem', '1.6rem') }}>
              {data.call}
            </CustomText>
            <CustomText style={{ color: 'white', fontSize: getByBreakPoint<string>('.8rem', '.9rem', '1rem', '1.1rem', '1.3rem') }}>
              {data.companyName}
            </CustomText>
          </Box>
          <Box />
        </Box>
      </Box>
    </Container>
  )
}