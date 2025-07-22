'use client'
import { CustomNumberInput, CustomTextInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { useFetch } from '@/hooks/useFetch';
import { methodPaymentModel } from '@/server/utilities/interfaces';
import { METHOD_PAYMENT_URL_SERVER } from '@/utils/consts';
import { fetchMethod, statePage } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { checkString } from '@/utils/validations';
import { Box, Container, Grid, Space } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { VarActions } from '@/app/app/components/varAcctions';
import { httpToMethodPayment } from '@/server/utilities/formatters';

const INIT_VALUES: methodPaymentModel = {
  account_num: '',
  routing_num: '',
  bank_name: '',
  company_name: '',
  zelle: '',
  url_qr: undefined
}

export default function ProjectPage({ initialState }: { initialState: statePage }) {
  const [state, setState] = useState<statePage>(initialState)
  const { sendF } = useFetch()
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_VALUES,
    validate: {
      account_num: (val) => checkString(val) ? null : 'Account num is field is required',
      routing_num: (val) => checkString(val) ? null : 'Routing num field is required',
      bank_name: (val) => checkString(val) ? null : 'Bank name field is required',
      zelle: (val) => checkString(val) ? null : 'Bank name field is required',
      company_name: (val) => checkString(val) ? null : 'Bank name field is required'
    },
  })

  useEffect(() => {
    const sendGet = async (id?: number) => {
      if (!id) return;
      notifyShowBase({
        id: 'test',
        title: 'Geting data',
        message: 'Wait a momment..',
        loading: true
      })
  
      const responseServer = await sendF<methodPaymentModel[], methodPaymentModel[]>({
        endpoint: METHOD_PAYMENT_URL_SERVER + '?id=' + id,
        method: fetchMethod.GET
      })

      if (!responseServer.hasError && responseServer.payload && responseServer.payload.length !== 0) {
        const methodPaymentFormatted = httpToMethodPayment({ httpData: responseServer.payload! as never[], optionalFieldObligatory: true })
        
        if (!methodPaymentFormatted.hasError && methodPaymentFormatted.payload && methodPaymentFormatted.payload.length !== 0) {
          form.setValues(responseServer.payload![0])
          setState(statePage.VIEW)
          notifyUpdateBase({
            id: 'test',
            title: 'All done',
            message: responseServer.message,
            loading: false
          }) 
        } else {
          notifyUpdateBase({
            id: 'test',
            title: 'Error',
            message: methodPaymentFormatted.message,
            loading: false
          })
        }
      } else  {
        notifyUpdateBase({
          id: 'test',
          title: 'Error',
          message: responseServer.message,
          loading: false
        })
      } 
    }
    
    if (process) {
      const id = window.location.href.split('/method-payment/')[1]
      
      if (!id || Number.isNaN(Number(id))) return
      sendGet(Number(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sendSave = async () => {
    if (form.validate().hasErrors) return
    notifyShowBase({
      id: 'test',
      title: 'Saving data',
      message: 'Wait a momment..',
      loading: true
    })

    const responseServer = await sendF<methodPaymentModel[], methodPaymentModel[]>({
      endpoint: METHOD_PAYMENT_URL_SERVER,
      body: [form.values],
      method: fetchMethod.POST
    })
    
    if (!responseServer.hasError && responseServer.payload && responseServer.payload.length !== 0 ) {
      form.setValues(responseServer.payload![0])
      setState(statePage.VIEW)
    }

    notifyUpdateBase({
      id: 'test',
      title: responseServer.hasError ? 'Error' : 'All done',
      message: responseServer.message,
      loading: false
    }) 
  }

  const sendEdit = async () => {
    if (form.validate().hasErrors) return
    notifyShowBase({
      id: 'test',
      title: 'Editing data',
      message: 'Wait a momment..',
      loading: true
    })

    const responseServer = await sendF<methodPaymentModel[], methodPaymentModel>({
      endpoint: METHOD_PAYMENT_URL_SERVER + '/' + form.values.id,
      body: form.values,
      method: fetchMethod.PUT
    })
    
    if (!responseServer.hasError && responseServer.payload && responseServer.payload.length !== 0 ) {
      form.setValues(responseServer.payload![0])
      setState(statePage.VIEW)
    }

    notifyUpdateBase({
      id: 'test',
      title: responseServer.hasError ? 'Error' : 'All done',
      message: responseServer.message,
      loading: false
    }) 
  }

  const sendDelete = async () => {
    notifyShowBase({
      id: 'test',
      title: 'Deleting data',
      message: 'Wait a momment..',
      loading: true
    })

    const responseServer = await sendF<methodPaymentModel[]>({
      endpoint: METHOD_PAYMENT_URL_SERVER + '/' + form.values.id,
      method: fetchMethod.DELETE
    })
    
    if (!responseServer.hasError) {
      form.reset()
      setState(statePage.CREATE)
    } 
      notifyUpdateBase({
        id: 'test',
        title: responseServer.hasError ? 'Error' : 'All done',
        message: responseServer.message,
        loading: false
      }) 
  }
  
  return (
    <Container style={{ minWidth:'100%', minHeight:'87vh' }}>
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CustomText style={{ fontSize: '3rem', fontWeight: 'bold' }}>
          PAYMENT METHOD 
        </CustomText>
        <VarActions
          onClickSave={state === statePage.EDIT ? sendEdit : sendSave}
          disanbledSave = {state === statePage.VIEW}
          onClickEdit={() => setState(statePage.EDIT)}
          disanbledEdit = {state !== statePage.VIEW}
          onClickDelete={sendDelete}
          disanbledDelete = {state !== statePage.VIEW}
        />
      </Box>
      <Space h="xl" />
      <Grid>
        <Grid.Col span={6}>
          <CustomNumberInput  
            label='Id'
            showLabel={true}
            value={form.getValues().id ?? 0}
            onChange={(data => form.setFieldValue('id', data))}
            errorText={form.errors?.id ? String(form.errors?.id) : undefined}
            isError={!!form.errors?.id}
            readOnly={state === statePage.VIEW} 
            disabled={state === statePage.CREATE}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomTextInput
            label='Account num'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={form.getValues().account_num}
            onChange={(data => form.setFieldValue('account_num', data))}
            errorText={form.errors?.public_id ? String(form.errors?.account_num) : undefined}
            isError={!!form.errors?.public_id}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomTextInput
            label='Routing num'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={form.getValues().routing_num}
            onChange={(data => form.setFieldValue('routing_num', data))}
            errorText={form.errors?.public_id ? String(form.errors?.routing_num) : undefined}
            isError={!!form.errors?.public_id}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomTextInput
            label='Bank name'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={form.getValues().bank_name}
            onChange={(data => form.setFieldValue('bank_name', data))}
            errorText={form.errors?.public_id ? String(form.errors?.bank_name) : undefined}
            isError={!!form.errors?.public_id}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomTextInput
            label='Company name'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={form.getValues().company_name}
            onChange={(data => form.setFieldValue('company_name', data))}
            errorText={form.errors?.public_id ? String(form.errors?.company_name) : undefined}
            isError={!!form.errors?.public_id}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomTextInput
            label='Zelle'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={form.getValues().zelle}
            onChange={(data => form.setFieldValue('zelle', data))}
            errorText={form.errors?.public_id ? String(form.errors?.zelle) : undefined}
            isError={!!form.errors?.public_id}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomTextInput
            label='url_qr'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={form.getValues().url_qr ?? ''}
            onChange={(data => form.setFieldValue('url_qr', data))}
            errorText={form.errors?.public_id ? String(form.errors?.url_qr) : undefined}
            isError={!!form.errors?.public_id}
          />
        </Grid.Col>
        {/* <Grid.Col span={6}>
          <CustomDateInput
            label='Last change'
            showLabel={true}
            readOnly={true}
            disabled={true} 
            value={form.getValues().updated_at ?? new Date()}
            onChange={(data => form.setFieldValue('updated_at', data!))}
            errorText={form.errors?.updated_at ? String(form.errors?.updated_at) : undefined}
            isError={!!form.errors?.updated_at}
          />
        </Grid.Col> */}
      </Grid>
    </Container>
  )
}
