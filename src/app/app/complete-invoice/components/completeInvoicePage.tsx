'use client'
import { CustomDateInput, CustomNumberInput, CustomTextInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { useFetch } from '@/hooks/useFetch';
import { BG_COLOR, INVOICE_COMPLETE_URL_SERVER, TEXT_COLOR, TEXT_COLOR_GRAY_2 } from '@/utils/consts';
import { fetchMethod, statePage } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { Box, Button, Container, Grid, Group, Space, Table } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { VarActions } from '@/app/app/components/varAcctions';
import {
  httpToClient,
  httpToCompleteInvoice,
  httpToInstallment,
  httpToInvoice,
  httpToMethodPayment,
  httpToProject,
  httpToProjectDescription,
  numberToUSD
} from '@/server/utilities/formatters';
import { completeInvoiceI, projectDescriptionModel } from '@/server/utilities/interfaces';
import { ClientInput, MethodPaymentInput, ProjectInput } from '../../utilities/inputs';
import { LineBottom } from '@/components/lineBotton';
import { IconTrash } from '@tabler/icons-react';
import { CustomTooltip } from '@/components/customTooltip';
import { DateValue } from '@mantine/dates';
import { generatePdf } from '../../utilities/generatePDF';
import { clientI, mountInvoiceI, paymentInfoI, pdfDataI } from '../../utilities/interfaces';

const INIT_VALUES: completeInvoiceI = {
  client: {
    address: '',
    email: '',
    name: '',
    phone: '', 
    created_at: new Date(),
    updated_at: new Date(),
    soft_deleted: false,
  },
  methodPayment: {
    account_num: '',
    bank_name: '',
    company_name: '',
    routing_num: '',
    zelle: '',
    created_at: new Date(),
    updated_at: new Date(),
    soft_deleted: false,
  },
  project: {
    public_id: 'Generated automatically',
    total_installment: 0,
    created_at: new Date(),
    updated_at: new Date(),
    soft_deleted: false,
  },
  installment: {
    id: 1, // dont touch is for validation pass, then the logic on server update this value
    installment_num: 1, // dont touch is for validation pass, then the logic on server update this value
    mount_pay: 0,
    project_id: 0, 
    created_at: new Date(),
    updated_at: new Date(),
    soft_deleted: false,
  },
  invoice: {
    client_id: 0,
    creation_date: new Date(),
    expiration_date: new Date(),
    installment_id: 1, // dont touch is for validation pass, then the logic on server update this value
    method_payment_id: 0,
    project_id: 0,
    public_id: 'Generated automatically',
    created_at: new Date(),
    updated_at: new Date(),
    soft_deleted: false,
  },
  projectDescriptions: [],
}

const INIT_PROJECT_DESCRIPTION: projectDescriptionModel = {
  description: '',
  element_num: 1,
  invoice_public_id: 'Generated automatically',
  project_id: 0,
  unitary_price: 0,
  id: 1, // dont touch is for validation pass, then the logic on server update this value
  created_at: new Date(),
  updated_at: new Date(),
  soft_deleted: false,
}

export default function CompleteInvoicePage({ initialState }: { initialState: statePage }) {
  const [state, setState] = useState<statePage>(initialState)
  const [projectDescription, setProjectDescription] = useState<projectDescriptionModel>(INIT_PROJECT_DESCRIPTION)
  const { sendF } = useFetch()
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_VALUES,
    validate: {
      client: (val) => httpToClient({ httpData: [val] as never[], optionalFieldObligatory: false }).hasError
        ? 'Invalid client'
        : null,
      installment: (val) => httpToInstallment({ httpData: [val] as never[], optionalFieldObligatory: false }).hasError
        ? 'Invalid installment'
        : null,
      invoice: (val) => httpToInvoice({ httpData: [val] as never[], optionalFieldObligatory: false }).hasError
        ? 'Invalid invoice'
        : null,
      methodPayment: (val) => httpToMethodPayment({ httpData: [val] as never[], optionalFieldObligatory: false }).hasError
        ? 'Invalid method payment'
        : null,
      project: (val) => httpToProject({ httpData: [val] as never[], optionalFieldObligatory: false }).hasError
        ? 'Invalid project'
        : null,
      projectDescriptions: (val) => httpToProjectDescription({ httpData: val as never[], optionalFieldObligatory: false }).hasError
        ? 'Invalid project description'
        : null
    },
  })

  useEffect(() => {
    const sendGet = async (id?: string) => {
      if (!id) return;
      notifyShowBase({
        id: 'test',
        title: 'Geting data',
        message: 'Wait a momment..',
        loading: true
      })
  
      const responseServer = await sendF<completeInvoiceI[], completeInvoiceI[]>({
        endpoint: INVOICE_COMPLETE_URL_SERVER + '?public_id=' + id,
        method: fetchMethod.GET
      })

      if (!responseServer.hasError && responseServer.payload && responseServer.payload.length !== 0) {
        const invoiceCompleteFormatted = httpToCompleteInvoice({
          httpData: responseServer.payload! as never[],
          optionalFieldObligatory: true
        })
        
        if (!invoiceCompleteFormatted.hasError && invoiceCompleteFormatted.payload && invoiceCompleteFormatted.payload.length !== 0) {
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
            message: invoiceCompleteFormatted.message,
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
      const id = window.location.href.split('/complete-invoice/')[1]
      
      if (!id) return
      sendGet(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const PdfHandler = async (isPreview: boolean) => {
    if (form.validate().hasErrors) return
    const _form = form.getValues()
    const pdfData: pdfDataI = {
      dateCreation: new Date(_form.invoice.creation_date),
      dateExpiration: new Date(_form.invoice.expiration_date),
      descriptions: _form.projectDescriptions.map(data => ({ amount: data.unitary_price, description: data.description })),
      id: _form.invoice.public_id,
      idProject: _form.project.public_id,
      isInvoice: state === statePage.VIEW,
    }
  
    const client: clientI = {
      address: _form.client.address,
      email: _form.client.email,
      name: _form.client.name,
      phone: _form.client.phone,
      id: _form.client.id ? String(_form.client.id) : '',
    }
  
    const paymentInfo: paymentInfoI = {
      accountNumber: _form.methodPayment.account_num,
      bankName: _form.methodPayment.bank_name,
      companyName: _form.methodPayment.company_name,
      id: String(_form.methodPayment.id),
      routingNumber: _form.methodPayment.routing_num,
      urlQr: _form.methodPayment.url_qr,
      zelle: _form.methodPayment.zelle,
    }
  
    const mountInvoice: mountInvoiceI = {
      currentInstallment: _form.installment.installment_num,
      paidMount: _form.projectDescriptions.map((el) => el.unitary_price * el.element_num).reduce((acc, val) => acc + val),
      pendingMount: 10,
      totalInstallment: _form.project.total_installment    
    }
    
    const pdf = await generatePdf({
      client,
      mountInvoice,
      paymentInfo,
      pdfData
    })

    if (isPreview) window.open(pdf, '_blank')
    else {
      const a = document.createElement('a');
      a.href = pdf;
      a.download = 'documento.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  const sendSave = async () => {
    if (form.validate().hasErrors) return
    notifyShowBase({
      id: 'test',
      title: 'Saving data',
      message: 'Wait a momment..',
      loading: true
    })
    
    const responseServer = await sendF<completeInvoiceI[], completeInvoiceI[]>({
      endpoint: INVOICE_COMPLETE_URL_SERVER,
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

    const responseServer = await sendF<completeInvoiceI[], completeInvoiceI>({
      endpoint: INVOICE_COMPLETE_URL_SERVER + '/' + form.values.invoice.project_id + '/' + form.values.invoice.installment_id,
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

    const responseServer = await sendF<completeInvoiceI[]>({
      endpoint: INVOICE_COMPLETE_URL_SERVER + '/' + form.values.invoice.public_id,
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

  const changeClientInput = (data:  string | null) => {
    const dataNumber = Number(data)
    
    form.setFieldValue('client.id', dataNumber)
    form.setFieldValue('invoice.client_id', dataNumber)
  } 

  const changeProjectInput = (data:  string | null) => {
    const dataNumber = Number(data)
    
    form.setFieldValue('project.id', dataNumber)
    form.setFieldValue('invoice.project_id', dataNumber)
    form.setFieldValue('installment.project_id', dataNumber)
  } 

  const changeMethodPaymentInput = (data:  string | null) => {
    const dataNumber = Number(data)
    
    form.setFieldValue('methodPayment.id', dataNumber)
    form.setFieldValue('invoice.method_payment_id', dataNumber)
  }

  const changeInvoiceCreationDateInput = (data: DateValue) => {
    if (data!.getTime() > form.getValues().invoice.expiration_date.getTime()) form.setFieldValue('invoice.expiration_date', data!) 
    form.setFieldValue('invoice.creation_date', data!)
  }

  const updateInstallmentMountPay = (data: projectDescriptionModel[]) => {
    const unitaryPrices: number[] = data.map(val => val.unitary_price)
    let acc: number = 0

    if (unitaryPrices.length > 0) acc = unitaryPrices.reduce((acc, val) => acc + val)
    form.setFieldValue('installment.mount_pay', acc)
  }

  const addProjectDescription = () => {
    const newProjectDescription: projectDescriptionModel[] = [
      ...form.getValues().projectDescriptions,
      {...projectDescription, project_id: form.getValues().project.id! }
    ]
    
    form.setFieldValue('projectDescriptions', newProjectDescription)
    updateInstallmentMountPay(newProjectDescription)
    setProjectDescription(INIT_PROJECT_DESCRIPTION)
  }

  const deleteProjectDesciptionRow = (element: projectDescriptionModel) => {
    const newProjectDescription = form.getValues().projectDescriptions.filter(el => el !== element) 
    
    updateInstallmentMountPay(newProjectDescription)
    form.setFieldValue('projectDescriptions', newProjectDescription)
  }

  return (
    <Container style={{ minWidth:'100%', minHeight:'87vh', backgroundColor: BG_COLOR }}>
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CustomText style={{ fontSize: '3rem', fontWeight: 'bold' }}>
          COMPLETE INVOICE
        </CustomText>
        <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Group> 
            <Button onClick={() => PdfHandler(true)}>
              Preview PDF
            </Button>
            <Button onClick={() => PdfHandler(false)}>
              Download PDF
            </Button>
          </Group>
          <VarActions
            onClickSave={state === statePage.EDIT ? sendEdit : sendSave}
            disanbledSave = {state === statePage.VIEW}
            onClickEdit={() => setState(statePage.EDIT)}
            disanbledEdit = {true}
            onClickDelete={sendDelete}
            disanbledDelete = {state !== statePage.VIEW}
          />
        </Box>
      </Box>
      <Space h="xl" />
      <Grid>
        <Grid.Col span={6}>
          <ClientInput  
            label='Clients'
            showLabel={true}
            dataSelected={data => form.setFieldValue('client', data)}
            value={form.getValues().client.id != undefined ? String(form.getValues().client.id) : ''}
            onChange={changeClientInput}
            errorText={form.errors?.client ? String(form.errors?.client) : undefined}
            isError={!!form.errors?.client}
            readOnly={state === statePage.VIEW} 
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <MethodPaymentInput  
            label='Payment methods'
            showLabel={true}
            dataSelected={data => form.setFieldValue('methodPayment', data)}
            value={form.getValues().methodPayment.id != undefined ? String(form.getValues().methodPayment.id) : ''}
            onChange={changeMethodPaymentInput}
            errorText={form.errors?.methodPayment ? String(form.errors?.methodPayment) : undefined}
            isError={!!form.errors?.methodPayment}
            readOnly={state === statePage.VIEW} 
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <ProjectInput  
            label='Proyect'
            showLabel={true}
            dataSelected={data => form.setFieldValue('project', data)}
            value={form.getValues().project.id != undefined ? String(form.getValues().project.id) : ''}
            onChange={changeProjectInput}
            errorText={form.errors?.project ? String(form.errors?.project) : undefined}
            isError={!!form.errors?.project}
            readOnly={state === statePage.VIEW} 
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <LineBottom>
            <CustomText style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              INVOICE
            </CustomText>
          </LineBottom>
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomTextInput
            label='Num. Ref. paid'
            placeholder='Can be empty'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={form.getValues().invoice.ref_num_paid ?? undefined as unknown as string}
            onChange={(data => form.setFieldValue('invoice.ref_num_paid', data))}
            errorText={form.errors?.invoice ? String(form.errors?.invoice) : undefined}
            isError={!!form.errors?.invoice}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomTextInput
            label='Public id'
            readOnly={state !== statePage.EDIT} 
            showLabel={true}
            value={form.getValues().invoice.public_id ?? ''}
            onChange={(data => form.setFieldValue('invoice.public_id', data))}
            errorText={form.errors?.invoice ? String(form.errors?.invoice) : undefined}
            isError={!!form.errors?.invoice}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomDateInput
            label='Creation Date'
            showLabel={true}
            readOnly={state === statePage.VIEW} 
            value={form.getValues().invoice.creation_date ?? new Date()} 
            onChange={changeInvoiceCreationDateInput}
            errorText={form.errors?.invoice ? String(form.errors?.invoice) : undefined}
            isError={!!form.errors?.invoice}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomDateInput
            label='Due date'
            showLabel={true}
            readOnly={state === statePage.VIEW} 
            extprops={{ minDate: form.getValues().invoice.creation_date }}
            value={form.getValues().invoice.expiration_date ?? new Date()} 
            onChange={data => form.setFieldValue('invoice.expiration_date', data!)}
            errorText={form.errors?.invoice ? String(form.errors?.invoice) : undefined}
            isError={!!form.errors?.invoice}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomDateInput
            label='Last change'
            showLabel={true}
            readOnly={true}
            disabled={true} 
            value={form.getValues().invoice.updated_at ?? new Date()} 
            onChange={(data => form.setFieldValue('invoice.updated_at', data!))}
            errorText={form.errors?.updated_at ? String(form.errors?.updated_at) : undefined}
            isError={!!form.errors?.updated_at}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <LineBottom>
            <CustomText style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              INSTTALLMENT
            </CustomText>
          </LineBottom>
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomNumberInput
            label='Mount to pay'
            readOnly={state !== statePage.EDIT} 
            showLabel={true}
            value={form.getValues().installment.mount_pay}
            onChange={(data => form.setFieldValue('installment.mount_pay', data))}
            // errorText={form.errors?.installment ? String(form.errors?.installment) : undefined}
            // isError={!!form.errors?.installment}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <CustomNumberInput
            label='Installment number'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={form.getValues().installment.installment_num}
            onChange={(data => form.setFieldValue('installment.installment_num', data))}
            errorText={form.errors?.installment ? String(form.errors?.installment) : undefined}
            isError={!!form.errors?.installment}
            max={form.getValues().project.total_installment ?? 0}
          />
          <CustomText>
            Total installment fot this project: {form.getValues().project.total_installment ?? 0}
          </CustomText>
        </Grid.Col>
      </Grid>
      <Space h='xl' />
      <Grid style={{ border: `1px ${TEXT_COLOR_GRAY_2} solid`, borderRadius: '.3rem', padding: '.3rem' }}>  
        <Grid.Col span={12}>
          <LineBottom>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <CustomText style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                PROJECT DESCRIPTION
              </CustomText>
              <Button
                style={ state === statePage.VIEW ? { display: 'none' } : {}}
                disabled={!projectDescription.description || !form.getValues().project.id}
                onClick={addProjectDescription}
              >
                Add
              </Button>
            </Box>
          </LineBottom>
        </Grid.Col>
        <Grid.Col span={6} style={ state === statePage.VIEW ? { display: 'none' } : {}}>
          <CustomTextInput
            label='Description'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={projectDescription.description}
            onChange={description => setProjectDescription(prev => ({ ...prev, description }))}
            errorText={form.errors?.projectDescriptions ? String(form.errors?.projectDescriptions) : undefined}
            isError={!!form.errors?.projectDescriptions}
          />
        </Grid.Col>
        <Grid.Col span={6} style={ state === statePage.VIEW ? { display: 'none' } : {}}>
          <CustomNumberInput
            label='Price'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={projectDescription.unitary_price}
            onChange={unitary_price => setProjectDescription(prev => ({ ...prev, unitary_price }))}
            errorText={form.errors?.projectDescriptions ? String(form.errors?.projectDescriptions) : undefined}
            isError={!!form.errors?.projectDescriptions}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Table stickyHeader stickyHeaderOffset={60} styles={{
            tbody: { color: TEXT_COLOR, fontSize: '1.3rem' },
            thead: { backgroundColor: 'transparent', fontSize: '1.5rem', color: TEXT_COLOR }
          }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={ state === statePage.VIEW ? { display: 'none' } : {}} />
                <Table.Th>Description</Table.Th>
                <Table.Th>Price</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{form.getValues().projectDescriptions.map((element, index) => {
              return <Table.Tr key={index}>
                <Table.Td style={ state === statePage.VIEW ? { display: 'none' } : {}}>
                  <CustomTooltip label='Delete row'>
                    <Button color='red' variant='subtle' onClick={() => deleteProjectDesciptionRow(element)}>
                      <IconTrash/>
                    </Button>
                  </CustomTooltip>
                </Table.Td>
                <Table.Td>
                    {element.description}
                </Table.Td>
                <Table.Td>
                    {numberToUSD(element.unitary_price)}
                </Table.Td>
              </Table.Tr>
            })}</Table.Tbody>
          </Table>
        </Grid.Col>
      </Grid>
    </Container>
  )
} 
