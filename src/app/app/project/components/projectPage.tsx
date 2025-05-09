'use client'
import { CustomNumberInput, CustomTextInput, CustomDateInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { useFetch } from '@/hooks/useFetch';
import { projectModel } from '@/server/utilities/interfaces';
import { PROJECT_URL_SERVER } from '@/utils/consts';
import { fetchMethod, statePage } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { checkTotalInstallment } from '@/utils/validations';
import { Box, Container, Grid, Space } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { VarActions } from '../../components/varAcctions';
import { httpToProject } from '@/server/utilities/formatters';

const INIT_FORM_VALUES: projectModel = {
  public_id: 'Generate on creation',
  total_installment: 0,
}

export default function ProjectPage({ initialState }: { initialState: statePage }) {
  const [state, setState] = useState<statePage>(initialState)
  const { sendF } = useFetch()
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_FORM_VALUES,
    validate: {
      total_installment: (val) => (checkTotalInstallment(val) ? null : 'Total installment not valid') 
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
  
      const responseServer = await sendF<projectModel[], projectModel[]>({
        endpoint: PROJECT_URL_SERVER + '?id=' + id,
        method: fetchMethod.GET
      })
      
      if (!responseServer.hasError && responseServer.payload && responseServer.payload.length !== 0) {
        const projectFormatted = httpToProject({ httpData: responseServer.payload! as never[], optionalFieldObligatory: true })
        
        if (!projectFormatted.hasError && projectFormatted.payload && projectFormatted.payload.length !== 0) {
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
            message: projectFormatted.message,
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
      const id = window.location.href.split('/project/')[1]
      
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

    const responseServer = await sendF<projectModel[], projectModel[]>({
      endpoint: PROJECT_URL_SERVER,
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

    const responseServer = await sendF<projectModel[], projectModel>({
      endpoint: PROJECT_URL_SERVER + '/' + form.values.id,
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
    if (form.validate().hasErrors) return
    notifyShowBase({
      id: 'test',
      title: 'Deleting data',
      message: 'Wait a momment..',
      loading: true
    })

    const responseServer = await sendF<projectModel[]>({
      endpoint: PROJECT_URL_SERVER + '/' + form.values.id,
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
          PROJECT
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
            label='Public id'
            readOnly={state === statePage.VIEW} 
            disabled={state === statePage.CREATE}
            showLabel={true}
            value={form.getValues().public_id}
            onChange={(data => form.setFieldValue('public_id', data))}
            errorText={form.errors?.public_id ? String(form.errors?.public_id) : undefined}
            isError={!!form.errors?.public_id}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomNumberInput  
            label='Total installment'
            showLabel={true}
            readOnly={state === statePage.VIEW} 
            value={form.getValues().total_installment}
            onChange={(data => form.setFieldValue('total_installment', data))}
            errorText={form.errors?.total_installment ? String(form.errors?.total_installment) : undefined}
            isError={!!form.errors?.total_installment}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomDateInput
            label='Last change'
            showLabel={true}
            readOnly={true}
            disabled={true} 
            value={String(form.getValues().updated_at) ?? new Date().toISOString()}
            onChange={(data => form.setFieldValue('updated_at', new Date(data)))}
            errorText={form.errors?.updated_at ? String(form.errors?.updated_at) : undefined}
            isError={!!form.errors?.updated_at}
          />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
