import { adapterResponseHttpI, adapterResponseI } from "@/server/utilities/interfaces"
/**
 *
 * @description Funcion generica para crear una estructura general de respuesta con el cliente
 * @param {string} message Mensaje plano basico para la respuesta.
 * @param {Boolean} hasError Bandera que indica si el mensaje porta errores.
 * @param {JSON} body Respuesta que el servidor desea enviar.
 * @returns {JSON} A json with { message, hasError, body }.
 */


export const adapterResponse = <Y>({ message, payload, hasError = false }: adapterResponseI<Y>) => {
  return { message, hasError, payload }
}

/**
 *
 * @description Funcion generica para crear una estructura general con el cliente
 * @param {T} response Respuesta de la operacion de tipado dinamico.
 * @param {Number} statusHttp Codigo http que deseamos enviar.
 * @returns {Object} A json with { response, status }.
 */

export const adapterResponseHttp = <Y = object>({ message, statusHttp, hasError = false, payload }: adapterResponseHttpI<Y>) => {
  return { message, statusHttp, hasError, payload }
}
