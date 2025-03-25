/**
 *
 * @description Funcion generica para crear una estructura general con el cliente
 * @param {T} response Respuesta de la operacion de tipado dinamico.
 * @param {Number} statusHttp Codigo http que deseamos enviar.
 * @returns {Object} A json with { response, status }.
 */

export interface adapterResI<T> {
  response: T;
  statusHttp: number;
}

export const adapterRes = <Y = string>({ response, statusHttp = 200 }: adapterResI<Y>) => {
  return { response, statusHttp }
}
