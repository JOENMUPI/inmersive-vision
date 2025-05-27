'use client'
import { CustomText } from '@/components/customText';
import { useFetch } from '@/hooks/useFetch';
import { projectModel } from '@/server/utilities/interfaces';
import { BG_COLOR, PRIMARY_COLOR_HEX, PROJECT_URL_SERVER, TEXT_COLOR } from '@/utils/consts';
import { fetchMethod } from '@/utils/enums';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { Box, Button, Container, Space, Table } from '@mantine/core';
import { useEffect, useState } from 'react';
import { httpToProject } from '@/server/utilities/formatters';
import Link from 'next/link';

export default function ListPage() {
  const [data, setData] = useState<projectModel[]>([])
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
  
      const responseServer = await sendF<projectModel[], projectModel[]>({
        endpoint: PROJECT_URL_SERVER,
        method: fetchMethod.GET
      })

      if (!responseServer.hasError && responseServer.payload && responseServer.payload.length !== 0) {
        const projectFormatted = httpToProject({ httpData: responseServer.payload! as never[], optionalFieldObligatory: true })
        
        if (!projectFormatted.hasError && projectFormatted.payload && projectFormatted.payload.length !== 0) {
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
    
    sendGet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  return (
    <Container style={{ minWidth:'100%', minHeight:'87vh', backgroundColor: BG_COLOR }}>
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CustomText style={{ fontSize: '3rem', fontWeight: 'bold' }}>
          PROJECT LIST
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
            <Table.Th>Public id</Table.Th>
            <Table.Th>Total installments</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{data.map(element => {
          return <Table.Tr key={element.id}>
            <Table.Td>
              <Link style={{ color: PRIMARY_COLOR_HEX }} href={String(element.id)}>
                {element.id}
              </Link>
            </Table.Td>
            <Table.Td>{element.public_id}</Table.Td>
            <Table.Td>{element.total_installment}</Table.Td>
          </Table.Tr>
        })}</Table.Tbody>
      </Table>
    </Container>
  )
}
