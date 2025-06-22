export interface libDataI {
  fts: number
  price: number
}

export interface productI {
  placeholder: string,
  instruction: string,
  title: string,
  value: string,
  libData: libDataI[]
}