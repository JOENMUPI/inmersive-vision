import { formToursDataI, formDataI, formTemplatesDataI } from '@/server/modules/form/domain/interfaces';

export const createMailTemplatesHtml = (data: formTemplatesDataI): string => {
  return `<b>Name: </b>${data.name}<br>
    <b>Email: </b>${data.email}<br>
    <b>Phone: </b>${data.phone}<br>
    ${data.numberOfBeds ? `<b>Number of beds: </b>${data.numberOfBeds}<br>` : null}
    ${data.reasonPurchase ? `<b>Reason of Purchase: </b>${data.reasonPurchase}<br>` : null}
    <b>Description:</b><p>${data.message}</p>`
}

export const createMailToursHtml = (data: formToursDataI): string => {
  return `<b>Name: </b>${data.name}<br>
    <b>Email: </b>${data.email}<br>
    <b>Phone: </b>${data.phone}<br>
    <b>Category: </b>${data.category}<br>
    <b>Model: </b>${data.model}<br>
    <b>Description:</b><p>${data.description}</p>`
}

export const createMailFormHtml = (data: formDataI): string => {
  let res = `<b>Name: </b>${data.name}<br><b>Email: </b>${data.email}<br>`

  if (data.phone) res += `<b>Phone: </b>${data.phone}`
  
  return res
}