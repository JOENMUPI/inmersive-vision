import { useState } from "react"

export interface indxeListI {
  length: number
  initIndex: number
}

export const useIndexList = ({
  length,
  initIndex = 0
}: indxeListI) => {
  const [dataIndex, setDataIndex] = useState<number>(initIndex)

  const prevIndex = () => {
    setDataIndex(prev => prev === 0 ? length - 1 : prev - 1)
  }

  const nextIndex = () => {
    setDataIndex(prev => prev === length - 1 ? 0 : prev + 1)
  }

  return {
    dataIndex,
    nextIndex,
    prevIndex
  }
}