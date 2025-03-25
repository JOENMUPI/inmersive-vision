import { useState } from 'react'

const eviroment = process.env.NODE_ENV
const url = (eviroment === 'development')
  ? 'http://localhost:3000/api/'
  : process.env.SERVER_URL

export enum fetchMethod {
  POST='POST',
  GET='GET',
  PUT='PUT',
  DELETE='DELETE'
}

interface fetchI {
  method: fetchMethod
  endpoint: string
  body?: object
  token?: string
  signal?: AbortSignal
}

interface responseFetch {
  status: number
  body: {
    message: string
    body?: object
    hasError: boolean
  }
}

export const useFetch = (isLoading = false) => {
  const [loading, setLoading] = useState(isLoading)

  const sendF = async ({ method, endpoint, body, token, signal }: fetchI): Promise<responseFetch> => {
    try {
      setLoading(true)
      const headers = new Headers({ 'Content-Type': 'application/json' })

      if (token) headers.append('x-access-token', token)
      let options: RequestInit = { method, headers, mode: 'cors' }
      if (signal) options = { ...options, signal }
      if (body) options = { ...options, body: JSON.stringify(body) }
      const response = await fetch(url + endpoint, options)
      
      return { status: response.status, body: await response.json() }
    } catch (e) {
      console.error(e)
      const errRes: responseFetch = { status: 500, body: { message: '', hasError: true } } 
      if (e instanceof Error) errRes.body.message = e.message
      return errRes
    } finally {
      setLoading(false)
    }
  }

  return { sendF, loading }
}

