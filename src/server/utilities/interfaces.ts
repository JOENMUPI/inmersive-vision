
export interface hashPropI {
  hash: string,
  salt: string
}

export interface encrypManagerI {
  decryptAES: (text: string) => string
  encryptAES: (text: string) => string
  encryptSHA256: (text: string, salt?: string) => hashPropI
  checkSHA256: (hash: hashPropI, textToCompare: string) => boolean
}

export interface updateBaseI<Y> {
  currentId: string
  newData: Y
}

export interface anulateProps {
  ids: string[]
  soft_deleted: boolean
  update_at: Date
}

export interface clientModel {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  soft_deleted?: string;
  created_at?: Date;
  updated_at?: Date;
}
