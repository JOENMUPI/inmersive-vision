'use client'
import Shell from '@/app/app/components/shell';
import { CustomText } from '@/components/customText';
import { TEXT_COLOR_GRAY_2 } from '@/utils/consts';
import { Container } from '@mantine/core';
import { useCredential } from '@/app/app/hooks/useCredentials';

export default function Home() {
  const { isValid } = useCredential()

  if (!isValid) return <></> 
  return (
    <Shell>
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth:'100%', minHeight:'87vh' }}>
        <CustomText style={{ fontSize: '3rem', color: TEXT_COLOR_GRAY_2, fontWeight: 'bold' }}>
          Select any module in the navbar 
        </CustomText>
      </Container>
    </Shell>
  )
}
