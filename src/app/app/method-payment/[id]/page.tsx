'use client'
import Shell from '@/app/app/components/shell';
import { statePage } from '@/utils/enums';
import { useCredential } from '@/app/app/hooks/useCredentials';
import Page from '@/app/app/method-payment/components/methodPayment';

export default function IdPages() {
  const { isValid } = useCredential()
  
  if (!isValid) return <></> 
  return (
    <Shell>
      <Page initialState={statePage.VIEW} />
    </Shell>
  )
}
