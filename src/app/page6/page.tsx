'use client';
import bgImg from '@/../public/page6/Background_contact_form.webp';
import logoImg from '@/../public/page6/LOGO_IMVI.webp';
import { CustomPhoneInput, CustomTextInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { LineBottom } from '@/components/lineBotton';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { useFetch } from '@/hooks/useFetch';
import { FORM_URL_SERVER, PAGE_6_ID, TEXT_COLOR_GRAY, TEXT_COLOR_GRAY_2 } from '@/utils/consts';
import { fetchMethod } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { checkEmail, checkPhone } from '@/utils/validations';
import { BackgroundImage, Box, Button, Container, Image } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRef } from 'react';

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
  companyName: 'Immersive Vision',
} 

interface formI {
  name: string,
  email: string,
  phone: string,
}

const INIT_FORM_VALUES: formI = {
  name: '',
  email: '',
  phone: '',
}

export default function Page6() {
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  const { sendF } = useFetch()
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_FORM_VALUES,
    validate: {
      name: (val) => (val ? null : 'Name is empty'),
      phone: (val) => (val ? checkPhone(val) ? null: 'Invalid phone' : null),
      email: (val) => (checkEmail(val) ? null : 'Invalid email'),
    },
  });

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const titleSize = getByBreakPoint('1.5rem', '2rem', '2.5rem', '3rem', '3rem')
  const sendForm = async () => {
    if (form.validate().hasErrors) return
    notifyShowBase({
      id: 'test',
      title: 'Sending form',
      message: 'Wait a momment..',
      loading: true
    })
    const responseServer = await sendF({ endpoint: FORM_URL_SERVER, body: form.values, method: fetchMethod.POST })
    
    if (!responseServer.hasError) form.reset()
    notifyUpdateBase({
      id: 'test',
      title: responseServer.hasError ? 'Error' : 'Form sent',
      message: responseServer.message,
      loading: false
    })
  }

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
              <CustomTextInput
                value={form.getValues().name}
                onChange={(data => form.setFieldValue('name', data))}
                onEnter={emailInputRef?.current?.focus}
                label='Name'
                errorText={form.errors?.name ? String(form.errors?.name) : undefined}
                isError={!!form.errors?.name}
              />
              <CustomTextInput
                value={form.getValues().email}
                ref={emailInputRef}
                onEnter={phoneInputRef?.current?.focus}
                onChange={(data => form.setFieldValue('email', data))}
                label='Email'
                errorText={form.errors?.email ? String(form.errors?.email) : undefined}
                isError={!!form.errors?.email}
              />
              <CustomPhoneInput
                label='Phone'
                ref={phoneInputRef}
                onEnter={sendForm}
                value={form.getValues().phone}
                onChange={(data => form.setFieldValue('phone', data.toString()))}
                errorText={form.errors?.phone ? String(form.errors?.phone) : undefined}
                isError={!!form.errors?.phone}
              />
              <Button color={TEXT_COLOR_GRAY_2} onClick={sendForm}>
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