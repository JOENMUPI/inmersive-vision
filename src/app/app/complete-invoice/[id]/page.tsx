'use client'
import Shell from '@/app/app/components/shell';
import { statePage } from '@/utils/enums';
import { useCredential } from '@/app/app/hooks/useCredentials';
import Page from '@/app/app/complete-invoice/components/completeInvoicePage';

export default function ProjectPages() {
  const { isValid } = useCredential()
  
  if (!isValid) return <></> 
  return (
    <Shell>
      <Page initialState={statePage.VIEW} />
    </Shell>
  )
}
