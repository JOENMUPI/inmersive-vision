'use client'
import Shell from '@/app/app/components/shell';
import { useCredential } from '@/app/app/hooks/useCredentials';
import Page from '@/app/app/complete-invoice/components/completeInvoiceListPage';

export default function ProjectPages() {
  const { isValid } = useCredential()
    
  if (!isValid) return <></> 
  return (
    <Shell>
      <Page />
    </Shell>
  )
}
