import { adapterResponse } from "@/server/utilities/adapters"
import { typePublicId } from "@/server/utilities/enums"
import { dateToUTC, numberToXXXX } from "@/server/utilities/formatters"
import { adapterResponseI } from "@/server/utilities/interfaces"

export const generatePublicId = ({ 
  typePublicId,
  lastPublicId
}: {lastPublicId?: string, typePublicId: typePublicId }): adapterResponseI<string> => {
  const dateRef = dateToUTC(new Date())
  const datePublicId = `${numberToXXXX(dateRef.getUTCDate(), 2)}${numberToXXXX(dateRef.getUTCMonth()+1, 2)}${dateRef.getUTCFullYear()}`
  let numPublicId = 1

  if (lastPublicId) {
    const [typeLastPublicId, dateLastPublicId, numLastPublicId] = lastPublicId.split('-')
    
    if (!typeLastPublicId || !dateLastPublicId || !numLastPublicId ||  Number.isNaN(Number(numLastPublicId))) {
      return adapterResponse({ message: 'Error desetructuring the last project pucblic id', hasError: true, payload: '' }) 
    } else if (typePublicId !== typeLastPublicId) {
      return adapterResponse({ message: 'Error match typePublicId', hasError: true, payload: '' }) 
    }
    
    if (datePublicId === dateLastPublicId) numPublicId = Number(numLastPublicId) + numPublicId
  }
  
  return adapterResponse({
    message: 'All done',
    hasError: false,
    payload: [typePublicId, datePublicId, numberToXXXX(numPublicId, 4)].join('-')
  })
} 