'use c;ient'
import { CustomInputI, CustomSelectInput, selectData } from "@/components/customInput"
import { useFetch } from "@/hooks/useFetch"
import { clientModel, methodPaymentModel, projectModel } from "@/server/utilities/interfaces"
import { CLIENT_URL_SERVER, METHOD_PAYMENT_URL_SERVER, PROJECT_URL_SERVER } from "@/utils/consts"
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
  const [clientMap, setClientMap] = useState<Map<string, clientModel>>(new Map())
  const [error, setError] = useState<string | null>(null)

  const _onChange = (id: string | null) => {
    if (dataSelected) {
      const _dataSelected = clientMap.get(id ?? '')
      
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
          setClientMap(prev=> prev.set(String(val.id), val))
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
  label = 'Payment method',
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
  const [methodPaymentMap, setMethodPaymentMap] = useState<Map<string, methodPaymentModel>>(new Map())

  const _onChange = (id: string | null) => {
    if (dataSelected) {
      const _dataSelected = methodPaymentMap.get(id ?? '')
      
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
          setMethodPaymentMap(prev => prev.set(String(val.id), val))
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

export const ProjectInput = ({
  errorText = 'Error',
  isError = false,
  label = 'Projects',
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
}: CustomInputI<string | null> & { dataSelected?: (data: projectModel) => void }) => {
  const { sendF } = useFetch()
  const [data, setData] = useState<selectData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [projectMap, setProjectMap] = useState<Map<string, projectModel>>(new Map())

  const _onChange = (id: string | null) => {
    if (dataSelected) {
      const _dataSelected = projectMap.get(id ?? '')
      
      if (!_dataSelected) setError('not found project for ' + id)
      else dataSelected(_dataSelected)
    } 

    onChange(id)
  }

  useEffect(() => {
    const sendGet = async () => {
      const responseServer = await sendF<projectModel[], projectModel[]>({
        endpoint: PROJECT_URL_SERVER,
        method: fetchMethod.GET
      })
  
      if (responseServer.hasError || !responseServer.payload) {
        setError(responseServer.hasError ? responseServer.message : 'Project no has payload')
      } else  {
        const _data: selectData[] = responseServer.payload.map(val => {
          setProjectMap(prev => prev.set(String(val.id), val))
          return {
            label: val.id ? createLabelSelect(String(val.id), val.public_id) : 'Id not found for ' + val.public_id,
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