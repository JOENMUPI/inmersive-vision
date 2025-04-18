import { StaticImageData } from "next/image";

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
  // Convertir cada carácter a su valor de byte correspondiente
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
  return new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));
}

export const numberToXXXX = (num: number, length: number): string => {
  return String(num).padStart(length, '0');
}
