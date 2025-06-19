import { invoiceInternalManagerI } from "@/server/modules/invoice/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { projectInternalManagerI } from "@/server/modules/project/domain/interfaces"
import { projectDescriptionInternalManagerI } from "@/server/modules/projectDescription/domain/interfaces"
import { clientInternalManagerI } from "@/server/modules/client/domain/interfaces"
import { methodPaymentInternalManagerI } from "@/server/modules/methodPayment/domain/interfaces"
import {
  adapterResponseHttpI,
  invoiceId,
  clientModel,
  projectModel,
  methodPaymentModel,
  projectDescriptionModel,
  invoiceModel,
  completeInvoiceI
} from "@/server/utilities/interfaces"

export const getCompleteInvoiceUseCase = async ({
  projectPublicIds,
  projectManager,
  projectDescriptionManager,
  invoiceManager,
  clientManager,
  methodPaymentManager,
}:{
  projectPublicIds?: string[],
  projectManager: projectInternalManagerI,
  invoiceManager: invoiceInternalManagerI,
  clientManager: clientInternalManagerI,
  methodPaymentManager: methodPaymentInternalManagerI,
  projectDescriptionManager: projectDescriptionInternalManagerI,
}): Promise<adapterResponseHttpI<Array<completeInvoiceI>>> => {
  if (!projectManager) {
    return adapterResponseHttp({ message: 'projectManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!invoiceManager) {
    return adapterResponseHttp({ message: 'invoiceManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!clientManager) {
    return adapterResponseHttp({ message: 'clientManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!methodPaymentManager) {
    return adapterResponseHttp({ message: 'methodPaymentManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!projectDescriptionManager) {
    return adapterResponseHttp({ message: 'projectDescriptionManager is undefined', hasError: true, statusHttp: 500 })
  }

  const [clientsData, methodPaymentsData, projectsData, projectDescriptionsData, invoicesData] = await Promise.all([
    clientManager.getClientInternal(),
    methodPaymentManager.getMethodPaymentInternal(),
    projectManager.getProjectInternal(),
    projectDescriptionManager.getProjectDescriptionInternal(),
    invoiceManager.getInvoiceInternal()
  ])

  if (clientsData.hasError) return adapterResponseHttp({ message: clientsData.message, hasError: true, statusHttp: 400 })
  if (!clientsData.payload) return adapterResponseHttp({ message: 'clientsData no has payload', hasError: true, statusHttp: 400 })
  
  const clientDataMap = new Map<number, clientModel>(clientsData.payload.map(obj => [obj.id!, obj]))
  
  if (methodPaymentsData.hasError) {
    return adapterResponseHttp({ message: methodPaymentsData.message, hasError: true, statusHttp: 400 })
  }
  
  if (!methodPaymentsData.payload) {
    return adapterResponseHttp({ message: 'methodPaymentData no has payload', hasError: true, statusHttp: 400 })
  }

  const methodPaymentDataMap = new Map<number, methodPaymentModel>(methodPaymentsData.payload.map(obj => [obj.id!, obj]))
  
  if (projectsData.hasError) return adapterResponseHttp({ message: projectsData.message, hasError: true, statusHttp: 400 })
  if (!projectsData.payload) return adapterResponseHttp({ message: 'projectsData no has payload', hasError: true, statusHttp: 400 })

  const projectDataMap = new Map<string, projectModel>(projectsData.payload.map(obj => [obj.public_id, obj]))
  
  if (projectDescriptionsData.hasError) {
    return adapterResponseHttp({ message: projectDescriptionsData.message, hasError: true, statusHttp: 400 })
  }

  if (!projectDescriptionsData.payload) {
    return adapterResponseHttp({ message: 'projectDescriptionsData no has payload', hasError: true, statusHttp: 400 })
  }

  const projectDescriptionDataMap = new Map<number, projectDescriptionModel>(projectDescriptionsData.payload.map(obj => [obj.id!, obj]))
  
  if (invoicesData.hasError) {
    return adapterResponseHttp({ message: invoicesData.message, hasError: true, statusHttp: 400 })
  }

  if (!invoicesData.payload) {
    return adapterResponseHttp({ message: 'invoicesData no has payload', hasError: true, statusHttp: 400 })
  }

  const invoiceDataMap = new Map<invoiceId, invoiceModel>(
    invoicesData.payload.map(obj => [{ installment_num: obj.installment_num, project_id: obj.project_id }, obj])
  )

  let _projectPublicIds: string[] = []
  
  if (projectPublicIds) _projectPublicIds = [...projectPublicIds]
  else _projectPublicIds = Array.from(projectsData.payload.map(pj => pj.public_id))
  
  const res: completeInvoiceI[] = []

  for (const projectPublicId of _projectPublicIds) {
    const completeInvoice: completeInvoiceI = {} as completeInvoiceI

    if (!projectDataMap.has(projectPublicId)) {
      return adapterResponseHttp({ message: `Project ${projectPublicId} not found`, hasError: true, statusHttp: 400 })
    }

    const currentProject = projectDataMap.get(projectPublicId)!
    completeInvoice.project = currentProject
    const invoiceRelationated = Array.from(
      invoiceDataMap.values()
    ).filter(invoice => invoice.project_id === currentProject.id)
    
    if (invoiceRelationated.length === 0) {
      return adapterResponseHttp({
        message: `invoice of project public id ${currentProject.public_id} not found`,
        hasError: true,
        statusHttp: 400
      })
    } 

    completeInvoice.invoices = invoiceRelationated
    
    const baseInvoice = invoiceRelationated[0]
    if (!clientDataMap.has(baseInvoice.client_id)) {
      return adapterResponseHttp({ message: `Client ${baseInvoice.client_id} not found`, hasError: true, statusHttp: 400 })
    } 

    completeInvoice.client = clientDataMap.get(baseInvoice.client_id)!

    if (!methodPaymentDataMap.has(baseInvoice.method_payment_id)) {
      return adapterResponseHttp({
        message: `Method payment ${baseInvoice.method_payment_id} not found`,
        hasError: true,
        statusHttp: 400
      })
    }

    completeInvoice.methodPayment = methodPaymentDataMap.get(baseInvoice.method_payment_id)!

    const projectDescriptionRelationated = Array.from(
      projectDescriptionDataMap.values()
    ).filter(pd => pd.project_id === currentProject.id)

    if (projectDescriptionRelationated.length === 0) {
      return adapterResponseHttp({
        message: `Project description of invoice public id ${currentProject.public_id} not found`,
        hasError: true,
        statusHttp: 400
      })
    } 

    completeInvoice.projectDescriptions = projectDescriptionRelationated
    res.push(completeInvoice)
  }
  
  return adapterResponseHttp({ payload: res, message: 'Get completeInvoice successfully', hasError: false, statusHttp: 200 })
}

const deleteprojectAux = async (
  projectIds: number[],
  projectManager: projectInternalManagerI
): Promise<adapterResponseHttpI<completeInvoiceI[]> | null> => {
  const projectDeleted = await projectManager.deleteProjectInternal(projectIds)
      
  if (projectDeleted.hasError) return adapterResponseHttp({ message: projectDeleted.message, hasError: true, statusHttp: 400 })
  else if (!projectDeleted.payload) {
    return adapterResponseHttp({ message: 'projectDeleted no has payload', hasError: true, statusHttp: 400 })
  } else return null
}

export const createCompleteInvoiceUseCase = async ({
  completeInvoices,
  clientManager,
  invoiceManager,
  methodPaymentManager,
  projectDescriptionManager,
  projectManager
}:{
  completeInvoices: completeInvoiceI[],
  projectManager: projectInternalManagerI,
  invoiceManager: invoiceInternalManagerI,
  clientManager: clientInternalManagerI,
  methodPaymentManager: methodPaymentInternalManagerI,
  projectDescriptionManager: projectDescriptionInternalManagerI, 
}): Promise<adapterResponseHttpI<Array<completeInvoiceI>>> => {
  if (!completeInvoices) {
    return adapterResponseHttp({ message: 'invoice is undefined', hasError: true, statusHttp: 500 })
  } else if (completeInvoices.length === 0) {
    return adapterResponseHttp({ message: 'invoice no data', hasError: true, statusHttp: 500 })
  } else if (!projectManager) {
    return adapterResponseHttp({ message: 'projectManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!invoiceManager) {
    return adapterResponseHttp({ message: 'invoiceManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!clientManager) {
    return adapterResponseHttp({ message: 'clientManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!methodPaymentManager) {
    return adapterResponseHttp({ message: 'methodPaymentManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!projectDescriptionManager) {
    return adapterResponseHttp({ message: 'projectDescriptionManager is undefined', hasError: true, statusHttp: 500 })
  }
  
  const [clientsData, methodPaymentsData] = await Promise.all([
    clientManager.getClientInternal(),
    methodPaymentManager.getMethodPaymentInternal(),
  ])
  
  if (methodPaymentsData.hasError) return adapterResponseHttp({ message: methodPaymentsData.message, hasError: true, statusHttp: 400 })
  if (!methodPaymentsData.payload) return adapterResponseHttp({ message: 'methodPaymentData no has payload', hasError: true, statusHttp: 400 })

  const methodPaymentsDataMap = new Map<number, methodPaymentModel>(methodPaymentsData.payload.map(obj => [obj.id!, obj]))
  
  if (clientsData.hasError) return adapterResponseHttp({ message: clientsData.message, hasError: true, statusHttp: 400 })
  if (!clientsData.payload) return adapterResponseHttp({ message: 'clientData no has payload', hasError: true, statusHttp: 400 })

  const clientsDataMap = new Map<number, clientModel>(clientsData.payload.map(obj => [obj.id!, obj]))
  const res: completeInvoiceI[] = []
  const newProject: projectModel = {
    public_id: 'autoGen',
    total_installment: completeInvoices[0].project.total_installment,
    created_at: new Date(),
  }
  
  const projectCreated = await projectManager.createProjectInternal([newProject])
  
  if (projectCreated.hasError) return adapterResponseHttp({ message: projectCreated.message, hasError: true, statusHttp: 400 })
  else if (!projectCreated.payload) return adapterResponseHttp({ message: 'projectCreated no has payload', hasError: true, statusHttp: 400 })

  const projectBaseId = projectCreated.payload[0].id!
  
  for(const completeInvoice of completeInvoices) {
    if (completeInvoice.invoices.length !== completeInvoice.project.total_installment) {
      const projectDeleted = await deleteprojectAux([projectBaseId], projectManager)
      if (projectDeleted) return projectDeleted

      return adapterResponseHttp({ message: 'No has all installemnte on this invoice', hasError: true, statusHttp: 400 })
    }
    
    if (!completeInvoice.client.id ||
      !projectBaseId ||
      !completeInvoice.methodPayment.id ||
      !clientsDataMap.has(completeInvoice.client.id) ||
      !methodPaymentsDataMap.has(completeInvoice.methodPayment.id)
    ) {
      const projectDeleted = await deleteprojectAux([projectBaseId], projectManager)
      if (projectDeleted) return projectDeleted
    }

    if (!completeInvoice.client.id) return adapterResponseHttp({ message: 'Client id not found', statusHttp: 400, hasError: true })
    if (!projectBaseId) {
      return adapterResponseHttp({ message: 'Project id not found', statusHttp: 400, hasError: true })
    }

    if (!completeInvoice.methodPayment.id) {
      return adapterResponseHttp({ message: 'Method payment id not found', statusHttp: 400, hasError: true })
    }

    if (!clientsDataMap.has(completeInvoice.client.id)) {
      return adapterResponseHttp({ message: `Client ${completeInvoice.client.id} not found`, hasError: true, statusHttp: 400 })
    }

    if (!methodPaymentsDataMap.has(completeInvoice.methodPayment.id)) {
      return adapterResponseHttp({ message: `Method payment ${completeInvoice.methodPayment.id} not found`, hasError: true, statusHttp: 400 })
    }

    const _completeInvoice: completeInvoiceI = completeInvoice

    _completeInvoice.project = projectCreated.payload[0]
    _completeInvoice.client = clientsDataMap.get(completeInvoice.client.id)!
    _completeInvoice.methodPayment = methodPaymentsDataMap.get(completeInvoice.methodPayment.id)!
    _completeInvoice.invoices = completeInvoice.invoices.map((invoice, index) => ({
      ...invoice,
      project_id: projectBaseId,
      method_payment_id: _completeInvoice.methodPayment.id!,
      client_id: _completeInvoice.client.id!,
      installment_num: index + 1
    }))
    _completeInvoice.projectDescriptions = completeInvoice.projectDescriptions.map(projectDescription => ({
      ...projectDescription,
      project_id: projectBaseId
    }))
  
    const invoiceCreated = await invoiceManager.createInvoiceInternal(_completeInvoice.invoices)

    if (invoiceCreated.hasError || !invoiceCreated.payload || invoiceCreated.payload.length === 0) {
      const projectDeleted = await deleteprojectAux([projectBaseId], projectManager)
      if (projectDeleted) return projectDeleted    
    }

    if (invoiceCreated.hasError) return adapterResponseHttp({ message: invoiceCreated.message, statusHttp: 400, hasError: true })
    if (!invoiceCreated.payload || invoiceCreated.payload.length === 0) {
      return adapterResponseHttp({ message: 'invoiceCreated no has payload', statusHttp: 400, hasError: true })
    } 

    if (!invoiceCreated.payload[0].public_id) {
      return adapterResponseHttp({ message: 'invoiceCreated no has public id', statusHttp: 400, hasError: true })
    } 

    const _projectDescription: projectDescriptionModel[] = completeInvoice.projectDescriptions.map(projectDescription => {
      return {
        ...projectDescription,
        invoice_public_id: invoiceCreated.payload![0].public_id
      }
    })

    const projectDescriptionCreated = await projectDescriptionManager.createProjectDescriptionInternal(_projectDescription)
    if (projectDescriptionCreated.hasError) {
      return adapterResponseHttp({ message: projectDescriptionCreated.message, statusHttp: 400, hasError: true })
    } 
    
    if (!projectDescriptionCreated.payload || projectDescriptionCreated.payload.length === 0) {
      return adapterResponseHttp({ message: 'projectDescriptionCreated no has payload', statusHttp: 400, hasError: true })
    }

    const completeInvoiceRes: completeInvoiceI = {} as completeInvoiceI 

    completeInvoiceRes.invoices = invoiceCreated.payload 
    completeInvoiceRes.projectDescriptions = projectDescriptionCreated.payload
    res.push(completeInvoiceRes)
  }

  return adapterResponseHttp({ payload: res, message: 'Complete invoice created succesfully', hasError: false, statusHttp: 200 })
}

export const deleteCompleteInvoiceUseCase = async ({
  invoiceIds,
  invoiceManager,
}:{
  invoiceIds: invoiceId[],
  invoiceManager: invoiceInternalManagerI,
}): Promise<adapterResponseHttpI<Array<completeInvoiceI>>> => {
  if (!invoiceIds) {
    return adapterResponseHttp({ message: 'invoice is undefined', hasError: true, statusHttp: 500 })
  } else if (invoiceIds.length === 0) {
    return adapterResponseHttp({ message: 'invoice no data', hasError: true, statusHttp: 500 })
  } else if (!invoiceManager) {
    return adapterResponseHttp({ message: 'invoiceManager is undefined', hasError: true, statusHttp: 500 })
  } 

  const invoiceDeleted = await invoiceManager.deleteInvoiceInternal(invoiceIds)

  if (invoiceDeleted.hasError) return adapterResponseHttp({ message: invoiceDeleted.message, hasError: true, statusHttp: 400 })
  if (!invoiceDeleted.payload || invoiceDeleted.payload.length === 0) {
    return adapterResponseHttp({ message: 'invoiceDeleted no has payload', hasError: true, statusHttp: 400 })
  }

  return adapterResponseHttp({ message: 'Complete invoice deleted succesfully', hasError: false, statusHttp: 200 })
}

// export const updateInvoiceUseCase = async ({
//   invoice,
//   dbManager,
//   validatorManager
// }:{
//   invoice: updateBaseI<completeInvoiceI, invoiceId>,
//   dbManager: dbInvoice,
//   validatorManager: validatorManagerI<completeInvoiceI, invoiceId>
// }): Promise<adapterResponseHttpI<Array<completeInvoiceI>>> => {
//   if (!invoice) {
//     return adapterResponseHttp({ message: 'invoice is undefined', hasError: true, statusHttp: 500 })
//   } else if (!invoice.currentId) {
//     return adapterResponseHttp({ message: 'currentId is undefined', hasError: true, statusHttp: 500 })
//   } else if (!invoice.newData) {
//     return adapterResponseHttp({ message: 'newData is undefined', hasError: true, statusHttp: 500 })
//   } else if (!dbManager) {
//     return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
//   } else if (!validatorManager) {
//     return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
//   }

//   const validator = validatorManager.validateUpdate([invoice])
//   if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

//   const _invoice: updateBaseI<completeInvoiceI, invoiceId> = {
//     currentId: invoice.currentId,
//     newData: {
//       client_id: invoice.newData.client_id,
//       creation_date: invoice.newData.creation_date,
//       expiration_date: invoice.newData.expiration_date,
//       installment_id: invoice.newData.installment_id,
//       method_payment_id: invoice.newData.method_payment_id,
//       project_id: invoice.newData.project_id,
//       public_id: invoice.newData.public_id,
//       ref_num_paid: invoice.newData.ref_num_paid,
//       created_at: invoice.newData.created_at,
//       soft_deleted: invoice.newData.soft_deleted,
//       updated_at: dateToUTC(new Date())
//     }
//   }
  
//   const res = await dbManager.updateInvoice(_invoice);

//   if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
//   else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
// }