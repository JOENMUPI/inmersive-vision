import { adapterResponse } from "@/server/utilities/adapters"
import { httpToId } from "@/server/utilities/formatters"
import { adapterResponseI, invoiceId } from "@/server/utilities/interfaces"

export const invoiceIdHandler = ({
  installmentIds,
  projectIds
}: { installmentIds: string[], projectIds: string[]}): adapterResponseI<Array<invoiceId>> => {
  const invoiceIds: invoiceId[] = [] 
  
  if(installmentIds?.length !== projectIds?.length) {
    return adapterResponse({
      message: 'Installment_ids and project_ids no have same lenthg',
      hasError: true,
    })
  } 

  const installmentIdsFormatted = httpToId({ ids: installmentIds, isOptional: false, isNumber: true })
  
  if (installmentIdsFormatted.hasError) return adapterResponse({ message: installmentIdsFormatted.message, hasError: true })
  if (!installmentIdsFormatted.payload) adapterResponse({
    message: 'InstallmentIdsFormatted parser no has payload',
    hasError: true
  })

  const projectIdsFormatted = httpToId({ ids: projectIds, isOptional: false, isNumber: true })
  
  if (projectIdsFormatted.hasError) return adapterResponse({ message: projectIdsFormatted.message, hasError: true })
  if (!projectIdsFormatted.payload) adapterResponse({
    message: 'ProjectIdsFormatted parser no has payload',
    hasError: true
  })

  for(let i = 0; i < projectIdsFormatted.payload!.length; i++) {
    invoiceIds.push({
      installment_id: installmentIdsFormatted.payload![i],
      project_id: projectIdsFormatted.payload![i]
    })
  }

  return adapterResponse({
    message: 'All done',
    hasError: false,
    payload: invoiceIds
  }) 
}