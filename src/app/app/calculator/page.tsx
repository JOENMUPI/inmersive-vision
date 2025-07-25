'use client'
import { CustomNumberInput, CustomSelectInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { BG_COLOR, INVOICE_COMPLETE_URL_CLIENT, TEXT_COLOR } from '@/utils/consts';
import { Box, Button, Container, Grid, Space, Table } from '@mantine/core';
import { useForm } from '@mantine/form';
import { checkNumber } from '@/utils/validations';
import Shell from '@/app/app/components/shell';
import { useState } from 'react';
import { calculate } from '@/app/app/calculator/utilities/calculate';
import { numberToUSD } from '@/server/utilities/formatters';
import { IconTrash } from '@tabler/icons-react';
import { CustomTooltip } from '@/components/customTooltip';
import { useRouter } from 'next/navigation'
import { CONFIG_DATA_CALCULATOR } from '@/app/app/calculator/utilities/config';

interface calculatorFormI {
  mount: number,
  productId: number,
  result: number
}

const INIT_VALUES: calculatorFormI = {
  mount: 0,
  productId: 0,
  result: 0,
}

const INSTRUCTION_FONT_SIZE: string = '1.3rem'

export default function CalculatorPage() {
  const [car, setCar] = useState<calculatorFormI[]>([])
  const router = useRouter()
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_VALUES,
    validate: {
      mount: (val) => (checkNumber(val) ? null : 'mount not valid'), 
      productId: (val) => (checkNumber(val) ? null : 'Product id not valid'),
      result: (val) => (checkNumber(val) ? null : 'Result not valid')
    },
  })

  const totalCar = car.reduce((acc, val) => acc + val.result, 0)
  const addToCar = () => {
    if (form.validate().hasErrors) return
    const newCar = [...car, form.getValues()]

    setCar(newCar)
    form.reset()
  } 

  const deleteRow = (element: calculatorFormI) => {
    setCar(prev => prev.filter(el => el !== element))
  }

  const createNewInvoice = () => {
    router.push(INVOICE_COMPLETE_URL_CLIENT + '/calculator/' + totalCar)
  }

  return (
    <Shell>
      <Container style={{ minWidth:'100%', minHeight:'87vh', backgroundColor: BG_COLOR }}>
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CustomText style={{ fontSize: '3rem', fontWeight: 'bold' }}>
            Calculator
          </CustomText>
          <Button disabled={car.length < 1} onClick={createNewInvoice}>
            Create a complete invoice
          </Button>
        </Box>
        <Space h="xl" />
        <Grid gutter="xl">
          <Grid.Col span={6}>
            <CustomSelectInput
              label='Product'
              showLabel={true}
              value={String(form.getValues().productId) ?? ''}
              onChange={(data => {
                form.setFieldValue('productId', Number(data))
                form.setFieldValue('result', calculate(form.getValues().mount, CONFIG_DATA_CALCULATOR[Number(data)].libData))
              })}
              errorText={form.errors?.productId ? String(form.errors?.productId) : undefined}
              isError={!!form.errors?.productId}
              data={CONFIG_DATA_CALCULATOR.map((product, index) => ({
                  label: product.title,
                  value: String(index)
                })
              )}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Box style={{ display: 'flex', gap: '.5rem' }}>
              <CustomText style={{ fontWeight: 'bold', fontSize: INSTRUCTION_FONT_SIZE }}>
                INSTRUCTION:
              </CustomText>
              <CustomText style={{ fontSize: INSTRUCTION_FONT_SIZE }}>
                {CONFIG_DATA_CALCULATOR[form.getValues().productId].instruction}
              </CustomText>
            </Box>
          </Grid.Col>
          <Grid.Col span={6}>
            <CustomNumberInput  
              label={CONFIG_DATA_CALCULATOR[form.getValues().productId].placeholder}
              showLabel={true}
              //value={form.getValues().mount}
              errorText={form.errors?.mount ? String(form.errors?.mount) : undefined}
              isError={!!form.errors?.mount}
              onChange={(data => {
                form.setFieldValue('mount', data)
                form.setFieldValue(
                  'result',
                  calculate(data, CONFIG_DATA_CALCULATOR[form.getValues().productId].libData)
                )
              })}
            />
          </Grid.Col>
          <Grid.Col span={6} style={{ display: 'flex', alignItems: 'end' }}>
            <Box style={{ display: 'flex', gap: '.5rem' }}>
              <CustomText style={{ fontWeight: 'bold', fontSize: INSTRUCTION_FONT_SIZE }}>
                Result: 
              </CustomText>
              <CustomText style={{ fontSize: INSTRUCTION_FONT_SIZE }}>
                {numberToUSD(form.getValues().result)}
              </CustomText>
            </Box>
          </Grid.Col> 
          <Grid.Col span={6} style={{ display: 'flex', alignItems: 'end' }}>
            <Button disabled={!form.getValues().mount} onClick={addToCar}>
              Add to cart
            </Button>
          </Grid.Col> 
          <Grid.Col span={6} style={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
            <Box style={{ display: 'flex', gap: '.5rem' }}>
              <CustomText style={{ fontWeight: 'bold', fontSize: INSTRUCTION_FONT_SIZE }}>
                Total cart: 
              </CustomText>
              <CustomText style={{ fontSize: INSTRUCTION_FONT_SIZE }}>
                {numberToUSD(totalCar)}
              </CustomText>
            </Box>
          </Grid.Col> 
        </Grid>
        <Space h="xl" />
        <Table stickyHeader stickyHeaderOffset={60} styles={{
          tbody: { color: TEXT_COLOR, fontSize: '1.3rem' },
          thead: { backgroundColor: 'transparent', fontSize: '1.5rem', color: TEXT_COLOR }
        }}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>Product</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Result</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{car.map((element, index) => {
            return <Table.Tr key={index}>
              <Table.Td>
                <CustomTooltip label='Delete row'>
                  <Button color='red' variant='subtle' onClick={() => deleteRow(element)}>
                    <IconTrash/>
                  </Button>
                </CustomTooltip>
              </Table.Td>
              <Table.Td>
                  {CONFIG_DATA_CALCULATOR[element.productId].title}
              </Table.Td>
              <Table.Td>
                  {element.mount}
              </Table.Td>
              <Table.Td>
                  {numberToUSD(element.result)}
              </Table.Td>
            </Table.Tr>
          })}</Table.Tbody>
        </Table>
      </Container>
    </Shell>
  )
}
