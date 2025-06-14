import { invoiceInternalManagerI } from "@/server/modules/invoice/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import {
  adapterResponseHttpI,
  invoiceId,
  clientModel,
  installmentModel,
  projectModel,
  methodPaymentModel,
  projectDescriptionModel,
  invoiceModel,
  completeInvoiceI
} from "@/server/utilities/interfaces"
import { installmentInternalManagerI } from "@/server/modules/installment/domain/interfaces"
import { projectInternalManagerI } from "@/server/modules/project/domain/interfaces"
import { projectDescriptionInternalManagerI } from "@/server/modules/projectDescription/domain/interfaces"
import { clientInternalManagerI } from "@/server/modules/client/domain/interfaces"
import { methodPaymentInternalManagerI } from "@/server/modules/methodPayment/domain/interfaces"

export const getCompleteInvoiceUseCase = async ({
  invoiceIds,
  installmentManager,
  projectManager,
  projectDescriptionManager,
  invoiceManager,
  clientManager,
  methodPaymentManager,
}:{
  invoiceIds?: invoiceId[],
  installmentManager: installmentInternalManagerI,
  projectManager: projectInternalManagerI,
  invoiceManager: invoiceInternalManagerI,
  clientManager: clientInternalManagerI,
  methodPaymentManager: methodPaymentInternalManagerI,
  projectDescriptionManager: projectDescriptionInternalManagerI,
}): Promise<adapterResponseHttpI<Array<completeInvoiceI>>> => {
  if (!installmentManager) {
    return adapterResponseHttp({ message: 'installmentManager is undefined', hasError: true, statusHttp: 500 })
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

  const [clientsData, installmentsData, methodPaymentsData, projectsData, projectDescriptionsData] = await Promise.all([
    clientManager.getClientInternal(),
    installmentManager.getInstallmentInternal({}),
    methodPaymentManager.getMethodPaymentInternal(),
    projectManager.getProjectInternal(),
    projectDescriptionManager.getProjectDescriptionInternal()
  ])

  if (clientsData.hasError) return adapterResponseHttp({ message: clientsData.message, hasError: true, statusHttp: 400 })
  if (!clientsData.payload) return adapterResponseHttp({ message: 'clientsData no has payload', hasError: true, statusHttp: 400 })
  
  const clientDataMap = new Map<number, clientModel>(clientsData.payload.map(obj => [obj.id!, obj]))
  
  if (installmentsData.hasError) return adapterResponseHttp({ message: installmentsData.message, hasError: true, statusHttp: 400 })
  if (!installmentsData.payload) return adapterResponseHttp({ message: 'installmentsData no has payload', hasError: true, statusHttp: 400 })

  const installmentDataMap = new Map<number, installmentModel>(installmentsData.payload.map(obj => [obj.id!, obj]))
  
  if (methodPaymentsData.hasError) {
    return adapterResponseHttp({ message: methodPaymentsData.message, hasError: true, statusHttp: 400 })
  }
  
  if (!methodPaymentsData.payload) {
    return adapterResponseHttp({ message: 'methodPaymentData no has payload', hasError: true, statusHttp: 400 })
  }

  const methodPaymentDataMap = new Map<number, methodPaymentModel>(methodPaymentsData.payload.map(obj => [obj.id!, obj]))
  
  if (projectsData.hasError) return adapterResponseHttp({ message: projectsData.message, hasError: true, statusHttp: 400 })
  if (!projectsData.payload) return adapterResponseHttp({ message: 'projectsData no has payload', hasError: true, statusHttp: 400 })

  const projectDataMap = new Map<number, projectModel>(projectsData.payload.map(obj => [obj.id!, obj]))
  
  if (projectDescriptionsData.hasError) {
    return adapterResponseHttp({ message: projectDescriptionsData.message, hasError: true, statusHttp: 400 })
  }

  if (!projectDescriptionsData.payload) {
    console.error(projectDescriptionsData)
    return adapterResponseHttp({ message: 'projectDescriptionsData no has payload', hasError: true, statusHttp: 400 })
  }

  const projectDescriptionDataMap = new Map<number, projectDescriptionModel>(projectDescriptionsData.payload.map(obj => [obj.id!, obj]))
  const invoicesData = await invoiceManager.getInvoiceInternal()
  
  if (invoicesData.hasError) return adapterResponseHttp({ message: invoicesData.message, hasError: true, statusHttp: 400 })
  if (!invoicesData.payload) return adapterResponseHttp({ message: 'invoicesData no has payload', hasError: true, statusHttp: 400 })

  const invoiceDataMap = new Map<invoiceId, invoiceModel>(
    invoicesData.payload.map(obj => [{ installment_id: obj.installment_id, project_id: obj.project_id }, obj])
  )

  let _invoiceIds: invoiceId[] = []
  
  if (invoiceIds) _invoiceIds = [...invoiceIds]
  else _invoiceIds = Array.from(invoiceDataMap.keys())
  
  const res: completeInvoiceI[] = []

  for (const invoice of _invoiceIds) {
    const completeInvoice: completeInvoiceI = {} as completeInvoiceI

    if (!invoiceDataMap.has(invoice)) {
      return adapterResponseHttp({ message: `Invoice ${invoice} not found`, hasError: true, statusHttp: 400 })
    }

    completeInvoice.invoice = invoiceDataMap.get(invoice)!

    if (!clientDataMap.has(completeInvoice.invoice.client_id)) {
      return adapterResponseHttp({ message: `Client ${completeInvoice.invoice.client_id} not found`, hasError: true, statusHttp: 400 })
    } 

    completeInvoice.client = clientDataMap.get(completeInvoice.invoice.client_id)!

    if (!methodPaymentDataMap.has(completeInvoice.invoice.method_payment_id)) {
      return adapterResponseHttp({
        message: `Method payment ${completeInvoice.invoice.method_payment_id} not found`,
        hasError: true,
        statusHttp: 400
      })
    }

    completeInvoice.methodPayment = methodPaymentDataMap.get(completeInvoice.invoice.method_payment_id)!
    
    if (!projectDataMap.has(completeInvoice.invoice.project_id)) {
      return adapterResponseHttp({ message: `Project ${completeInvoice.invoice.project_id} not found`, hasError: true, statusHttp: 400 })
    }
    
    completeInvoice.project = projectDataMap.get(completeInvoice.invoice.project_id)!
    
    if (!installmentDataMap.has(completeInvoice.invoice.installment_id)) {
      return adapterResponseHttp({
        message: `Installment ${completeInvoice.invoice.installment_id} not found`,
        hasError: true,
        statusHttp: 400
      })
    } 

    completeInvoice.installment = installmentDataMap.get(completeInvoice.invoice.installment_id)!
    const projectDescriptionRelationated = Array.from(
      projectDescriptionDataMap.values()
    ).filter(pd => pd.invoice_public_id === completeInvoice.invoice.public_id)

    if (projectDescriptionRelationated.length === 0) {
      return adapterResponseHttp({
        message: `Project description  of invoice public id${completeInvoice.invoice.public_id} not found`,
        hasError: true,
        statusHttp: 400
      })
    } 

    completeInvoice.installment = installmentDataMap.get(completeInvoice.invoice.installment_id)!
    completeInvoice.projectDescriptions = projectDescriptionRelationated
    res.push(completeInvoice)
  }
  
  return adapterResponseHttp({ payload: res, message: 'Get completeInvoice successfully', hasError: false, statusHttp: 200 })
}

export const createCompleteInvoiceUseCase = async ({
  completeInvoices,
  clientManager,
  installmentManager,
  invoiceManager,
  methodPaymentManager,
  projectDescriptionManager,
  projectManager
}:{
  completeInvoices: completeInvoiceI[],
  installmentManager: installmentInternalManagerI,
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
  } else if (!installmentManager) {
    return adapterResponseHttp({ message: 'installmentManager is undefined', hasError: true, statusHttp: 500 })
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

  const projectBase = completeInvoices[0].invoice.project_id
  const installmmentNums = []

  for (const element of completeInvoices) {
    if (projectBase !== element.installment.project_id || projectBase !== element.invoice.project_id) {
      return adapterResponseHttp({ message: 'Project id is not the same on all rows', hasError: true, statusHttp: 400 })
    }
    
    for (const projectDescription of element.projectDescriptions) {
      if (projectBase !== projectDescription.project_id) {
        return adapterResponseHttp({ message: 'Project id is not the same on all rows', hasError: true, statusHttp: 400 })
      }
    }
      
    installmmentNums.push(element.installment.installment_num)  
  }

  const [clientsData, methodPaymentsData, projectsData] = await Promise.all([
    clientManager.getClientInternal(),
    methodPaymentManager.getMethodPaymentInternal(),
    projectManager.getProjectInternal()
  ])
  
  if (methodPaymentsData.hasError) {
    return adapterResponseHttp({ message: methodPaymentsData.message, hasError: true, statusHttp: 400 })
  }
  
  if (!methodPaymentsData.payload) {
    return adapterResponseHttp({ message: 'methodPaymentData no has payload', hasError: true, statusHttp: 400 })
  }

  const methodPaymentsDataMap = new Map<number, methodPaymentModel>(methodPaymentsData.payload.map(obj => [obj.id!, obj]))
  
  if (clientsData.hasError) return adapterResponseHttp({ message: clientsData.message, hasError: true, statusHttp: 400 })
  if (!clientsData.payload) {
    return adapterResponseHttp({ message: 'clientData no has payload', hasError: true, statusHttp: 400 })
  }

  const clientsDataMap = new Map<number, clientModel>(clientsData.payload.map(obj => [obj.id!, obj]))

  if (projectsData.hasError) return adapterResponseHttp({ message: projectsData.message, hasError: true, statusHttp: 400 })
  if (!projectsData.payload) {
    return adapterResponseHttp({ message: 'projectsData no has payload', hasError: true, statusHttp: 400 })
  }

  const projectsDataMap = new Map<number, projectModel>(projectsData.payload.map(obj => [obj.id!, obj]))
  const res: completeInvoiceI[] = []
  const searchInstallment = await installmentManager.getInstallmentInternal({
    installmentNum: [...installmmentNums],
    projectId: [projectBase]
  })

  if (searchInstallment.hasError) return adapterResponseHttp({ message: searchInstallment.message, hasError: true, statusHttp: 400 })
  else if (searchInstallment.payload && searchInstallment.payload.length > 0) {
    const currentintallmentNum = searchInstallment.payload[0].installment_num
    const currentProjectId = searchInstallment.payload[0].project_id
    
    return adapterResponseHttp({
      message: `Installment number ${currentintallmentNum} exist for the project ${currentProjectId}`,
      hasError: true,
      statusHttp: 400
    })
  }

  for(const completeInvoice of completeInvoices) {
    const completeInvoiceRes: completeInvoiceI = {} as completeInvoiceI 

    if (!completeInvoice.client.id) return adapterResponseHttp({ message: 'Client id not found', statusHttp: 400, hasError: true })
    if (!completeInvoice.project.id) return adapterResponseHttp({ message: 'Project id not found', statusHttp: 400, hasError: true })
    if (!completeInvoice.methodPayment.id) {
      return adapterResponseHttp({ message: 'Method payment id not found', statusHttp: 400, hasError: true })
    }
    
    if (!clientsDataMap.has(completeInvoice.client.id)) {
      return adapterResponseHttp({ message: `Client ${completeInvoice.invoice.client_id} not found`, hasError: true, statusHttp: 400 })
    }

    if (!projectsDataMap.has(completeInvoice.project.id)) {
      return adapterResponseHttp({ message: `Project ${completeInvoice.invoice.client_id} not found`, hasError: true, statusHttp: 400 })
    }

    if (!methodPaymentsDataMap.has(completeInvoice.methodPayment.id)) {
      return adapterResponseHttp({ message: `Method payment ${completeInvoice.invoice.client_id} not found`, hasError: true, statusHttp: 400 })
    }

    completeInvoice.project = projectsDataMap.get(completeInvoice.project.id)!
    completeInvoice.client = clientsDataMap.get(completeInvoice.client.id)!
    completeInvoice.methodPayment = methodPaymentsDataMap.get(completeInvoice.methodPayment.id)!
    
    const installmentCreated = await installmentManager.createInstallmentInternal([completeInvoice.installment])

    if (installmentCreated.hasError) return adapterResponseHttp({ message: installmentCreated.message, statusHttp: 400, hasError: true })
    if (!installmentCreated.payload || installmentCreated.payload.length === 0) {
      return adapterResponseHttp({ message: 'installmentCreated no has payload', statusHttp: 400, hasError: true })
    }
    
    if (!installmentCreated.payload![0].id) {
      return adapterResponseHttp({ message: 'installmentCreated no has id', statusHttp: 400, hasError: true })
    }

    const _invoice: invoiceModel = { ...completeInvoice.invoice, installment_id: installmentCreated.payload![0].id }
    const invoiceCreated = await invoiceManager.createInvoiceInternal([_invoice])

    if (invoiceCreated.hasError || !invoiceCreated.payload || invoiceCreated.payload.length === 0) {
      const installmentDeleted = await installmentManager.deleteInstallmentInternal([installmentCreated.payload![0].id!])
      
      if (installmentDeleted.hasError) return adapterResponseHttp({ message: installmentDeleted.message, statusHttp: 400, hasError: true })
      if (!installmentDeleted.payload || installmentDeleted.payload.length === 0) {
        return adapterResponseHttp({ message: 'installmentDeleted no has payload', statusHttp: 400, hasError: true })
      } 
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

    completeInvoiceRes.installment = installmentCreated.payload[0]
    completeInvoiceRes.invoice = invoiceCreated.payload[0] 
    completeInvoiceRes.projectDescriptions = projectDescriptionCreated.payload
    res.push(completeInvoiceRes)
  }

  return adapterResponseHttp({ payload: res, message: 'Complete invoice created succesfully', hasError: false, statusHttp: 200 })
}

export const deleteCompleteInvoiceUseCase = async ({
  invoiceIds,
  installmentManager,
}:{
  invoiceIds: invoiceId[],
  installmentManager: installmentInternalManagerI,
}): Promise<adapterResponseHttpI<Array<completeInvoiceI>>> => {
  if (!invoiceIds) {
    return adapterResponseHttp({ message: 'invoice is undefined', hasError: true, statusHttp: 500 })
  } else if (invoiceIds.length === 0) {
    return adapterResponseHttp({ message: 'invoice no data', hasError: true, statusHttp: 500 })
  } else if (!installmentManager) {
    return adapterResponseHttp({ message: 'installmentManager is undefined', hasError: true, statusHttp: 500 })
  } 

  const installmentDeleted = await installmentManager.deleteInstallmentInternal(invoiceIds.map(invoice => invoice.installment_id))

  if (installmentDeleted.hasError) return adapterResponseHttp({ message: installmentDeleted.message, hasError: true, statusHttp: 400 })
  if (!installmentDeleted.payload || installmentDeleted.payload.length === 0) {
    return adapterResponseHttp({ message: 'installmentDeleted no has payload', hasError: true, statusHttp: 400 })
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