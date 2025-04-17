import { dbClient } from "@/server/modules/client/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { dateToUTC, hexToString } from "@/server/utilities/formatters"
import { adapterResponseHttpI, anulateProps, clientModel, encrypManagerI, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";

export const getClientUseCase = async ({
  clientIds,
  dbManager,
  encryptManager,
  validatorManager
}:{
  clientIds?: string[],
  dbManager: dbClient,
  encryptManager: encrypManagerI,
  validatorManager: validatorManagerI<clientModel>
}): Promise<adapterResponseHttpI> => {
  if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateGet(clientIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const dbData = await dbManager.getClient(clientIds);
  
  if (dbData.hasError) return adapterResponseHttp({ message: dbData.message, hasError: dbData.hasError, statusHttp: 500 })
  else if (!dbData.payload || dbData.payload.length === 0) {
    return adapterResponseHttp({ message: 'No clients found', hasError: false, statusHttp: 200 })
  }

  const dataFormatted: clientModel[] = dbData.payload.map(client => {
    return {
      name: client.name,
      address: encryptManager.decryptAES(hexToString(client.address)),
      email: encryptManager.decryptAES(hexToString(client.email)),
      phone: encryptManager.decryptAES(hexToString(client.phone)),
      id: client.id,
      soft_deleted: client.soft_deleted,
      created_at: client.created_at,
      updated_at: client.updated_at
    }
  })
  
  return adapterResponseHttp({ payload: dataFormatted, message: dbData.message, hasError: dbData.hasError, statusHttp: 200 })
}

export const createClientUseCase = async ({
  clients,
  dbManager,
  encryptManager,
  validatorManager,
}:{
  clients: clientModel[],
  dbManager: dbClient,
  encryptManager: encrypManagerI,
  validatorManager: validatorManagerI<clientModel> 
}): Promise<adapterResponseHttpI<Array<clientModel>>> => {
  if (!clients) {
    return adapterResponseHttp({ message: 'client is undefined', hasError: true, statusHttp: 500 })
  } else if (clients.length === 0) {
    return adapterResponseHttp({ message: 'client no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateInsert(clients)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const _clients: clientModel[] = clients.map(client => ({
    email: encryptManager.encryptAES(client.email),
    address: encryptManager.encryptAES(client.address),
    phone: encryptManager.encryptAES(client.phone),
    name: client.name,
  }))

  const res = await dbManager.createClient(_clients);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const deleteClientUseCase = async ({
  clientIds,
  dbManager,
  validatorManager
}:{
  clientIds: string[],
  dbManager: dbClient,
  validatorManager: validatorManagerI<clientModel>,
}): Promise<adapterResponseHttpI<Array<clientModel>>> => {
  if (!clientIds) {
    return adapterResponseHttp({ message: 'client is undefined', hasError: true, statusHttp: 500 })
  } else if (clientIds.length === 0) {
    return adapterResponseHttp({ message: 'client no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(clientIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const res = await dbManager.deleteClient(clientIds);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const updateClientUseCase = async ({
  client,
  dbManager,
  encryptManager,
  validatorManager
}:{
  client: updateBaseI<clientModel>,
  dbManager: dbClient,
  encryptManager: encrypManagerI,
  validatorManager: validatorManagerI<clientModel>
}): Promise<adapterResponseHttpI<Array<clientModel>>> => {
  if (!client) {
    return adapterResponseHttp({ message: 'client is undefined', hasError: true, statusHttp: 500 })
  } else if (!client.currentId) {
    return adapterResponseHttp({ message: 'currentId is undefined', hasError: true, statusHttp: 500 })
  } else if (!client.newData) {
    return adapterResponseHttp({ message: 'newData is undefined', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateUpdate([client])
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const _client: updateBaseI<clientModel> = {
    currentId: client.currentId,
    newData: {
      address: encryptManager.decryptAES(client.newData.address),
      email: encryptManager.decryptAES(client.newData.email),
      phone: encryptManager.decryptAES(client.newData.name),
      id: client.newData.id,
      name: client.newData.name,
      created_at: client.newData.created_at,
      soft_deleted: client.newData.soft_deleted,
      updated_at: dateToUTC(new Date())
    }
  }
  
  const res = await dbManager.updateClient(_client);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const anulateClientUseCase = async ({
  clientIds,
  dbManager,
  validatorManager
}:{
  clientIds: string[],
  dbManager: dbClient,
  validatorManager: validatorManagerI<clientModel> 
}): Promise<adapterResponseHttpI<Array<clientModel>>> => {
  if (!clientIds) {
    return adapterResponseHttp({ message: 'ids is undefined', hasError: true, statusHttp: 500 })
  } else if (clientIds.length === 0) {
    return adapterResponseHttp({ message: 'ids no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(clientIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const data: anulateProps = {
    ids: clientIds,
    soft_deleted: true,
    update_at: dateToUTC(new Date())
  }

  const res = await dbManager.anulateClient(data);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}
