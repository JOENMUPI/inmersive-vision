import { formatDateToDDMMYYYY, numberToUSD, base64ToByteArray, imgToBytes } from "@/server/utilities/formatters"
import bgImg from '@/../public/pdf/background_CLIENT_PAIN.jpg';
import logoImg from '@/../public/pdf/LOGO_IMVI.png';
import { PDFDocument, PDFImage, PDFPage, RGB, rgb, RotationTypes, StandardFonts } from "pdf-lib"
import { generateQR } from "@/app/app/utilities/generateQr"
import { generatePdfI } from "@/app/app/utilities/interfaces"

export const generatePdf = async (allData: generatePdfI[]): Promise<string> => {
  // img logic coverted to bytes
  const [bgImgByt, logoImgByt] = await Promise.all([
    imgToBytes(bgImg),
    imgToBytes(logoImg)
  ])
  
  const blueColor = rgb(.18, .47, .58)
  const grayColor = rgb(.29, .35, .4)
  const grayDarkColor = rgb(.13, .13, .13)
  const whiteColor = rgb(1, 1, 1)
  const fontSizeBase = 14
  const fontSizeText = fontSizeBase / 1.4
  const fontSizeTextDescription = fontSizeBase / 1.3
  const fontSizeCaption = fontSizeBase / 2
  const fontSizeTitle = fontSizeBase / 1.2
  const margiBaseX = 50
  const margiBaseY = 50
  
  const pdfDoc = await PDFDocument.create()
  const [fontBase, fontBold, bgImage, logoImage] = await Promise.all([
    pdfDoc.embedFont(StandardFonts.Helvetica),
    pdfDoc.embedFont(StandardFonts.HelveticaBold),
    pdfDoc.embedJpg(bgImgByt!),
    pdfDoc.embedPng(logoImgByt!)
  ])

  for (const data of allData) {
    let qrImage: PDFImage | undefined = undefined
    if (data.paymentInfo.urlQr) {
      const qrImg64 = await generateQR(data.paymentInfo.urlQr)
      const qrbyt = base64ToByteArray(qrImg64.split('base64,')[1])
      qrImage = await pdfDoc.embedPng(qrbyt)  
    }

    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    
    let heightCursor = height - margiBaseY
    const marginRight = width - margiBaseX
  
    const lineGridX = ({
      page,
      thickness,
      color = grayColor,
      xInit = InvoiceRightX
    }: { page: PDFPage, thickness: number, xInit?: number, color?: RGB }) => {
      page.drawLine({
        start: { x: xInit, y: heightCursor },
        end: { x: marginRight, y: heightCursor },
        thickness,
        color
      });
    }
  
    const alingTextRight = ({
      textLength,
      fontSize,
      spread,
      initX = 75
    }: { spread: number, initX: number, textLength: number, fontSize: number }) => {
      return initX + spread - (textLength * fontSize * 0.6)
    }
    
    page.drawImage(bgImage, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    })
  
    page.drawLine({
      start: { x: marginRight - 15, y: heightCursor },
      end: { x: marginRight, y: heightCursor },
      thickness: 2,
      color: blueColor
    });
  
    heightCursor -= fontSizeBase
    const imgHeigth = logoImage.height / 4
    
    page.drawImage(logoImage, {
      x: margiBaseX,
      y: heightCursor - imgHeigth,
      width: logoImage.width / 4,
      height: imgHeigth,
    })
    
    page.drawText('Immersive Vision', {
      x: marginRight - 57,
      y: heightCursor,
      size: fontSizeCaption,
      font: fontBold,
      color: whiteColor,
    })
  
    heightCursor -= fontSizeBase + imgHeigth
  
    page.drawLine({
      start: { x: margiBaseX, y: heightCursor },
      end: { x: marginRight, y: heightCursor },
      thickness: 1,
      color: blueColor
    });
  
    heightCursor -= fontSizeBase
    const invoiceHeigth = 80
    page.drawText(data.pdfData.isInvoice ? 'INVOICE' : 'BUDGET', {
      x: margiBaseX + fontSizeBase + 7,
      y: heightCursor - fontSizeBase - invoiceHeigth,
      rotate: { angle: 90, type: RotationTypes.Degrees },
      size: fontSizeBase * 1.7,
      font: fontBold,
      color: blueColor,
    })
  
    const InvoiceRightX = margiBaseX + fontSizeBase + 18
    
    page.drawText('Issued to:', {
      x: InvoiceRightX,
      y: heightCursor - fontSizeBase,
      size: fontSizeText,
      font: fontBase,
      color: whiteColor,
    })
  
    page.drawText('Due date:', {
      x: marginRight - 45,
      y: heightCursor - fontSizeBase,
      size: fontSizeText,
      font: fontBase,
      color: whiteColor,
    })
  
    heightCursor -= fontSizeBase
    
    page.drawText(formatDateToDDMMYYYY(data.pdfData.dateCreation), {
      x: InvoiceRightX,
      y: heightCursor - fontSizeBase,
      size: fontSizeText * .8,
      font: fontBase,
      color: whiteColor,
    })
  
    page.drawText(formatDateToDDMMYYYY(data.pdfData.dateExpiration), {
      x: marginRight - 60,
      y: heightCursor - fontSizeBase,
      size: fontSizeBase / 1.2,
      font: fontBold,
      color: whiteColor,
    })
  
    heightCursor -= fontSizeBase
  
    page.drawText(data.client.name, {
      x: InvoiceRightX,
      y: heightCursor - fontSizeBase,
      size: fontSizeTitle,
      font: fontBold,
      color: whiteColor,
    })
  
    heightCursor -= fontSizeBase
  
    page.drawText('A: ' + data.client.address, {
      x: InvoiceRightX,
      y: heightCursor - fontSizeBase,
      size: fontSizeText,
      font: fontBase,
      color: whiteColor,
    })
  
    heightCursor -= fontSizeBase
  
    page.drawText('M: ' + data.client.email, {
      x: InvoiceRightX,
      y: heightCursor - fontSizeBase,
      size: fontSizeText,
      font: fontBase,
      color: whiteColor,
    })
  
    heightCursor -= fontSizeBase
  
    page.drawText('P: ' + data.client.phone, {
      x: InvoiceRightX,
      y: heightCursor - fontSizeBase,
      size: fontSizeText,
      font: fontBase,
      color: whiteColor,
    })
  
    heightCursor -= fontSizeBase * 2.5
  
    page.drawLine({
      start: { x: margiBaseX * 2, y: heightCursor },
      end: { x: marginRight, y: heightCursor },
      thickness: 1,
      color: blueColor
    });
  
    page.drawLine({
      start: { x: 10, y: heightCursor },
      end: { x: 70, y: heightCursor },
      thickness: 1,
      color: blueColor
    });
  
    heightCursor -= 4
  
    page.drawText('Project ref: ' + data.pdfData.idProject, {
      x: InvoiceRightX,
      y: heightCursor - fontSizeBase,
      size: fontSizeCaption,
      font: fontBase,
      color: whiteColor,
    })
  
    page.drawText('Invoice Nro: ' + data.pdfData.id, {
      x: InvoiceRightX + width / 4 - 30,
      y: heightCursor - fontSizeBase,
      size: fontSizeCaption,
      font: fontBase,
      color: whiteColor,
    })
  
    page.drawText(`Installments: ${data.mountInvoice.currentInstallment} of ${data.mountInvoice.totalInstallment}`, {
      x: InvoiceRightX + width / 2 - 30,
      y: heightCursor - fontSizeBase,
      size: fontSizeCaption,
      font: fontBase,
      color: whiteColor,
    })
  
    page.drawText(`${numberToUSD(0)} of ${numberToUSD(data.pdfData.descriptions.reduce((acc, val) => acc + val.amount, 0))}`, {
      x: marginRight - 80,
      y: heightCursor - fontSizeBase,
      size: fontSizeCaption,
      font: fontBase,
      color: whiteColor,
    })
  
    heightCursor -= fontSizeBase * 4 
  
    page.drawText('DESCRIPTION', {
      x: InvoiceRightX,
      y: heightCursor - fontSizeBase,
      size: fontSizeText,
      font: fontBase,
      color: whiteColor,
    })
  
    const verticalLinegrid = marginRight - 70
  
    page.drawLine({
      start: { x: verticalLinegrid, y: heightCursor },
      end: { x: verticalLinegrid, y: heightCursor - fontSizeBase - 5 },
      thickness: 1,
      color: grayColor
    });
  
    page.drawText('AMOUNT', {
      x: marginRight - 60,
      y: heightCursor - fontSizeBase,
      size: fontSizeText,
      font: fontBase,
      color: whiteColor,
    })
  
    heightCursor -= fontSizeBase * 2
    lineGridX({page, thickness: 2 })
    heightCursor -= fontSizeBase
    
    page.drawText(data.pdfData?.descriptions[0]?.description ?? '', {
      x: InvoiceRightX,
      y: heightCursor - fontSizeBase,
      size: fontSizeText,
      font: fontBase,
      color: whiteColor,
    })
    
    const heightLineGrid = fontSizeBase + 10
    const initVerticalLineGrid = heightCursor + 5
    const finalVerticalLineGrid = heightCursor - heightLineGrid * 9
    
    const textLength = '$00,000.00'.length
    const mountPositionX = alingTextRight({
      fontSize: fontSizeText,
      initX: verticalLinegrid,
      textLength,
      spread: 75
    })
    
    page.drawText(numberToUSD(data.pdfData?.descriptions[0]?.amount), {
      x: alingTextRight({
        fontSize: fontSizeTextDescription,
        initX: verticalLinegrid,
        textLength,
        spread: 70
      }),
      y: heightCursor - fontSizeBase,
      size: fontSizeTextDescription,
      font: fontBase,
      color: whiteColor,
    })
  
    const shorInitLineX = width - width / 2.7
  
    heightCursor -= heightLineGrid
    lineGridX({ page, thickness: 1 })
    heightCursor -= heightLineGrid
    lineGridX({ page, thickness: 1 })
    heightCursor -= heightLineGrid
    lineGridX({ page, thickness: 1 })
    heightCursor -= heightLineGrid
    lineGridX({ page, thickness: 1 })
    heightCursor -= heightLineGrid
    lineGridX({ page, thickness: 1 })
    heightCursor -= heightLineGrid
    lineGridX({ page, thickness: 1 })
  
    page.drawText(`Phase #${data.mountInvoice.currentInstallment}:`, {
      x: alingTextRight({
        fontSize: fontSizeText,
        initX: verticalLinegrid,
        textLength: `Phase #${data.mountInvoice.currentInstallment}:`.length,
        spread: 5
      }),
      y: heightCursor - (heightLineGrid + fontSizeText) / 2,
      size: fontSizeText,
      font: fontBold,
      color: blueColor,
    })
  
    page.drawText(numberToUSD(data.mountInvoice.mount), {
      x: mountPositionX,
      y: heightCursor - (heightLineGrid + fontSizeText) / 2,
      size: fontSizeText,
      font: fontBold,
      color: blueColor,
    })
  
    heightCursor -= heightLineGrid
    lineGridX({ page, thickness: 1, xInit: shorInitLineX, color: grayDarkColor })
    
    page.drawText('Paid in this phase:', {
      x: alingTextRight({
        fontSize: fontSizeText,
        initX: verticalLinegrid,
        textLength: 'Paid in this ph'.length,
        spread: 0
      }),
      y: heightCursor - (heightLineGrid + fontSizeText) / 2,
      size: fontSizeText,
      font: fontBold,
      color: blueColor,
    })
  
    page.drawText(numberToUSD(data.mountInvoice.paidMount), {
      x: mountPositionX,
      y: heightCursor - (heightLineGrid + fontSizeText) / 2,
      size: fontSizeText,
      font: fontBold,
      color: blueColor,
    })
  
    heightCursor -= heightLineGrid
    lineGridX({ page, thickness: 1, xInit: shorInitLineX, color: grayDarkColor })
  
    page.drawText('Pending in this phase:', {
      x: alingTextRight({
        fontSize: fontSizeText,
        initX: verticalLinegrid,
        textLength: 'Pending in this ph'.length,
        spread: 0
      }),
      y: heightCursor - (heightLineGrid + fontSizeText) / 2,
      size: fontSizeText,
      font: fontBold,
      color: blueColor,
    })
  
    page.drawText(numberToUSD(data.mountInvoice.pendingMount), {
      x: mountPositionX,
      y: heightCursor - (heightLineGrid + fontSizeText) / 2,
      size: fontSizeText,
      font: fontBold,
      color: blueColor,
    })
  
    page.drawLine({
      start: { x: verticalLinegrid, y: initVerticalLineGrid },
      end: { x: verticalLinegrid, y: finalVerticalLineGrid },
      thickness: 1,
      color: grayColor
    });
  
    heightCursor -= heightLineGrid * 2 
  
    page.drawLine({
      start: { x: InvoiceRightX + 15, y: heightCursor },
      end: { x: InvoiceRightX, y: heightCursor },
      thickness: 2,
      color: blueColor
    });
  
    heightCursor -= heightLineGrid
  
    if (data.pdfData.isInvoice) {
      page.drawText('PAYMENT INFORMATION', {
        x: InvoiceRightX,
        y: heightCursor,
        size: fontSizeTitle,
        font: fontBold,
        color: blueColor,
      })
    
      heightCursor -= heightLineGrid - 5
      const descriptionX = InvoiceRightX + 70
    
      page.drawText('Company name:', {
        x: InvoiceRightX,
        y: heightCursor,
        size: fontSizeCaption,
        font: fontBold,
        color: whiteColor,
      })
    
      page.drawText(data.paymentInfo.companyName, {
        x: descriptionX,
        y: heightCursor,
        size: fontSizeCaption,
        font: fontBase,
        color: whiteColor,
      })
  
      if (qrImage) {
        page.drawImage(qrImage, {
          x: marginRight - qrImage.width / 2,
          y: heightCursor - qrImage.height / 2,
          width: qrImage.width / 2,
          height: qrImage.height / 2,
        })
      }
    
      heightCursor -= fontSizeTextDescription
    
      page.drawText('Bank name:', {
        x: InvoiceRightX,
        y: heightCursor,
        size: fontSizeCaption,
        font: fontBold,
        color: whiteColor,
      })
    
      page.drawText(data.paymentInfo.bankName, {
        x: descriptionX,
        y: heightCursor,
        size: fontSizeCaption,
        font: fontBase,
        color: whiteColor,
      })
    
      heightCursor -= fontSizeTextDescription
    
      page.drawText('Account number:', {
        x: InvoiceRightX,
        y: heightCursor,
        size: fontSizeCaption,
        font: fontBold,
        color: whiteColor,
      })
    
      page.drawText(data.paymentInfo.accountNumber?.toString() ?? '', {
        x: descriptionX,
        y: heightCursor,
        size: fontSizeCaption,
        font: fontBase,
        color: whiteColor,
      })
    
      heightCursor -= fontSizeTextDescription
    
      page.drawText('Routing number:', {
        x: InvoiceRightX,
        y: heightCursor,
        size: fontSizeCaption,
        font: fontBold,
        color: whiteColor,
      })
    
      page.drawText(data.paymentInfo.routingNumber?.toString() ?? '', {
        x: descriptionX,
        y: heightCursor,
        size: fontSizeCaption,
        font: fontBase,
        color: whiteColor,
      })
    
      heightCursor -= fontSizeTextDescription
    
      page.drawText('Zelle:', {
        x: InvoiceRightX,
        y: heightCursor,
        size: fontSizeCaption,
        font: fontBold,
        color: whiteColor,
      })
    
      page.drawText(data.paymentInfo.zelle, {
        x: descriptionX,
        y: heightCursor,
        size: fontSizeCaption,
        font: fontBase,
        color: whiteColor,
      })
    }
  
    heightCursor -= fontSizeBase * 3
  
    page.drawLine({
      start: { x: InvoiceRightX, y: heightCursor },
      end: { x: marginRight, y: heightCursor },
      thickness: 1,
      color: blueColor
    });
  
    heightCursor -= fontSizeBase * 1.5
  
    page.drawText('I M M E R S I V E   V I S I O N', {
      x: width / 2 - 50,
      y: heightCursor,
      size: fontSizeText,
      font: fontBase,
      color: blueColor,
    })
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  
  return url;
}