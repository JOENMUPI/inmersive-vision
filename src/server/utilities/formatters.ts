import { StaticImageData } from "next/image";
import { adapterResponse } from "@/server/utilities/adapters";
import {
  adapterResponseI,
  anulateProps,
  clientModel,
  httpToDataI,
  httpToIdI,
  installmentModel,
  invoiceModel,
  methodPaymentModel,
  permissionModel,
  projectDescriptionModel,
  projectModel,
  updateBaseI,
  userModel,
  userPermissionModel
} from "@/server/utilities/interfaces";
import { loginI } from "../modules/user/domain/interfaces";

export function formatDateToDDMMYYYY(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

export const imgToBytes = async (img: StaticImageData) => {
  const response = await fetch(img.src);
  const blobImg = await response.blob();
  const arrayBuffer = await blobImg.arrayBuffer();
  return new Uint8Array(arrayBuffer); 
} 

export function numberToUSD(value: number): string {
  return value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export const base64ToByteArray = (base64: string): Uint8Array<ArrayBuffer> => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const stringToHex = (text: string): string => {
  return Buffer.from(text, 'utf-8').toString('hex')
}

export const hexToString = (hex: string): string => {
  const _hex = hex.includes('x') ? hex.split('x')[1] : hex 
  
  let stringResponse = ''
  for (let i = 0; i < _hex.length; i += 2) {
    const byte = _hex.slice(i, i + 2)
    stringResponse += String.fromCharCode(parseInt(byte, 16))
  }

  return stringResponse;
}

export const dateToUTC = (localDate: Date): Date => {
  const yearNum = localDate.getUTCFullYear()
  const monthNum = localDate.getUTCMonth()
  const dayNum = localDate.getUTCDate()
  const hourNum = localDate.getUTCHours()
  const minuteNum = localDate.getUTCSeconds()
  const secNum = localDate.getUTCMilliseconds()

  return new Date(Date.UTC(yearNum, monthNum, dayNum, hourNum, minuteNum, secNum));
}

export const numberToXXXX = (num: number, length: number): string => {
  return String(num).padStart(length, '0');
}

export const reqQueryToArray = (param: string | string[]):string[] => {
  return Array.isArray(param) ?  param : [param]
} 

const stringToBoolean = (boolStr: string): boolean => {
  return 'true' === boolStr
}

export const httpToId = <T extends number | string = number>({ ids, isOptional, isNumber }: httpToIdI): adapterResponseI<Array<T>> => {
  if (!Array.isArray(ids) || (isOptional && ids.length === 0)) {
    return adapterResponse({ message: 'Id is not an array or no have data', hasError: true })
  }

  const idsFormatted: T[] = []
  for (const id of ids) {
    if (!id) return adapterResponse({ message: 'Id is undefined', hasError: true })
  
    idsFormatted.push((isNumber ? Number(id) : String(id)) as T)
  }

  return adapterResponse({ message: 'All done', payload: idsFormatted })
}

export const httpToUpdateBase = <T, Y = number>({
  httpParamId,
  dataHandler,
  idHandler,
  httpData
}: {
  httpParamId: string
  httpData: never,
  dataHandler: (prop: httpToDataI) => adapterResponseI<Array<T>>
  idHandler: (prop: httpToIdI) => adapterResponseI<Array<Y>>
}): adapterResponseI<updateBaseI<T,Y>> => {
  if (!httpParamId || !httpData) return adapterResponse({ message: 'httpData or httpParamId no has data', hasError: true })
  if (Array.isArray(httpData)) return adapterResponse({ message: 'httpData is an array, must be an object', hasError: true })
  const _currentId = idHandler({ ids: [httpParamId], isOptional: false, isNumber: true })
  
  if (_currentId.hasError) return adapterResponse({ message: _currentId.message, hasError: true })
  if (!_currentId.payload || _currentId.payload.length === 0) return adapterResponse({ message: '_currentId no has payload', hasError: true })

  const _newData = dataHandler({ httpData: [httpData], optionalFieldObligatory: true })
  
  if (_newData.hasError) return adapterResponse({ message: _newData.message, hasError: true })
  if (!_newData.payload || _newData.payload.length === 0) return adapterResponse({ message: '_newData no has payload', hasError: true })
  
  const response: updateBaseI<T, Y> = {
    currentId: _currentId.payload[0],
    newData: _newData.payload[0]
  } 

  return adapterResponse({ message: 'All done', hasError: false, payload: response }) 
}

export const httpToAnulateBase = <Y extends number | string = number>({
  idHandler,
  httpData
}: {
  httpData: never,
  idHandler: (prop: httpToIdI) => adapterResponseI<Array<Y>>
}): adapterResponseI<anulateProps<Y>> => {
  const { ids, soft_deleted, update_at } = httpData

  if (!ids || !update_at || soft_deleted === undefined) {
    return adapterResponse({ message: 'httpData no has "currentId" or "newData"', hasError: true })
  }
  
  const _Ids = idHandler({ ids: [...ids], isOptional: false, isNumber: true })
    
  if (_Ids.hasError) return adapterResponse({ message: _Ids.message, hasError: true })
  if (!_Ids.payload || _Ids.payload.length === 0) return adapterResponse({ message: '_currentId no has payload', hasError: true })

  const response: anulateProps<Y> = {
    ids: _Ids.payload,
    soft_deleted: !!soft_deleted,
    update_at: dateToUTC(new Date(update_at))
  }

  return adapterResponse({ message: 'All done', hasError: true, payload: response }) 
}

export const httpToClient = ({ httpData, optionalFieldObligatory }: httpToDataI): adapterResponseI<Array<clientModel>> => {
  if (!Array.isArray(httpData) || httpData.length === 0) {
    return adapterResponse({ message: 'clientsHttp is not an array or no have data', hasError: true })
  } 

  const clientsFormatted: clientModel[] = []

  for (const client of httpData) {
    if (typeof client !== 'object') {
      return adapterResponse({ message: 'clientsHttp no has a objent', hasError: true })
    }
  
    const { address, email, name, phone, created_at, id, soft_deleted, updated_at } = client
    
    if (!address || !email || !name || !phone) {
      return adapterResponse({ message: 'Obligatory keys is undefined (address, email, name, phone)', hasError: true })
    }
  
    const _client: clientModel = {
      address: String(address),
      email: String(email),
      name: String(name),
      phone: String(phone)
    }
  
    if (optionalFieldObligatory) {
      if (!created_at || !id || soft_deleted === undefined || !updated_at) {
        return adapterResponse({ message: 'Optional keys is undefined (created_at, soft_deleted, updated_at, id)', hasError: true })
      }
      
      _client.id = Number(id)
      _client.created_at = dateToUTC(new Date(created_at))
      _client.soft_deleted = stringToBoolean(soft_deleted)
      _client.updated_at = dateToUTC(new Date(updated_at))
    }
    
    clientsFormatted.push(_client)
  }
  
  return adapterResponse({ message: 'All done', payload: clientsFormatted })
}

export const httpToInstallment = ({ httpData, optionalFieldObligatory }: httpToDataI): adapterResponseI<Array<installmentModel>> => {
  if (!Array.isArray(httpData) || httpData.length === 0) {
    return adapterResponse({ message: 'installmentsHttp is not an array or no have data', hasError: true })
  } 

  const installmentsFormatted: installmentModel[] = []

  for (const installment of httpData) {
    if (typeof installment !== 'object') {
      return adapterResponse({ message: 'installmentsHttp no has a objent', hasError: true })
    }
  
    const { installment_num, mount_pay, project_id, created_at, id, soft_deleted, updated_at } = installment
    
    if (!installment_num || !mount_pay || !project_id) {
      return adapterResponse({ message: 'Obligatory keys is undefined (installment_num, mount_pay, project_id)', hasError: true })
    }
  
    const _installment: installmentModel = {
      installment_num: Number(installment_num),
      mount_pay: Number(mount_pay),
      project_id: Number(project_id)
    }
  
    if (optionalFieldObligatory) {
      if (!created_at || !id || soft_deleted === undefined || !updated_at) {
        return adapterResponse({ message: 'Optional keys is undefined (created_at, id, soft_deleted, updated_at)', hasError: true })
      }
      
      _installment.id = Number(id)
      _installment.created_at = dateToUTC(new Date(created_at))
      _installment.soft_deleted = stringToBoolean(soft_deleted)
      _installment.updated_at = dateToUTC(new Date(updated_at))
    }
    
    installmentsFormatted.push(_installment)
  }
  
  return adapterResponse({ message: 'All done', payload: installmentsFormatted })
}

export const httpToProject = ({ httpData, optionalFieldObligatory }: httpToDataI): adapterResponseI<Array<projectModel>> => {
  if (!Array.isArray(httpData) || httpData.length === 0) {
    return adapterResponse({ message: 'projectsHttp is not an array or no have data', hasError: true })
  } 

  const projectsFormatted: projectModel[] = []

  for (const project of httpData) {
    if (typeof project !== 'object') {
      return adapterResponse({ message: 'ProjectsHttp no has a objent', hasError: true })
    }
  
    const { total_installment, public_id, created_at, id, soft_deleted, updated_at } = project
    
    if (!total_installment || !public_id) {
      return adapterResponse({ message: 'Obligatory keys is undefined (total_installment, public_id)', hasError: true })
    }
  
    const _project: projectModel = {
      total_installment: Number(total_installment),
      public_id: String(public_id), 
    }
  
    if (optionalFieldObligatory) {
      if (!created_at || !id || soft_deleted === undefined || !updated_at) {
        return adapterResponse({ message: 'Optional keys is undefined (created_at, soft_deleted ,updated_at, id)', hasError: true })
      }
      
      _project.id = Number(id)
      _project.created_at = dateToUTC(new Date(created_at))
      _project.soft_deleted = stringToBoolean(soft_deleted)
      _project.updated_at = dateToUTC(new Date(updated_at))
    }
    
    projectsFormatted.push(_project)
  }
  
  return adapterResponse({ message: 'All done', payload: projectsFormatted })
}

export const httpToMethodPayment = ({ httpData, optionalFieldObligatory }: httpToDataI): adapterResponseI<Array<methodPaymentModel>> => {
  if (!Array.isArray(httpData) || httpData.length === 0) {
    return adapterResponse({ message: 'methodPaymentsHttp is not an array or no have data', hasError: true })
  } 

  const methodPaymentsFormatted: methodPaymentModel[] = []

  for (const methodPayment of httpData) {
    if (typeof methodPayment !== 'object') {
      return adapterResponse({ message: 'MethodPaymentsHttp no has a objent', hasError: true })
    }
  
    const { bank_name, company_name, routing_num, url_qr, account_num, zelle, created_at, id, soft_deleted, updated_at } = methodPayment
    
    if (!bank_name || !account_num || !company_name || !routing_num || !zelle) {
      return adapterResponse({
        message: 'Obligatory keys is undefined (bank_name, account_num, company_name, routing_num, zelle)',
        hasError: true
      })
    }
  
    const _methodPayment: methodPaymentModel = {
      account_num: String(account_num),
      bank_name: String(bank_name),
      company_name: String(company_name),
      routing_num: String(routing_num),
      zelle: String(zelle),
      url_qr: url_qr ? String(url_qr) : undefined
    }
  
    if (optionalFieldObligatory) {
      if (!created_at || !id || soft_deleted === undefined || !updated_at) {
        return adapterResponse({ message: 'Optional keys is undefined (created_at, soft_deleted ,updated_at, id)', hasError: true })
      }
      
      _methodPayment.id = Number(id)
      _methodPayment.created_at = dateToUTC(new Date(created_at))
      _methodPayment.soft_deleted = stringToBoolean(soft_deleted)
      _methodPayment.updated_at = dateToUTC(new Date(updated_at))
    }
    
    methodPaymentsFormatted.push(_methodPayment)
  }
  
  return adapterResponse({ message: 'All done', payload: methodPaymentsFormatted })
}

export const httpToInvoice = ({ httpData, optionalFieldObligatory }: httpToDataI): adapterResponseI<Array<invoiceModel>> => {
  if (!Array.isArray(httpData) || httpData.length === 0) {
    return adapterResponse({ message: 'InvoicesHttp is not an array or no have data', hasError: true })
  } 

  const invoicesFormatted: invoiceModel[] = []

  for (const invoice of httpData) {
    if (typeof invoice !== 'object') {
      return adapterResponse({ message: 'InvoicesHttp no has a objent', hasError: true })
    }
  
    const {
      creation_date,
      expiration_date,
      public_id,
      client_id,
      project_id,
      created_at,
      method_payment_id,
      soft_deleted,
      updated_at,
      installment_id,
    } = invoice
    
    if (!installment_id || !client_id || !creation_date || !expiration_date || !public_id || !project_id || !method_payment_id) {
      return adapterResponse({
        message: 'Obligatory keys is undefined (creation_date, client_id, expiration_date, public_id, project_id, method_payment_id, installment_id)',
        hasError: true
      })
    }
  
    const _invoice: invoiceModel = {
      creation_date: dateToUTC(new Date(creation_date)),
      expiration_date: dateToUTC(new Date(expiration_date)),
      public_id: String(public_id),
      project_id: Number(project_id),
      client_id: Number(client_id),
      method_payment_id: Number(method_payment_id),
      installment_id: Number(installment_id)
    }
  
    if (optionalFieldObligatory) {
      if (!created_at || soft_deleted === undefined || !updated_at) {
        return adapterResponse({ message: 'Optional keys is undefined (created_at, soft_deleted ,updated_at)', hasError: true })
      }
      
      _invoice.created_at = dateToUTC(new Date(created_at))
      _invoice.soft_deleted = stringToBoolean(soft_deleted)
      _invoice.updated_at = dateToUTC(new Date(updated_at))
    }
    
    invoicesFormatted.push(_invoice)
  }
  
  return adapterResponse({ message: 'All done', payload: invoicesFormatted })
}

export const httpToProjectDescription = ({
  httpData,
  optionalFieldObligatory
}: httpToDataI): adapterResponseI<Array<projectDescriptionModel>> => {
  if (!Array.isArray(httpData) || httpData.length === 0) {
    return adapterResponse({ message: 'ProjectDescriptionsHttp is not an array or no have data', hasError: true })
  } 

  const projectDescriptionsFormatted: projectDescriptionModel[] = []

  for (const projectDescription of httpData) {
    if (typeof projectDescription !== 'object') {
      return adapterResponse({ message: 'ProjectDescriptionsHttp no has a objent', hasError: true })
    }
  
    const {
      description,
      element_num,
      invoice_public_id,
      unitary_price,
      project_id,
      created_at,
      soft_deleted,
      updated_at,
      id,
    } = projectDescription
    
    if (!description || !element_num || !invoice_public_id || !unitary_price || !project_id) {
      return adapterResponse({
        message: 'Obligatory keys is undefined (description, element_num, invoice_public_id, unitary_price, project_id)',
        hasError: true
      })
    }
  
    const _projectDescription: projectDescriptionModel = {
      description: String(description),
      element_num: Number(element_num),
      invoice_public_id: String(invoice_public_id),
      unitary_price: Number(unitary_price),
      project_id: Number(project_id)
    }
  
    if (optionalFieldObligatory) {
      if (!created_at || soft_deleted === undefined || !updated_at || !id) {
        return adapterResponse({ message: 'Optional keys is undefined (created_at, soft_deleted , updated_at, id)', hasError: true })
      }

      _projectDescription.id = Number(id)
      _projectDescription.created_at = dateToUTC(new Date(created_at))
      _projectDescription.soft_deleted = stringToBoolean(soft_deleted)
      _projectDescription.updated_at = dateToUTC(new Date(updated_at))
    }
    
    projectDescriptionsFormatted.push(_projectDescription)
  }
  
  return adapterResponse({ message: 'All done', payload: projectDescriptionsFormatted })
}

export const httpToPermission = ({
  httpData,
  optionalFieldObligatory
}: httpToDataI): adapterResponseI<Array<permissionModel>> => {
  if (!Array.isArray(httpData) || httpData.length === 0) {
    return adapterResponse({ message: 'PermissionsHttp is not an array or no have data', hasError: true })
  } 

  const permissionsFormatted: permissionModel[] = []

  for (const permission of httpData) {
    if (typeof permission !== 'object') {
      return adapterResponse({ message: 'PermissionsHttp no has a objent', hasError: true })
    }
  
    const {
      description,
      created_at,
      soft_deleted,
      updated_at,
      id,
    } = permission
    
    if (!description) {
      return adapterResponse({
        message: 'Obligatory keys is undefined (description)',
        hasError: true
      })
    }
  
    const _permission: permissionModel = {
      description: String(description),
    }
  
    if (optionalFieldObligatory) {
      if (!created_at || soft_deleted === undefined || !updated_at || !id) {
        return adapterResponse({ message: 'Optional keys is undefined (created_at, soft_deleted , updated_at, id)', hasError: true })
      }

      _permission.id = Number(id)
      _permission.created_at = dateToUTC(new Date(created_at))
      _permission.soft_deleted = stringToBoolean(soft_deleted)
      _permission.updated_at = dateToUTC(new Date(updated_at))
    }
    
    permissionsFormatted.push(_permission)
  }
  
  return adapterResponse({ message: 'All done', payload: permissionsFormatted })
}

export const httpToUser = ({
  httpData,
  optionalFieldObligatory
}: httpToDataI): adapterResponseI<Array<userModel>> => {
  if (!Array.isArray(httpData) || httpData.length === 0) {
    return adapterResponse({ message: 'UsersHttp is not an array or no have data', hasError: true })
  } 

  const usersFormatted: userModel[] = []

  for (const user of httpData) {
    if (typeof user !== 'object') {
      return adapterResponse({ message: 'UsersHttp no has a objent', hasError: true })
    }
  
    const {
      salt_pass,
      email,
      pass,
      created_at,
      soft_deleted,
      updated_at,
      id,
    } = user
    
    if (!salt_pass || !pass || !email) {
      return adapterResponse({
        message: 'Obligatory keys is undefined (email, pass, salt_pass)',
        hasError: true
      })
    }
  
    const _user: userModel = {
      email: String(email),
      pass: String(pass),
      salt_pass: String(salt_pass),
    }
  
    if (optionalFieldObligatory) {
      if (!created_at || soft_deleted === undefined || !updated_at || !id) {
        return adapterResponse({ message: 'Optional keys is undefined (created_at, soft_deleted , updated_at, id)', hasError: true })
      }

      _user.id = Number(id)
      _user.created_at = dateToUTC(new Date(created_at))
      _user.soft_deleted = stringToBoolean(soft_deleted)
      _user.updated_at = dateToUTC(new Date(updated_at))
    }
    
    usersFormatted.push(_user)
  }
  
  return adapterResponse({ message: 'All done', payload: usersFormatted })
}

export const httpToUserPermission = ({
  httpData,
  optionalFieldObligatory
}: httpToDataI): adapterResponseI<Array<userPermissionModel>> => {
  if (!Array.isArray(httpData) || httpData.length === 0) {
    return adapterResponse({ message: 'UserPermissionsHttp is not an array or no have data', hasError: true })
  } 

  const userPermissionsFormatted: userPermissionModel[] = []

  for (const userPermission of httpData) {
    if (typeof userPermission !== 'object') {
      return adapterResponse({ message: 'UserPermissionsHttp no has a objent', hasError: true })
    }
  
    const {
      permission_id,
      user_id,
      is_allowed,
      created_at,
      soft_deleted,
      updated_at,
    } = userPermission
    
    if (!permission_id || !user_id || is_allowed === undefined) {
      return adapterResponse({
        message: 'Obligatory keys is undefined (user_id, permission_id, is_allowed)',
        hasError: true
      })
    }
  
    const _userPermission: userPermissionModel = {
      user_id: Number(user_id),
      permission_id: Number(permission_id),
      is_allowed: !!is_allowed
    }
  
    if (optionalFieldObligatory) {
      if (!created_at || soft_deleted === undefined || !updated_at) {
        return adapterResponse({ message: 'Optional keys is undefined (created_at, soft_deleted , updated_at)', hasError: true })
      }

      _userPermission.created_at = dateToUTC(new Date(created_at))
      _userPermission.soft_deleted = stringToBoolean(soft_deleted)
      _userPermission.updated_at = dateToUTC(new Date(updated_at))
    }
    
    userPermissionsFormatted.push(_userPermission)
  }
  
  return adapterResponse({ message: 'All done', payload: userPermissionsFormatted })
}

export const httpToLogin = ({ httpData }: httpToDataI<never>): adapterResponseI<loginI> => {
  if (Array.isArray(httpData)) {
    return adapterResponse({ message: 'httpData is an array, must be a object', hasError: true })
  } else if (typeof httpData !== 'object') {
    return adapterResponse({ message: 'httpData no has a objent', hasError: true })
  }

  const { email, pass } = httpData  
  
  if (!email || !pass ) return adapterResponse({ message: 'Obligatory keys is undefined (email, pass)', hasError: true })
    
  const loginFormatted: loginI = {
    email: String(email),
    pass: String(pass),
  }
    
  return adapterResponse({ message: 'All done', payload: loginFormatted })
}
