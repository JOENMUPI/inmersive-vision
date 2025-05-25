import { libDataI } from "@/app/app/calculator/utilities/interfaces"

export const calculate = (mount: number, libData: libDataI[]): number => {
  let total: number = 0
  let ftsRest: number = mount
  
  for (let i = 0; i < libData.length; i++) {
    if (i === libData.length - 1) {
      total += ftsRest * libData[i].price
      ftsRest = 0
      break
    } else if (mount > libData[i].fts) {
      if (ftsRest > libData[i].fts) {
        total += libData[i].fts * libData[i].price
        ftsRest -= libData[i].fts
      }
    } else {
      total += ftsRest * libData[i].price
      ftsRest = 0
      break
    }
  }

  return total
}
