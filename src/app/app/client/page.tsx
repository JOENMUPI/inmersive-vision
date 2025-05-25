'use client'
import Shell from '@/app/app/components/shell';
import { statePage } from '@/utils/enums';
import { useCredential } from '@/app/app/hooks/useCredentials';
import Page from '@/app/app/client/components/clientPage';

export default function ProjectPages() {
  const { isValid } = useCredential()
    
  if (!isValid) return <></> 
  return (
    <Shell>
      <Page initialState={statePage.CREATE}/>
    </Shell>
  )
}
