import { selectData } from "@/components/customInput"
import { templateFormKeys } from "@/server/modules/form/domain/enums"

export interface data9I {
  title: string,
  img: string
  url: string,
}

export interface data8I {
  title: string,
  call: string,
  companyName: string,
  terms: string
  templateId: templateFormKeys,
  beds: selectData[],
  purchase: selectData[],
}

interface questionI {
  question: string
  response: string
}

interface sectionI {
  questions: questionI[]
  title: string
}

export interface data7I {
  title: string,
  description: string,
  sections: sectionI[]
}

export interface data6I {
  title: string,
  url: string,
}

export interface dataUnit5I {
  title: string,
  img: string,
  units: unitI[]
}

export interface data5I {
  title: string,
  subTitle: string,
  units: dataUnit5I[]
}

export interface data4I {
  imgs: string[],
}

interface unitI {
  title: string,
  description: string,
}

export interface data3I {
  bgImg: string,
  units: unitI[]
}

export interface data2I {
  title: string,
  text: string,
}

export interface data1I {
  title: string,
  bgImg: string,
}

export interface dataAllI {
  data1: data1I,
  data2: data2I,
  data3: data3I,
  data4: data4I,
  data5: data5I,
  data6: data6I,
  data7: data7I,
  data8: data8I,
  data9: data9I[],
}