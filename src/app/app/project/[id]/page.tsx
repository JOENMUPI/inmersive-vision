'use client'
import Shell from '@/app/app/components/shell';
import { statePage } from '@/utils/enums';
import { useCredential } from '@/app/app/hooks/useCredentials';
import ProjectPage from '@/app/app/project/components/projectPage';

export default function ProjectPages() {
  const { isValid } = useCredential()
  
  if (!isValid) return <></> 
  return (
    <Shell>
      <ProjectPage initialState={statePage.VIEW} />
    </Shell>
  )
}
