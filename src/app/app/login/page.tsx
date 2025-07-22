'use client';
import bgImg from '@/../public/page6/Background_contact_form.webp';
import logoImg from '@/../public/page6/LOGO_IMVI.webp';
import { CustomPassInput, CustomTextInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { useFetch } from '@/hooks/useFetch';
import { loginI } from '@/server/modules/user/domain/interfaces';
import { LOGIN_URL_SERVER, PAGE_6_ID, TEXT_COLOR_GRAY_2 } from '@/utils/consts';
import { fetchMethod } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { checkEmail, checkPass } from '@/utils/validations';
import { BackgroundImage, Box, Button, Container, Image, Space } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
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

const INIT_FORM_VALUES: loginI = {
  email: '',
  pass: '',
}

export default function LoginPage() {
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  const { sendF } = useFetch()
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_FORM_VALUES,
    validate: {
      pass: (val) => (val ? checkPass(val) ? null: 'Invalid pass' : null),
      email: (val) => (checkEmail(val) ? null : 'Invalid email'),
    },
  });

  const passInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const sendForm = async () => {
    if (form.validate().hasErrors) return
    notifyShowBase({
      id: 'test',
      title: 'Sending login',
      message: 'Wait a momment..',
      loading: true
    })
    const responseServer = await sendF({ endpoint: LOGIN_URL_SERVER, body: form.values, method: fetchMethod.POST })
    
    if (!responseServer.hasError) {
      router.push('/app');
      form.reset()
    }
    notifyUpdateBase({
      id: 'test',
      title: responseServer.hasError ? 'Error' : 'login sent',
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
            <Box style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              flexDirection: 'column',
            }}>
              <Box style={{ display: 'flex', width: '100%', justifyContent: 'center', height:'20%', gap: '.8rem' }}>
                <Image
                  src={logoImg.src}
                  fit='contain'
                  style={{ width: '20vw', height: isXS ? '40%' : '60%'  }}
                  alt='logo img inmersive vision'
                />
              </Box>
                <CustomText style={{ fontSize: isXS ? '2rem' : '1.5rem' }}>
                  Welcome back!
                </CustomText>
              <Space h="xl" />
              <Box style={{
                display: 'flex',
                gap: '10%',
                transition: 'all .2s ease',
                flexDirection: 'column',
                height: '50%',
                width: getByBreakPoint<string>('60%', '50%', '40%', '30%', '20%')
              }}>
                <CustomTextInput
                  value={form.getValues().email}
                  onEnter={passInputRef?.current?.focus}
                  onChange={(data => form.setFieldValue('email', data))}
                  label='User'
                  errorText={form.errors?.email ? String(form.errors?.email) : undefined}
                  isError={!!form.errors?.email}
                />
                <CustomPassInput
                  label='Pass'
                  ref={passInputRef}
                  onEnter={sendForm}
                  value={form.getValues().pass}
                  onChange={(data => form.setFieldValue('pass', data.toString()))}
                  errorText={form.errors?.pass ? String(form.errors?.pass) : undefined}
                  isError={!!form.errors?.pass}
                />
                <Button color={TEXT_COLOR_GRAY_2} onClick={sendForm}>
                  Log In
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}