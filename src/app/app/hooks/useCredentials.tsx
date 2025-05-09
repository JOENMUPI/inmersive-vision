'use client'
import { useRouter } from "next/navigation"
import { hasCookie } from "@/app/app/utilities/cookie"
import { useEffect, useState } from "react"

export const useCredential = () => {
  const router = useRouter()
  const [isValid, setIsValid] = useState<boolean>(false)
  
  useEffect(() => {
    if (!hasCookie()) router.push('/app/login')
    else setIsValid(true)
  }, [router])

  return { isValid }
}