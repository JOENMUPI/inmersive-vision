'use client'
import { CustomText } from '@/components/customText';
import { useFetch } from '@/hooks/useFetch';
import { clientModel } from '@/server/utilities/interfaces';
import { BG_COLOR, CLIENT_URL_SERVER, PRIMARY_COLOR_HEX } from '@/utils/consts';
import { fetchMethod } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { Box, Button, Container, Space, Table } from '@mantine/core';
import { useEffect, useState } from 'react';
import { httpToClient } from '@/server/utilities/formatters';
import Link from 'next/link';

export default function ListPage() {
  const [data, setData] = useState<clientModel[]>([])
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
  
      const responseServer = await sendF<clientModel[], clientModel[]>({
        endpoint: CLIENT_URL_SERVER,
        method: fetchMethod.GET
      })

      if (!responseServer.hasError && responseServer.payload && responseServer.payload.length !== 0) {
        const clientFormatted = httpToClient({ httpData: responseServer.payload! as never[], optionalFieldObligatory: true })
        
        if (!clientFormatted.hasError && clientFormatted.payload && clientFormatted.payload.length !== 0) {
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
            message: clientFormatted.message,
            loading: false
          })
        }
      } else {
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
      <Table stickyHeader stickyHeaderOffset={60}>
        <Table.Thead styles={{ thead: { backgroundColor: 'transparent', fontSize: '1.5rem' } }}>
          <Table.Tr>
            <Table.Th>Id</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Adress</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{data.map(element => {
          return <Table.Tr key={element.id} style={{ fontSize: '1.3rem' }}>
            <Table.Td>
              <Link style={{ color: PRIMARY_COLOR_HEX }} href={String(element.id)}>
                {element.id}
              </Link>
            </Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.email}</Table.Td>
            <Table.Td>{element.phone}</Table.Td>
            <Table.Td>{element.address}</Table.Td>
          </Table.Tr>
        })}</Table.Tbody>
      </Table>
    </Container>
  )
}
