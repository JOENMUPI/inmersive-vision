import { formToursDataI, formDataI } from '@/server/modules/form/domain/interfaces';

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