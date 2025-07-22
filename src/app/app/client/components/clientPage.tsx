'use client'
import { CustomNumberInput, CustomTextInput, CustomPhoneInput, CustomDateInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { useFetch } from '@/hooks/useFetch';
import { clientModel } from '@/server/utilities/interfaces';
import { BG_COLOR, CLIENT_URL_SERVER } from '@/utils/consts';
import { fetchMethod, statePage } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { checkEmail, checkPhone, checkString } from '@/utils/validations';
import { Box, Container, Grid, Space } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { VarActions } from '@/app/app/components/varAcctions';
import { httpToClient } from '@/server/utilities/formatters';

const INIT_VALUES: clientModel = {
  address: '',
  email: '',
  name: '',
  phone: ''
}

export default function ClientPage({ initialState }: { initialState: statePage }) {
  const [state, setState] = useState<statePage>(initialState)
  const { sendF } = useFetch()
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_VALUES,
    validate: {
      address: (val) => (checkString(val) ? null : 'Address not valid'), 
      email: (val) => (checkEmail(val) ? null : 'Email not valid'), 
      name: (val) => (checkString(val) ? null : 'Name not valid'),
      phone: (val) => (checkPhone(val) ? null : 'Phone not valid') 
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
  
      const responseServer = await sendF<clientModel[], clientModel[]>({
        endpoint: CLIENT_URL_SERVER + '?id=' + id,
        method: fetchMethod.GET
      })

      if (!responseServer.hasError && responseServer.payload && responseServer.payload.length !== 0) {
        const clientFormatted = httpToClient({ httpData: responseServer.payload! as never[], optionalFieldObligatory: true })
        
        if (!clientFormatted.hasError && clientFormatted.payload && clientFormatted.payload.length !== 0) {
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
            message: clientFormatted.message,
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
      const id = window.location.href.split('/client/')[1]
      
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

    const responseServer = await sendF<clientModel[], clientModel[]>({
      endpoint: CLIENT_URL_SERVER,
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

    const responseServer = await sendF<clientModel[], clientModel>({
      endpoint: CLIENT_URL_SERVER + '/' + form.values.id,
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

    const responseServer = await sendF<clientModel[]>({
      endpoint: CLIENT_URL_SERVER + '/' + form.values.id,
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
    <Container style={{ minWidth:'100%', minHeight:'87vh', backgroundColor: BG_COLOR }}>
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CustomText style={{ fontSize: '3rem', fontWeight: 'bold' }}>
          CLIENT
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
            label='Address'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={form.getValues().address}
            onChange={(data => form.setFieldValue('address', data))}
            errorText={form.errors?.address ? String(form.errors?.address) : undefined}
            isError={!!form.errors?.address}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomPhoneInput  
            label='Phone'
            showLabel={true}
            readOnly={state === statePage.VIEW} 
            value={form.getValues().phone}
            onChange={(data => form.setFieldValue('phone', data))}
            errorText={form.errors?.phone ? String(form.errors?.phone) : undefined}
            isError={!!form.errors?.phone}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomTextInput  
            label='Name'
            showLabel={true}
            readOnly={state === statePage.VIEW} 
            value={form.getValues().name}
            onChange={(data => form.setFieldValue('name', data))}
            errorText={form.errors?.name ? String(form.errors?.name) : undefined}
            isError={!!form.errors?.name}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomTextInput  
            label='Email'
            showLabel={true}
            readOnly={state === statePage.VIEW} 
            value={form.getValues().email}
            onChange={(data => form.setFieldValue('email', data))}
            errorText={form.errors?.email ? String(form.errors?.email) : undefined}
            isError={!!form.errors?.email}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomDateInput
            label='Last change'
            showLabel={true}  
            readOnly={true}
            disabled={true} 
            value={form.getValues().updated_at ?? new Date()} 
            onChange={(data => form.setFieldValue('updated_at', new Date(data!)))}
            errorText={form.errors?.updated_at ? String(form.errors?.updated_at) : undefined}
            isError={!!form.errors?.updated_at}
          />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
