import { adapterResponse } from "@/server/utilities/adapters"
import { httpToId } from "@/server/utilities/formatters"
import { adapterResponseI, invoiceId } from "@/server/utilities/interfaces"

export const invoiceIdHandler = ({
  installmentNums,
  projectIds,
  publicIds
}: { installmentNums: string[], projectIds: string[], publicIds?: string[]}): adapterResponseI<Array<invoiceId>> => {
  const invoiceIds: invoiceId[] = [] 
  
  if(installmentNums?.length !== projectIds?.length) {
    return adapterResponse({
      message: 'Installment_ids and project_ids no have same lenthg',
      hasError: true,
    })
  } 
  
  let publicIdsFormatted: adapterResponseI<string[]> | undefined
  if (publicIds) {
    publicIdsFormatted = httpToId<string>({ ids: publicIds, isOptional: false, isNumber: true })
    
    if (publicIdsFormatted.hasError) return adapterResponse({ message: publicIdsFormatted.message, hasError: true })
    if (!publicIdsFormatted.payload) adapterResponse({
      message: 'PublicIdsFormatted parser no has payload',
      hasError: true
    })
  }

  const installmentNumsFormatted = httpToId({ ids: installmentNums, isOptional: false, isNumber: true })
  
  if (installmentNumsFormatted.hasError) return adapterResponse({ message: installmentNumsFormatted.message, hasError: true })
  if (!installmentNumsFormatted.payload) adapterResponse({
    message: 'InstallmentNumsFormatted parser no has payload',
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
      installment_num: installmentNumsFormatted.payload![i],
      project_id: projectIdsFormatted.payload![i],
      public_id: publicIdsFormatted?.payload![i]
    })
  }

  return adapterResponse({
    message: 'All done',
    hasError: false,
    payload: invoiceIds
  }) 
}