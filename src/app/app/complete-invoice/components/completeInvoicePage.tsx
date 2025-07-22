'use client'
import { CustomDateInput, CustomNumberInput, CustomTextInput } from '@/components/customInput'
import { CustomText } from '@/components/customText'
import { useFetch } from '@/hooks/useFetch'
import { BG_COLOR, INVOICE_COMPLETE_URL_SERVER, TEXT_COLOR, TEXT_COLOR_GRAY_2 } from '@/utils/consts'
import { fetchMethod, statePage } from '@/utils/enums'
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications'
import { Box, Button, Container, Grid, Group, Space, Table } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect, useState } from 'react'
import { VarActions } from '@/app/app/components/varAcctions'
import { completeInvoiceI, invoiceModel, projectDescriptionModel } from '@/server/utilities/interfaces'
import { ClientInput, MethodPaymentInput } from '@/app/app/utilities/inputs'
import { LineBottom } from '@/components/lineBotton'
import { IconTrash } from '@tabler/icons-react'
import { CustomTooltip } from '@/components/customTooltip'
import { DateValue } from '@mantine/dates'
import { generatePdf } from '@/app/app/utilities/generatePDF'
import { clientI, generatePdfI, mountInvoiceI, paymentInfoI, pdfDataI } from '@/app/app/utilities/interfaces'
import {
  formatDateToDDMMYYYY,
  httpToClient,
  httpToCompleteInvoice,
  httpToInvoice,
  httpToMethodPayment,
  httpToProject,
  httpToProjectDescription,
  numberToUSD
} from '@/server/utilities/formatters'

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
    public_id: 'Budget',
    total_installment: 0,
    id: 1, // dont touch is for validation pass, then the logic on server update this value
    created_at: new Date(),
    updated_at: new Date(),
    soft_deleted: false,
  },
  invoices: [],
  projectDescriptions: [],
}

const INIT_PROJECT_DESCRIPTION: projectDescriptionModel = {
  description: '',
  element_num: 1,
  invoice_public_id: 'Budget', // dont touch is for validation pass, then the logic on server update this value
  project_id: 1, // dont touch is for validation pass, then the logic on server update this value
  unitary_price: 0,
  id: 1, // dont touch is for validation pass, then the logic on server update this value
  created_at: new Date(),
  updated_at: new Date(),
  soft_deleted: false,
}

const INIT_INVOICE: invoiceModel = {
  installment_num: 1, // dont touch is for validation pass, then the logic on server update this value
  client_id: 1, // dont touch is for validation pass, then the logic on server update this value
  method_payment_id: 1, // dont touch is for validation pass, then the logic on server update this value
  creation_date: new Date(),
  expiration_date: new Date(),
  public_id: 'Budget',
  mount_pay: 0,
  project_id: 1, // dont touch is for validation pass, then the logic on server update this value
  created_at: new Date(),
  updated_at: new Date(),
  soft_deleted: false,
}  

export default function CompleteInvoicePage({ initialState, totalMount }: { initialState: statePage , totalMount?: number }) {
  const [state, setState] = useState<statePage>(initialState)
  const [invoice, setInvoice] = useState<invoiceModel>(INIT_INVOICE)
  const { sendF } = useFetch()
  const [projectDescription, setProjectDescription] = useState<projectDescriptionModel>({
    ...INIT_PROJECT_DESCRIPTION,
    unitary_price: totalMount ?? 0
  })
  
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_VALUES,
    validate: {
      client: (val) => httpToClient({ httpData: [val] as never[], optionalFieldObligatory: false }).hasError
        ? 'Invalid client'
        : null,
      invoices: (val) => httpToInvoice({ httpData: val as never[], optionalFieldObligatory: false }).hasError
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
        endpoint: INVOICE_COMPLETE_URL_SERVER + '?project_public_id=' + id,
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
    if (form.getValues().invoices.map(invoice => invoice.mount_pay).reduce((acc, val) => acc + val) !==
    form.getValues().projectDescriptions.map(projectDescription => projectDescription.unitary_price).reduce((acc, val) => acc + val)) {
      notifyShowBase({
        id: 'test',
        title: 'Error match',
        message: 'total installments no match with total invoice descriptions',
        loading: false
      })
      return
    }

    const _form = form.getValues()
    const allData: generatePdfI[] = form.getValues().invoices.map(invoice => {
      const pdfData: pdfDataI = {
        dateCreation: new Date(invoice.creation_date),
        dateExpiration: new Date(invoice.expiration_date),
        descriptions: _form.projectDescriptions.map(data => ({ amount: data.unitary_price, description: data.description })),
        id: invoice.public_id,
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
        currentInstallment: invoice.installment_num,
        paidMount: invoice.ref_num_paid ? invoice.mount_pay : 0,
        pendingMount: invoice.ref_num_paid ? 0 : invoice.mount_pay,
        mount: invoice.mount_pay,
        totalInstallment: _form.project.total_installment    
      }
      
      return {
        client,
        mountInvoice,
        paymentInfo,
        pdfData
      }
    })
    
    const pdf = await generatePdf(allData)

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
    if (form.getValues().invoices.map(invoice => invoice.mount_pay).reduce((acc, val) => acc + val) !==
    form.getValues().projectDescriptions.map(projectDescription => projectDescription.unitary_price).reduce((acc, val) => acc + val)) {
      notifyShowBase({
        id: 'test',
        title: 'Error match',
        message: 'Total installments no match with total invoice descriptions',
        loading: false
      })
      return
    }
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
    if (form.getValues().invoices.map(invoice => invoice.mount_pay).reduce((acc, val) => acc + val) !==
    form.getValues().projectDescriptions.map(projectDescription => projectDescription.unitary_price).reduce((acc, val) => acc + val)) {
      notifyShowBase({
        id: 'test',
        title: 'Error match',
        message: 'total installments no match with total invoice descriptions',
        loading: false
      })
      return
    }

    notifyShowBase({
      id: 'test',
      title: 'Editing data',
      message: 'Wait a momment..',
      loading: true
    })

    const responseServer = await sendF<completeInvoiceI[], completeInvoiceI>({
      endpoint: INVOICE_COMPLETE_URL_SERVER + '/' + form.values.project.public_id,
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
      endpoint: INVOICE_COMPLETE_URL_SERVER + '/' + form.values.project.public_id,
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
  } 

  const changeMethodPaymentInput = (data:  string | null) => {
    const dataNumber = Number(data)
    
    form.setFieldValue('methodPayment.id', dataNumber)
  }

  const changeInvoiceCreationDateInput = (data: DateValue) => {
    if (new Date(data!)!.getTime() > invoice.expiration_date.getTime()) setInvoice(prev => ({ ...prev, expiration_date: new Date(data!) })) 
    
    setInvoice(prev => ({ ...prev, creation_date: new Date(data!) })) 
  }

  const addProjectDescription = () => {
    const newProjectDescription: projectDescriptionModel[] = [
      ...form.getValues().projectDescriptions,
      {...projectDescription, project_id: form.getValues().project.id! }
    ]
    
    form.setFieldValue('projectDescriptions', newProjectDescription)
    setProjectDescription(INIT_PROJECT_DESCRIPTION)
  }

  const addInvoice = () => {
    const newInvoice: invoiceModel[] = [...form.getValues().invoices, {...invoice, installment_num: form.getValues().invoices.length + 1 }]
    
    form.setFieldValue('invoices', newInvoice)
    setInvoice(INIT_INVOICE)
  }

  const deleteInvoiceRow = (element: invoiceModel) => {
    const newInvoice = form.getValues().invoices.filter(el => el !== element) 
    
    form.setFieldValue('invoices', newInvoice)
  }

  const deleteProjectDesciptionRow = (element: projectDescriptionModel) => {
    const newProjectDescription = form.getValues().projectDescriptions.filter(el => el !== element) 

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
          <CustomNumberInput  
            label='N. installments'
            showLabel={true}
            readOnly={state === statePage.VIEW}
            disabled={form.getValues().invoices.length > 0}
            value={form.getValues().project.total_installment}
            onChange={data => form.setFieldValue('project.total_installment', data)}
            errorText={form.errors?.project ? String(form.errors?.project) : undefined}
            isError={!!form.errors?.project}
          />
        </Grid.Col>
        <Grid.Col span={6} style={{ display:'flex', alignItems: 'end' }}>
          <CustomText style={{ fontSize: '1rem' }}>
            {numberToUSD(form.getValues().invoices.reduce((acc, curr) => acc + curr.mount_pay, 0))}
            of {numberToUSD(form.getValues().projectDescriptions.reduce((acc, curr) => acc + curr.unitary_price, 0))}
          </CustomText>
        </Grid.Col>
      </Grid>
      <Space h='xl' />
      <Grid style={{ border: `1px ${TEXT_COLOR_GRAY_2} solid`, borderRadius: '.3rem', padding: '.3rem' }}>  
        <Grid.Col span={12}>
          <LineBottom>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CustomText style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                INVOICE DESCRIPTION
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
            label='Service description'
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
            label='Total project cost'
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
                <Table.Th>Serie Description</Table.Th>
                <Table.Th>Cost</Table.Th>
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
      <Space h='xl' />
      <Grid style={{ border: `1px ${TEXT_COLOR_GRAY_2} solid`, borderRadius: '.3rem', padding: '.3rem' }}>  
        <Grid.Col span={12}>
          <LineBottom>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CustomText style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                INSTALLMENTS
              </CustomText>
              <Button
                variant='transparent'
                style={ state === statePage.VIEW ? { display: 'none' } : {}}
                disabled={!invoice.creation_date ||
                  !invoice.expiration_date ||
                  !invoice.mount_pay ||
                  form.getValues().invoices.length >= form.getValues().project.total_installment
                }
                onClick={addInvoice}
              >
                Add item
              </Button>
            </Box>
          </LineBottom>
        </Grid.Col>
        <Grid.Col span={6} style={ state === statePage.VIEW ? { display: 'none' } : {}}>
          <CustomTextInput
            label='Ref. Number'
            placeholder='Can be empty'
            readOnly={state === statePage.VIEW} 
            showLabel={true}
            value={invoice.ref_num_paid ?? undefined as unknown as string}
            onChange={(ref_num_paid => setInvoice(prev => ({ ...prev, ref_num_paid })))}
            errorText={form.errors?.invoices ? String(form.errors?.invoices) : undefined}
            isError={!!form.errors?.invoices}
          />
        </Grid.Col>
        <Grid.Col span={6} style={{ display: state === statePage.EDIT ? 'block' : 'none' }}>
          <CustomTextInput
            label='Public id'
            readOnly={state !== statePage.EDIT} 
            showLabel={true}
            value={invoice.public_id ?? ''}
            onChange={(public_id => setInvoice(prev => ({ ...prev, public_id })))}
            errorText={form.errors?.invoices ? String(form.errors?.invoices) : undefined}
            isError={!!form.errors?.invoices}
          />
        </Grid.Col>
        <Grid.Col span={6} style={ state === statePage.VIEW ? { display: 'none' } : {}}>
          <CustomDateInput
            label='Creation Date'
            showLabel={true}
            readOnly={state === statePage.VIEW} 
            value={invoice.creation_date ?? new Date()} 
            onChange={changeInvoiceCreationDateInput}
            errorText={form.errors?.invoices ? String(form.errors?.invoices) : undefined}
            isError={!!form.errors?.invoices}
          />
        </Grid.Col>
        <Grid.Col span={6} style={ state === statePage.VIEW ? { display: 'none' } : {}}>
          <CustomDateInput
            label='Due date'
            showLabel={true}
            readOnly={state === statePage.VIEW} 
            extprops={{ minDate: invoice.creation_date }}
            value={invoice.expiration_date ?? new Date()} 
            onChange={data => setInvoice(prev => ({ ...prev, expiration_date: new Date(data!) }))}
            errorText={form.errors?.invoices ? String(form.errors?.invoices) : undefined}
            isError={!!form.errors?.invoices}
          />
        </Grid.Col>
        <Grid.Col span={6} style={ state === statePage.VIEW ? { display: 'none' } : {}}>
          <CustomNumberInput
            label='Partial payment'
            showLabel={true}
            value={invoice.mount_pay}
            onChange={mount_pay => setInvoice(prev => ({ ...prev, mount_pay }))}
            errorText={form.errors?.invoices ? String(form.errors?.invoices) : undefined}
            isError={!!form.errors?.invoices}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Table stickyHeader stickyHeaderOffset={60} styles={{
            tbody: { color: TEXT_COLOR, fontSize: '1.3rem' },
            thead: { backgroundColor: 'transparent', fontSize: '1.5rem', color: TEXT_COLOR }
          }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={state === statePage.VIEW ? { display: 'none' } : {}} />
                <Table.Th>Id</Table.Th>
                <Table.Th>Partial payment</Table.Th>
                <Table.Th>Ref. Number</Table.Th>
                <Table.Th>Creation date</Table.Th>
                <Table.Th>Due date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{form.getValues().invoices.map((element, index) => {
              return <Table.Tr key={index}>
                <Table.Td style={ state === statePage.VIEW ? { display: 'none' } : {}}>
                  <CustomTooltip label='Delete row'>
                    <Button color='red' variant='subtle' onClick={() => deleteInvoiceRow(element)}>
                      <IconTrash/>
                    </Button>
                  </CustomTooltip>
                </Table.Td>
                <Table.Td>
                    {element.public_id}
                </Table.Td>
                <Table.Td>
                    {numberToUSD(element.mount_pay)}
                </Table.Td>
                <Table.Td>
                    {element.ref_num_paid}
                </Table.Td>
                <Table.Td>
                     {formatDateToDDMMYYYY(element.creation_date)}
                </Table.Td>
                <Table.Td>
                    {formatDateToDDMMYYYY(element.expiration_date)}
                </Table.Td>
              </Table.Tr>
            })}</Table.Tbody>
          </Table>
        </Grid.Col>
      </Grid>
    </Container>
  )
} 
