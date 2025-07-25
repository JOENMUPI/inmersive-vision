import { libDataI } from "@/app/app/calculator/utilities/interfaces"

  export const calculate = (mount: number, libData: libDataI[]): number => {
    let total: number = 0
    let ftsRest: number = mount
    
    for (let i = 0; i < libData.length; i++) {
      if (i === libData.length - 1) {
        total += ftsRest * libData[i].price
        ftsRest = 0
        break
      } else if (ftsRest < libData[i].fts) {
        total += ftsRest * libData[i].price
        ftsRest = 0
      } else if (i === 0) {
        total += libData[i].fts * libData[i].price
        ftsRest -= libData[i].fts
      } else if (ftsRest > (libData[i].fts - libData[i-1].fts)) {
          total += (libData[i].fts - libData[i-1].fts) * libData[i].price
          ftsRest -= (libData[i].fts - libData[i-1].fts)
      } else {
        total += ftsRest * libData[i].price
        ftsRest = 0
        break
      }
    }

    return total
  }
