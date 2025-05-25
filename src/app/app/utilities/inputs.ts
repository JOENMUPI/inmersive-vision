'use c;ient'
import { CustomInputI, CustomSelectInput, selectData } from "@/components/customInput"
import { useFetch } from "@/hooks/useFetch"
import { clientModel, methodPaymentModel } from "@/server/utilities/interfaces"
import { CLIENT_URL_SERVER, METHOD_PAYMENT_URL_SERVER } from "@/utils/consts"
import { fetchMethod } from "@/utils/enums"
import { useEffect, useState } from "react"

export const createLabelSelect = (id: string, value: string): string => {
  return id + ' - ' + value
}

export const ClientInput = ({
  errorText = 'Error',
  isError = false,
  label = 'Clients',
  onEnter,
  style,
  ref,
  value,
  component,
  onChange,
  disabled = false,
  showLabel = true,
  readOnly = false,
  extprops,
  dataSelected,
}: CustomInputI<string | null> & { dataSelected: (data: clientModel) => void }) => {
  const { sendF } = useFetch()
  const [data, setData] = useState<selectData[]>([])
  const [error, setError] = useState<string | null>(null)
  const clientMap = new Map()

  const _onChange = (id: string | null) => {
    if (dataSelected) {
      const _dataSelected = clientMap.get(id)
      
      if (!_dataSelected) setError('not found client for ' + id)
      else dataSelected(_dataSelected)
    } 

    onChange(id)
  }

  useEffect(() => {
    const sendGet = async () => {
      const responseServer = await sendF<clientModel[], clientModel[]>({
        endpoint: CLIENT_URL_SERVER,
        method: fetchMethod.GET
      })
  
      if (responseServer.hasError || !responseServer.payload) {
        setError(responseServer.hasError ? responseServer.message : 'Clients no has payload')
      } else  {
        const _data: selectData[] = responseServer.payload.map(val => {
          return {
            label: val.id ? createLabelSelect(String(val.id), val.name) : 'Id not found for ' + val.name,
            value: val.id ? String(val.id) : ''
          }
        }) ?? []
        
        setData(_data)
      } 
    }
    sendGet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    CustomSelectInput({
      label,
      onChange: _onChange,
      value,
      data,
      component,
      disabled,
      errorText: error ?? errorText,
      extprops,
      isError: !!error || isError,
      onEnter,
      readOnly,
      ref,
      showLabel,
      style
    })
  )
}

export const MethodPaymentInput = ({
  errorText = 'Error',
  isError = false,
  label = 'PAyment method',
  onEnter,
  style,
  ref,
  value,
  component,
  onChange,
  disabled = false,
  showLabel = true,
  readOnly = false,
  extprops,
  dataSelected
}: CustomInputI<string | null> & { dataSelected?: (data: methodPaymentModel) => void }) => {
  const { sendF } = useFetch()
  const [data, setData] = useState<selectData[]>([])
  const [error, setError] = useState<string | null>(null)
  const methodPaymentMap = new Map()

  const _onChange = (id: string | null) => {
    if (dataSelected) {
      const _dataSelected = methodPaymentMap.get(id)
      
      if (!_dataSelected) setError('not found payment method for ' + id)
      else dataSelected(_dataSelected)
    } 

    onChange(id)
  }

  useEffect(() => {
    const sendGet = async () => {
      const responseServer = await sendF<methodPaymentModel[], methodPaymentModel[]>({
        endpoint: METHOD_PAYMENT_URL_SERVER,
        method: fetchMethod.GET
      })
  
      if (responseServer.hasError || !responseServer.payload) {
        setError(responseServer.hasError ? responseServer.message : 'Payment method no has payload')
      } else  {
        const _data: selectData[] = responseServer.payload.map(val => {
          methodPaymentMap.set(val.id, val)
          return {
            label: val.id ? createLabelSelect(String(val.id), val.company_name) : 'Id not found for ' + val.company_name,
            value: val.id ? String(val.id) : ''
          }
        }) ?? []
        
        setData(_data)
      } 
    }
    sendGet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    CustomSelectInput({
      label,
      onChange: _onChange,
      value,
      data,
      component,
      disabled,
      errorText: error ?? errorText,
      extprops,
      isError: !!error || isError,
      onEnter,
      readOnly,
      ref,
      showLabel,
      style
    })
  )
}