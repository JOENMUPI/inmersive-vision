import { adapterResponse } from "@/server/utilities/adapters"
import { dateToUTC, numberToXXXX } from "@/server/utilities/formatters"
import { adapterResponseI } from "@/server/utilities/interfaces"

export const generatePublicId = (lastPublicId?: string): adapterResponseI<string> => {
  const dateRef = dateToUTC(new Date())
  const _datePublicId = `${numberToXXXX(dateRef.getUTCDate(), 2)}${numberToXXXX(dateRef.getUTCMonth()+1, 2)}${dateRef.getUTCFullYear()}`
  let _numPublicId = 1

  if (lastPublicId) {
    const [datePublicId, numPublicId] = lastPublicId.split('-')
    
    if (!datePublicId || !numPublicId ||  Number.isNaN(Number(numPublicId))) {
      return adapterResponse({ message: 'Error desetructuring the last project pucblic id', hasError: true, payload: '' }) 
    }
    
    if (_datePublicId === datePublicId) _numPublicId = Number(numPublicId) + _numPublicId
  }
  
  return adapterResponse({ message: 'All done', hasError: false, payload: _datePublicId + '-' + numberToXXXX(_numPublicId, 4) })
} 