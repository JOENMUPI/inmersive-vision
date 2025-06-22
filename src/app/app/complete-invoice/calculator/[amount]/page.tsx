'use client'
import Shell from '@/app/app/components/shell';
import { statePage } from '@/utils/enums';
import { useCredential } from '@/app/app/hooks/useCredentials';
import Page from '@/app/app/complete-invoice/components/completeInvoicePage';

export default function ProjectPages() {
  const { isValid } = useCredential()
  const path = window.location.pathname
  const parts = path.split('/')
  const amount = parts[parts.length - 1];
    
  if (!isValid) return <></> 
  return (
    <Shell>
      <Page initialState={statePage.CREATE} totalMount={parseFloat(amount)}/>
    </Shell>
  )
}
