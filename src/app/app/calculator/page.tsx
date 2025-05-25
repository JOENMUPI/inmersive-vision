'use client'
import { CustomNumberInput, CustomSelectInput } from '@/components/customInput';
import { CustomText } from '@/components/customText';
import { BG_COLOR } from '@/utils/consts';
import { Box, Button, Container, Grid, Space, Table } from '@mantine/core';
import { useForm } from '@mantine/form';
import { checkNumber } from '@/utils/validations';
import { serviceI } from '@/app/app/calculator/utilities/interfaces';
import Shell from '../components/shell';
import { useState } from 'react';
import { calculate } from './utilities/calculate';
import { numberToUSD } from '@/server/utilities/formatters';
import { IconTrash } from '@tabler/icons-react';
import { CustomTooltip } from '@/components/customTooltip';

interface calculatorFormI {
  mount: number,
  serviceId: number,
  productId: number,
  result: number
}

const CONFIG_DATA: serviceI[] = [
  {
    name: 'Tours',
    products: [
      {
        title: 'Standard 360º Virtual Tour',
        value: 'standarTour',
        placeholder: 'Total units',
        instruction: "Insert number of properties 'Size limit 4.000 square feet'.",
        libData: [
          {
            fts: 1,
            price: 650
          }
        ]
      }
    ]
  }, {
    name: 'Renders',
    products: [
      {
        title: 'Flat Rendering',
        value: 'flatRender',
        placeholder: 'Total Renders',
        instruction: "You must insert in the box the number of rendered images required for your project.",
        libData: [
          {
            fts: 1,
            price: 100
          }
        ]
      }, {
        title: '360° Rendering',
        value: 'sphericRender',
        placeholder: 'Total Renders',
        instruction: "First choose the number of renderers and insert it into 'Total Renders'.",
        libData: [
          {
            fts: 1,
            price: 150
          }
        ]
      }
    ]
  }, {
    name: 'Modeling',
    products: [
      {
        title: 'Landscape Modeling',
        value: 'landScapeModeling',
        placeholder: 'Total models',
        instruction: "First choose the number of models and insert it in 'Total models'.",
        libData: [
          {
            fts: 1,
            price: 250
          }
        ]
      }, {
        title: 'Interior Modeling',
        value: 'interiorModeling',
        placeholder: 'Total feets/meters',
        instruction: "First choose the number of models and insert it in 'Total feets/meters'.",
        libData: [
          {
            fts: 1,
            price: 250
          }
        ]
      }, {
        title: 'Building Modeling',
        value: 'buildingModeling',
        placeholder: 'Total models',
        instruction: "First choose the number of models and insert it in 'Total models'.",
        libData: [
          {
            fts: 1,
            price: 250
          }
        ]
      }
    ]
  }, {
    name: 'Floor Plan',
    products: [
      {
        title: 'Large Marketing',
        placeholder: 'Total floor plans',
        value: 'largeMarketing',
        instruction: "First choose the number of floor plans and insert it in the box 'Total floor plans'. (The large package is for 4.000 SF TO 8.000 SF).",
        libData: [
          {
            fts: 1,
            price: 250
          }
        ]
      }
    ]
  },
]

const INIT_VALUES: calculatorFormI = {
  mount: 0,
  productId: 0,
  result: 0,
  serviceId: 0
}

const INSTRUCTION_FONT_SIZE: string = '1.3rem'

export default function CalculatorPage() {
  const [car, setCar] = useState<calculatorFormI[]>([])
  
  const form = useForm({
    mode: 'controlled',
    initialValues: INIT_VALUES,
    validate: {
      mount: (val) => (checkNumber(val) ? null : 'mount not valid'), 
      serviceId: (val) => (checkNumber(val) ? null : 'Service id not valid'), 
      productId: (val) => (checkNumber(val) ? null : 'Product id not valid'),
      result: (val) => (checkNumber(val) ? null : 'Result not valid')
    },
  })

  const addToCar = () => {
    if (form.validate().hasErrors) return
    const newCar = [...car, form.getValues()]

    setCar(newCar)
    form.reset()
  } 

  const deleteRow = (element: calculatorFormI) => {
    setCar(prev => prev.filter(el => el !== element))
  }

  return (
    <Shell>
      <Container style={{ minWidth:'100%', minHeight:'87vh', backgroundColor: BG_COLOR }}>
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CustomText style={{ fontSize: '3rem', fontWeight: 'bold' }}>
            Calculator
          </CustomText>
          <Button disabled={car.length < 1}>
            Create a complete invoice
          </Button>
        </Box>
        <Space h="xl" />
        <Grid gutter="xl">
          <Grid.Col span={6}>
            <CustomSelectInput
              label='Service'
              showLabel={true}
              value={String(form.getValues().serviceId) ?? ''}
              onChange={(data => form.setFieldValue('serviceId', Number(data)))}
              errorText={form.errors?.serviceId ? String(form.errors?.serviceId) : undefined}
              isError={!!form.errors?.serviceId}
              data={CONFIG_DATA.map((service, index) => ({
                  label: service.name,
                  value: String(index)
                })
              )}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <CustomSelectInput
              label='Product'
              showLabel={true}
              value={String(form.getValues().productId) ?? ''}
              onChange={(data => form.setFieldValue('productId', Number(data)))}
              errorText={form.errors?.productId ? String(form.errors?.productId) : undefined}
              isError={!!form.errors?.productId}
              data={CONFIG_DATA[form.getValues().serviceId].products.map((product, index) => ({
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
                {CONFIG_DATA[form.getValues().serviceId].products[form.getValues().productId].instruction}
              </CustomText>
            </Box>
          </Grid.Col>
          <Grid.Col span={6}>
            <CustomNumberInput  
              label={CONFIG_DATA[form.getValues().serviceId].products[form.getValues().productId].placeholder}
              showLabel={true}
              value={form.getValues().mount}
              errorText={form.errors?.mount ? String(form.errors?.mount) : undefined}
              isError={!!form.errors?.mount}
              onChange={(data => {
                form.setFieldValue('mount', data)
                form.setFieldValue(
                  'result',
                  calculate(data, CONFIG_DATA[form.getValues().serviceId].products[form.getValues().productId].libData)
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
                {numberToUSD(form.getValues().mount)}
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
                Total car: 
              </CustomText>
              <CustomText style={{ fontSize: INSTRUCTION_FONT_SIZE }}>
                {numberToUSD(car.reduce((acc, val) => acc + val.mount, 0))}
              </CustomText>
            </Box>
          </Grid.Col> 
        </Grid>
        <Space h="xl" />
        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead styles={{ thead: { backgroundColor: 'transparent', fontSize: '1.5rem' } }}>
            <Table.Tr>
              <Table.Th />
              <Table.Th>Service</Table.Th>
              <Table.Th>Product</Table.Th>
              <Table.Th>Mount</Table.Th>
              <Table.Th>Result</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{car.map((element, index) => {
            return <Table.Tr key={index} style={{ fontSize: '1.3rem' }}>
              <Table.Td>
                <CustomTooltip label='Delete row'>
                  <Button color='red' variant='subtle' onClick={() => deleteRow(element)}>
                    <IconTrash/>
                  </Button>
                </CustomTooltip>
              </Table.Td>
              <Table.Td>
                  {CONFIG_DATA[element.serviceId].name}
              </Table.Td>
              <Table.Td>
                  {CONFIG_DATA[element.serviceId].products[element.productId].title}
              </Table.Td>
              <Table.Td>
                  {element.mount}
              </Table.Td>
              <Table.Td>
                  {numberToUSD(element.mount)}
              </Table.Td>
            </Table.Tr>
          })}</Table.Tbody>
        </Table>
      </Container>
    </Shell>
  )
}
