/**
 *
 * @description Funcion generica para crear una estructura general de respuesta con el cliente
 * @param {string} message Mensaje plano basico para la respuesta.
 * @param {Boolean} hasError Bandera que indica si el mensaje porta errores.
 * @param {JSON} body Respuesta que el servidor desea enviar.
 * @returns {JSON} A json with { message, hasError, body }.
 */

export interface responseHttpI<T = object> {
  message: string
  hasError?: boolean
  payload?: T
}

export const responseHttp = <Y>({ message, payload, hasError = false }: responseHttpI<Y>) => {
  return { message, hasError, payload }
}
