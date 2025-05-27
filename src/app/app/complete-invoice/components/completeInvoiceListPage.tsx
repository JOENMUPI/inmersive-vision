'use client'
import { CustomText } from '@/components/customText';
import { useFetch } from '@/hooks/useFetch';
import { completeInvoiceI } from '@/server/utilities/interfaces';
import { fetchMethod } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { Box, Button, Container, Space, Table } from '@mantine/core';
import { useEffect, useState } from 'react';
import { httpToCompleteInvoice } from '@/server/utilities/formatters';
import Link from 'next/link';
import {
  BG_COLOR,
  CLIENT_URL_CLIENT,
  INVOICE_COMPLETE_URL_CLIENT,
  INVOICE_COMPLETE_URL_SERVER,
  METHOD_PAYMENT_URL_CLIENT,
  PRIMARY_COLOR_HEX,
  PROJECT_URL_CLIENT,
  TEXT_COLOR
} from '@/utils/consts';

export default function ListPage() {
  const [data, setData] = useState<completeInvoiceI[]>([])
  const [refresh, setRefresh] = useState<boolean>(false)
  const { sendF } = useFetch()
  
  useEffect(() => {
    const sendGet = async () => {
      notifyShowBase({
        id: 'test',
        title: 'Geting data',
        message: 'Wait a momment..',
        loading: true
      })
  
      const responseServer = await sendF<completeInvoiceI[], completeInvoiceI[]>({
        endpoint: INVOICE_COMPLETE_URL_SERVER,
        method: fetchMethod.GET
      })

      if (!responseServer.hasError && responseServer.payload && responseServer.payload.length !== 0) {
        const completeInvoiceFormatted = httpToCompleteInvoice({ httpData: responseServer.payload! as never[], optionalFieldObligatory: true })
        
        if (!completeInvoiceFormatted.hasError && completeInvoiceFormatted.payload && completeInvoiceFormatted.payload.length !== 0) {
          setData(responseServer.payload)
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
            message: completeInvoiceFormatted.message,
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
    
    sendGet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  return (
    <Container style={{ minWidth:'100%', minHeight:'87vh', backgroundColor: BG_COLOR }}>
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CustomText style={{ fontSize: '3rem', fontWeight: 'bold' }}>
          CLIENT LIST
        </CustomText>
        <Button onClick={() => setRefresh(val => !val)} >
          Refresh data
        </Button>
      </Box>
      <Space h="xl" />
        <Table stickyHeader stickyHeaderOffset={60} styles={{
          tbody: { color: TEXT_COLOR, fontSize: '1.3rem' },
          thead: { backgroundColor: 'transparent', fontSize: '1.5rem', color: TEXT_COLOR }
        }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Invoice public id</Table.Th>
            <Table.Th>Project public id</Table.Th>
            <Table.Th>Client name</Table.Th>
            <Table.Th>Payment method</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{data.map(element => {
          return <Table.Tr key={element.invoice.public_id}>
            <Table.Td>
              <Link style={{ color: PRIMARY_COLOR_HEX }} href={INVOICE_COMPLETE_URL_CLIENT + '/' + element.invoice.public_id}>
                {element.invoice.public_id}
              </Link>
            </Table.Td>
            <Table.Td>
              <Link style={{ color: PRIMARY_COLOR_HEX }} href={PROJECT_URL_CLIENT + '/' + element.project.id}>
                {element.project.public_id}
              </Link>
            </Table.Td>
            <Table.Td>
              <Link style={{ color: PRIMARY_COLOR_HEX }} href={CLIENT_URL_CLIENT + '/' + element.client.id}>
                {element.client.name}
              </Link>
            </Table.Td>
            <Table.Td>
              <Link style={{ color: PRIMARY_COLOR_HEX }} href={METHOD_PAYMENT_URL_CLIENT + '/' + element.methodPayment.id}>
                {element.methodPayment.id}
              </Link>
            </Table.Td>
          </Table.Tr>
        })}</Table.Tbody>
      </Table>
    </Container>
  )
}
