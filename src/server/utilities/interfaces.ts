export interface adapterResponseI<T = object> {
  message: string
  hasError?: boolean
  payload?: T
}

export interface adapterResponseHttpI<T = object> extends adapterResponseI<T> {
  statusHttp: number;
}

// validation
export interface validatorManagerI<T> {
  validateInsert: (data: T[]) => adapterResponseI<Array<T>>
  validateGet: (ids?: string[]) => adapterResponseI<Array<T>>
  validateDelete: (ids: string[]) => adapterResponseI<Array<T>>
  validateUpdate: (data: Array<updateBaseI<T>>) => adapterResponseI<Array<T>>
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

export interface updateBaseI<Y> {
  currentId: string
  newData: Y
}

export interface anulateProps {
  ids: string[]
  soft_deleted: boolean
  update_at: Date
}

interface commoncolsModel {
  id?: number
  soft_deleted?: boolean
  created_at?: Date
  updated_at?: Date
} 

export interface clientModel extends commoncolsModel {
  name: string
  email: string
  phone: string
  address: string 
}

export interface methodPaymentModel extends commoncolsModel {
  company_name: string
  bank_name: string
  routing_num: string
  account_num: string
  zelle: string 
  url_qr?: string 
}

export interface installmentModel extends commoncolsModel {
  project_id: number
  mount_pay: number
  installment_num: number
}

export interface projectModel extends commoncolsModel {
  public_id: string
  total_installment: number
}

export interface userModel extends commoncolsModel {
  email: string
  pass: string
  salt_pass: string
  session_token?: string 
  session_expire_at?: Date 
}

export interface permissionModel extends commoncolsModel {
  description: string
}

export interface userPermissionModel extends Omit<commoncolsModel, 'id'> {
  is_allowed: boolean
  user_id: number
  permission_id: number
  address: string 
}

export interface invoiceModel extends Omit<commoncolsModel, 'id'> {
  project_id: number
  method_payment_id: number
  installment_id: number
  client_id: number 
  public_id: string
  exporation_date: Date
  creation_date: Date
  ref_num_paid: string
}

export interface projectDescriptionModel extends commoncolsModel {
  project_id: number
  desciption: string
}

export interface projectDescriptionInviceModel extends Omit<commoncolsModel, 'id'> {
  unitary_price: string
  element_num: number
  project_description_id: string
  invoice_public_id: string 
}