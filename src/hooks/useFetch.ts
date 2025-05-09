import { adapterResponseI } from '@/server/utilities/interfaces'
import { fetchMethod } from '@/utils/enums'
import { useState } from 'react'

interface fetchI<T = object> {
  method: fetchMethod
  endpoint: string
  body?: T
  token?: string
  signal?: AbortSignal
}

type responseFetch<T> = adapterResponseI<T>

export const useFetch = (isLoading = false) => {
  const [loading, setLoading] = useState(isLoading)

  const sendF = async <T, Y = object>({ method, endpoint, body, token, signal }: fetchI<Y>): Promise<responseFetch<T>> => {
    try {
      setLoading(true)
      const headers = new Headers({ 'Content-Type': 'application/json' })

      if (token) headers.append('x-access-token', token)
      
      let options: RequestInit = { method, headers, mode: 'cors' }
      
      if (signal) options = { ...options, signal }
      if (body) options = { ...options, body: JSON.stringify(body) }
      
      const response = await fetch(endpoint, options)
      const dataRes = await response.json()
      
      return { ...dataRes }
    } catch (e) {
      console.error(e)
      const errRes: responseFetch<T> = { message: 'Unexpected error, try later', hasError: true } 
      
      if (e instanceof Error) errRes.message = e.message
      return errRes
    } finally {
      setLoading(false)
    }
  }

  return { sendF, loading }
}
