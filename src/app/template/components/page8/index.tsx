'use client';
import { CustomInputTextArea, CustomPhoneInput, CustomSelectInput, CustomTextInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { useFetch } from '@/hooks/useFetch';
import { PAGE_TEMPLPATE_7_ID, TEMPLATE_CONTACT_URL_SERVER, TEXT_COLOR_GRAY, TEXT_COLOR_GRAY_2 } from '@/utils/consts';
import { fetchMethod } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { checkEmail, checkPhone } from '@/utils/validations';
import { Box, Button, Checkbox, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRef, useState } from 'react';
import { data8I } from '@/app/template/utils/interfaces';

interface formI {
  name: string,
  email: string,
  phone: string,
  template: string,
  numberOfBeds?: string
  reasonPurchase?: string
  message: string
}

const INIT_FORM_VALUES: formI = {
  name: '',
  email: '',
  phone: '',
  template: '',
  numberOfBeds: '',
  reasonPurchase: '',
  message: ''
}

export default function Page8({ data }: { data: data8I }) {
  const { getByBreakPoint } = useBreakPointHandler()
  const [termSelection, setTermSelection] = useState<boolean>(false)
  const { sendF } = useFetch()
  const form = useForm({
    mode: 'controlled',
    initialValues: { ...INIT_FORM_VALUES, template: data.templateId },
    validate: {
      name: (val) => (val ? null : 'Name is empty'),
      phone: (val) => (val ? checkPhone(val) ? null: 'Invalid phone' : null),
      email: (val) => (checkEmail(val) ? null : 'Invalid email'),
      message: (val) => (val ? null : 'Message is empty'),
      numberOfBeds: (val) => (data.beds.length === 0 ? null : val ? null : 'Number of beds is empty'),
      reasonPurchase: (val) => (data.purchase.length === 0 ? null : val ? null : 'Reason of purchase is empty'),
    },
  });

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const bedsInputRef = useRef<HTMLInputElement>(null);
  const purchaseInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const titleSize = getByBreakPoint('1.5rem', '2rem', '2.5rem', '3rem', '3rem')
  const sendForm = async () => {
    if (form.validate().hasErrors) return
    notifyShowBase({
      id: 'test',
      title: 'Sending form',
      message: 'Wait a momment..',
      loading: true
    })
    
    const responseServer = await sendF({ endpoint: TEMPLATE_CONTACT_URL_SERVER, body: form.values, method: fetchMethod.POST })
    
    if (!responseServer.hasError) form.reset()
    notifyUpdateBase({
      id: 'test',
      title: responseServer.hasError ? 'Error' : 'Form sent',
      message: responseServer.message,
      loading: false
    })
  }

  return (
    <Container id={PAGE_TEMPLPATE_7_ID} style={{
      minWidth:'100%',
      height: '100vh',
      padding: 0,
    }}>
      <Box style={{
        height: '100vh',
        backgroundColor: '#0a0a0a'
      }}>
        <Box style={{
          width: '100%',
          height: '100%',
        }}>
          <Box style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '3% 8% 2% 8%',
          }}>
            <CustomText style={{ fontSize: titleSize, textAlign: 'center', color: 'white' }}>
              {data.title}
            </CustomText>
            <CustomText style={{
              color: 'white',
              fontWeight: 600,
              height: '15%',
              fontSize: getByBreakPoint<string>('1.2rem', '1.3rem', '1.4rem', '1.6rem', '1.6rem'),
            }}>
              ___
            </CustomText>
            <Box style={{
              display: 'flex',
              gap: '1.4rem',
              transition: 'all .2s ease',
              flexDirection: 'column',
              width: getByBreakPoint<string>('90%', '90%', '80%', '70%', '60%')
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
                onEnter={bedsInputRef?.current?.focus}
                value={form.getValues().phone}
                onChange={(data => form.setFieldValue('phone', data.toString()))}
                errorText={form.errors?.phone ? String(form.errors?.phone) : undefined}
                isError={!!form.errors?.phone}
              />
              {data.beds.length === 0
                ? null
                : <CustomSelectInput
                  label='Number of beds'
                  ref={bedsInputRef}
                  onEnter={purchaseInputRef?.current?.focus}
                  value={form.getValues().numberOfBeds ?? ''}
                  onChange={(data => form.setFieldValue('numberOfBeds', data ?? ''))}
                  errorText={form.errors?.numberOfBeds ? String(form.errors?.numberOfBeds) : undefined}
                  isError={!!form.errors?.numberOfBeds}
                  data={data.beds}
                />
              }
              {data.beds.length === 0
                ? null
                : <CustomSelectInput
                  label='Reason of Purchase'
                  ref={purchaseInputRef}
                  onEnter={bedsInputRef?.current?.focus}
                  value={form.getValues().reasonPurchase ?? ''}
                  onChange={(data => form.setFieldValue('reasonPurchase', data ?? ''))}
                  errorText={form.errors?.reasonPurchase ? String(form.errors?.reasonPurchase) : undefined}
                  isError={!!form.errors?.reasonPurchase}
                  data={data.purchase}
                />
              }
              <CustomInputTextArea  
                value={form.getValues().message}
                ref={messageInputRef}
                onEnter={() => setTermSelection(true)}
                onChange={(data => form.setFieldValue('message', data))}
                label='Message'
                errorText={form.errors?.message ? String(form.errors?.message) : undefined}
                isError={!!form.errors?.message}
              />
              <Checkbox
                value={termSelection ? 1 : 0}
                onClick={() => setTermSelection(prev => !prev)}
                styles={{ label: { color: TEXT_COLOR_GRAY }}}
                label={data.terms}
              />
              <Button color={TEXT_COLOR_GRAY_2} disabled={!termSelection} onClick={sendForm}>
                Send Message
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}