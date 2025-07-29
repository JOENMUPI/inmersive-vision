'use methodPayment'
import { CustomText } from '@/components/customText';
import { useFetch } from '@/hooks/useFetch';
import { methodPaymentModel } from '@/server/utilities/interfaces';
import { BG_COLOR, METHOD_PAYMENT_URL_SERVER, PRIMARY_COLOR_HEX, TEXT_COLOR } from '@/utils/consts';
import { fetchMethod } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { Box, Button, Container, Space, Table } from '@mantine/core';
import { useEffect, useState } from 'react';
import { httpToMethodPayment } from '@/server/utilities/formatters';
import Link from 'next/link';

export default function ListPage() {
  const [data, setData] = useState<methodPaymentModel[]>([])
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
  
      const responseServer = await sendF<methodPaymentModel[], methodPaymentModel[]>({
        endpoint: METHOD_PAYMENT_URL_SERVER,
        method: fetchMethod.GET
      })

      console.log('responseServer', responseServer)

      if (!responseServer.hasError && responseServer.payload && responseServer.payload.length !== 0) {
        const methodPaymentFormatted = httpToMethodPayment({ httpData: responseServer.payload! as never[], optionalFieldObligatory: true })
        
        if (!methodPaymentFormatted.hasError && methodPaymentFormatted.payload && methodPaymentFormatted.payload.length !== 0) {
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
    
    sendGet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  return (
    <Container style={{ minWidth:'100%', minHeight:'87vh', backgroundColor: BG_COLOR }}>
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CustomText style={{ fontSize: '3rem', fontWeight: 'bold' }}>
          PAYMENT METHOD LIST
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
            <Table.Th>Id</Table.Th>
            <Table.Th>Company name</Table.Th>
            <Table.Th>Bank name</Table.Th>
            <Table.Th>Account number</Table.Th>
            <Table.Th>Routing number</Table.Th>
            <Table.Th>Zelle</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{data.map(element => {
          return <Table.Tr key={element.id}>
            <Table.Td>
              <Link style={{ color: PRIMARY_COLOR_HEX }} href={String(element.id)}>
                {element.id}
              </Link>
            </Table.Td>
            <Table.Td>{element.company_name}</Table.Td>
            <Table.Td>{element.bank_name}</Table.Td>
            <Table.Td>{element.account_num}</Table.Td>
            <Table.Td>{element.routing_num}</Table.Td>
            <Table.Td>{element.zelle}</Table.Td>
          </Table.Tr>
        })}</Table.Tbody>
      </Table>
    </Container>
  )
}
