'use client';
import bgImg from '@/../public/tours-contact/Background_contact_form.webp';
import { CustomInputTextArea, CustomPhoneInput, CustomTextInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { useFetch } from '@/hooks/useFetch';
import { TEXT_COLOR_GRAY_2 } from '@/utils/conts';
import { fetchMethod } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { checkEmail, checkPhone } from '@/utils/validations';
import { BackgroundImage, Box, Button, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

interface formI {
  name: string,
  email: string,
  phone: string,
  description: string,
  category: string,
  company: string,
  model: string,
}

const INIT_FORM_VALUES: formI = {
  name: '',
  email: '',
  phone: '',
  description: '',
  category: '',
  company: '',
  model: '',
}

export default function ToursContact() {
  const { getByBreakPoint } = useBreakPointHandler()
  const { sendF } = useFetch()
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_FORM_VALUES,
    validate: {
      phone: (val) => (val ? checkPhone(val) ? null: 'Invalid phone' : null),
      email: (val) => (checkEmail(val) ? null : 'Invalid email'),
      description: (val) => (val ? null : 'Description is empty'),
      category: (val) => (val ? null : 'Category is empty check your url'),
      company: (val) => (val ? null : 'Company is empty check your url'),
      model: (val) => (val ? null : 'Model is empty check your url'),
    },
  });

  useEffect(() => {
    if (form.getValues().model !== '') return
    form.setFieldValue('company', window.location.pathname.split('/')[2])
    form.setFieldValue('model', window.location.pathname.split('/')[3])
    form.setFieldValue('category', window.location.pathname.split('/')[4])
  }, [form])

  const sendForm = async () => {
    if (form.validate().hasErrors) return
    notifyShowBase({
      id: 'test',
      title: 'Sending form',
      message: 'Wait a momment..',
      loading: true
    })
    const responseServer = await sendF({ endpoint: 'tours-contact', body: form.values, method: fetchMethod.POST })
    notifyUpdateBase({
      id: 'test',
      title: responseServer.status !== 200 ? 'Error' : 'Form sent',
      message: responseServer ? responseServer.body.message : 'Oh no! try later..',
      loading: false
    })
  }

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
            <Box style={{ display: 'flex', width: '100%', height:'20%' }}>
              <CustomText style={{
                color: 'white',
                fontSize: getByBreakPoint('2rem', '2rem', '2.5rem', '3rem', '3rem'), 
                fontStyle: 'italic'
              }}>
                Contact us
              </CustomText>
            </Box>
            <Box style={{
              display: 'flex',
              gap: '10%',
              transition: 'all .2s ease',
              flexDirection: 'column',
              height: '75%',
              width: getByBreakPoint<string>('60%', '50%', '40%', '30%', '20%')
            }}>
              <CustomTextInput
                value={form.getValues().name}
                onChange={(data => form.setFieldValue('name', data))}
                label='Name'
                errorText={form.errors?.name ? String(form.errors?.name) : undefined}
                isError={!!form.errors?.name}
              />
              <CustomTextInput
                value={form.getValues().email}
                onChange={(data => form.setFieldValue('email', data))}
                label='Email'
                errorText={form.errors?.email ? String(form.errors?.email) : undefined}
                isError={!!form.errors?.email}
              />
              <CustomPhoneInput
                label='Phone'
                value={form.getValues().phone}
                onChange={(data => form.setFieldValue('phone', data.toString()))}
                errorText={form.errors?.phone ? String(form.errors?.phone) : undefined}
                isError={!!form.errors?.phone}
              />
              <CustomInputTextArea
                label='Description'
                value={form.getValues().description}
                onChange={(data => form.setFieldValue('description', data.toString()))}
                errorText={form.errors?.description ? String(form.errors?.description) : undefined}
                isError={!!form.errors?.description}
              />
              <Button color={TEXT_COLOR_GRAY_2} onClick={sendForm}>
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}