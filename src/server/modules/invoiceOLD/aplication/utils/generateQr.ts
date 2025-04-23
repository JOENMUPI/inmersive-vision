import QRCode from 'qrcode'

export const generateQR = async (text: string) => {
  try {
    const res = await QRCode.toDataURL(text)
    return res
  } catch (err) {
    console.error(err)
    return ''
  }
} 