export interface adapterResponseI<T = object> {
  message: string
  hasError?: boolean
  payload?: T
}

export interface adapterResponseHttpI<T = object> extends adapterResponseI<T> {
  statusHttp: number;
}

// validation
export interface validatorManagerI<T, Y = string> {
  validateInsert: (data: T[]) => adapterResponseI<Array<T>>
  validateGet: (ids?: Y[]) => adapterResponseI<Array<T>>
  validateDelete: (ids: Y[]) => adapterResponseI<Array<T>>
  validateUpdate: (data: Array<updateBaseI<T, Y>>) => adapterResponseI<Array<T>>
}

// encrypt
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

export interface updateBaseI<Y, T = string> {
  currentId: T
  newData: Y
}

export interface anulateProps<Y = string> {
  ids: Y[]
  soft_deleted: boolean
  update_at: Date
}

interface commonColsModel {
  id?: number
  soft_deleted?: boolean
  created_at?: Date
  updated_at?: Date
} 

export interface clientModel extends commonColsModel {
  name: string
  email: string
  phone: string
  address: string 
}

export interface methodPaymentModel extends commonColsModel {
  company_name: string
  bank_name: string
  routing_num: string
  account_num: string
  zelle: string 
  url_qr?: string 
}

export interface installmentModel extends commonColsModel {
  project_id: number
  mount_pay: number
  installment_num: number
}

export interface projectModel extends commonColsModel {
  public_id: string
  total_installment: number
}

export interface userModel extends commonColsModel {
  email: string
  pass: string
  salt_pass: string
  session_token?: string 
  session_expire_at?: Date 
}

export interface permissionModel extends commonColsModel {
  description: string
}

export interface userPermissionModel extends Omit<commonColsModel, 'id'> {
  is_allowed: boolean
  user_id: number
  permission_id: number
  address: string 
}

export interface invoiceId {
  installment_id: number
  project_id: number
}

export interface invoiceModel extends Omit<commonColsModel, 'id'>, invoiceId  {
  method_payment_id: number
  client_id: number 
  public_id: string
  expiration_date: Date
  creation_date: Date
  ref_num_paid: string
}

export interface projectDescriptionModel extends commonColsModel {
  project_id: number
  description: string
  unitary_price: number
  element_num: number
  invoice_public_id: string 
}