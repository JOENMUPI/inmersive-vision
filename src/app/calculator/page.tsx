'use client'
import { Container } from '@mantine/core';
import { PDFDocument, PDFPage, RGB, RotationTypes, StandardFonts, rgb } from 'pdf-lib'
import bgImg from '@/../public/calculator/background_CLIENT_PAIN.jpg';
import logoImg from '@/../public/calculator/LOGO_IMVI.png';
import { StaticImageData } from 'next/image';

const imgToBytes = async (img: StaticImageData) => {
  const response = await fetch(img.src);
  const blobImg = await response.blob();
  const arrayBuffer = await blobImg.arrayBuffer();
  return new Uint8Array(arrayBuffer); 
} 

const handleDownload = async () => {
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
    pdfDoc.embedJpg(bgImgByt),
    pdfDoc.embedPng(logoImgByt)
  ])
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
  // page.drawText('INVOICE' ?/? 'BUDGET', {
  page.drawText('INVOICE', {
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

  page.drawText('02/02/2025', {
    x: marginRight - 60,
    y: heightCursor - fontSizeBase,
    size: fontSizeBase / 1.2,
    font: fontBold,
    color: whiteColor,
  })

  heightCursor -= fontSizeBase

  page.drawText('Avalon Park Group', {
    x: InvoiceRightX,
    y: heightCursor - fontSizeBase,
    size: fontSizeTitle,
    font: fontBold,
    color: whiteColor,
  })

  heightCursor -= fontSizeBase

  page.drawText('A: 13525 Mirror Lake Drive, Orlando FL', {
    x: InvoiceRightX,
    y: heightCursor - fontSizeBase,
    size: fontSizeText,
    font: fontBase,
    color: whiteColor,
  })

  heightCursor -= fontSizeBase

  page.drawText('M: email@gmial.com', {
    x: InvoiceRightX,
    y: heightCursor - fontSizeBase,
    size: fontSizeText,
    font: fontBase,
    color: whiteColor,
  })

  heightCursor -= fontSizeBase

  page.drawText('P: 4077758395', {
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

  page.drawText('Project ref: P567', {
    x: InvoiceRightX,
    y: heightCursor - fontSizeBase,
    size: fontSizeCaption,
    font: fontBase,
    color: whiteColor,
  })

  page.drawText('Invoice Nro: 020225-001', {
    x: InvoiceRightX + width / 4 - 30,
    y: heightCursor - fontSizeBase,
    size: fontSizeCaption,
    font: fontBase,
    color: whiteColor,
  })

  page.drawText('Installments: 1 of 3', {
    x: InvoiceRightX + width / 2 - 30,
    y: heightCursor - fontSizeBase,
    size: fontSizeCaption,
    font: fontBase,
    color: whiteColor,
  })

  page.drawText('Date issued: 02/02/2025', {
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
  
  page.drawText('Renacer description', {
    x: InvoiceRightX,
    y: heightCursor - fontSizeBase,
    size: fontSizeText,
    font: fontBase,
    color: whiteColor,
  })
  
  const heightLineGrid = fontSizeBase + 10
  const initVerticalLineGrid = heightCursor + 5
  const finalVerticalLineGrid = heightCursor - heightLineGrid * 9
  
  const mountPositionX = alingTextRight({
    fontSize: fontSizeText,
    initX: verticalLinegrid,
    textLength: '$00,000.00'.length,
    spread: 75
  })
  
  page.drawText('$00,0000.00', {
    x: alingTextRight({
      fontSize: fontSizeTextDescription,
      initX: verticalLinegrid,
      textLength: '$00,000.00'.length,
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

  page.drawText('Subtotal:', {
    x: alingTextRight({
      fontSize: fontSizeText,
      initX: verticalLinegrid,
      textLength: 'Subtotal:'.length,
      spread: 5
    }),
    y: heightCursor - (heightLineGrid + fontSizeText) / 2,
    size: fontSizeText,
    font: fontBold,
    color: blueColor,
  })

  page.drawText('$00,000.00', {
    x: mountPositionX,
    y: heightCursor - (heightLineGrid + fontSizeText) / 2,
    size: fontSizeText,
    font: fontBold,
    color: blueColor,
  })

  heightCursor -= heightLineGrid
  lineGridX({ page, thickness: 1, xInit: shorInitLineX, color: grayDarkColor })
  
  page.drawText('Paid:', {
    x: alingTextRight({
      fontSize: fontSizeText,
      initX: verticalLinegrid,
      textLength: 'Paid:'.length,
      spread: 0
    }),
    y: heightCursor - (heightLineGrid + fontSizeText) / 2,
    size: fontSizeText,
    font: fontBold,
    color: blueColor,
  })

  page.drawText('$00,000.00', {
    x: mountPositionX,
    y: heightCursor - (heightLineGrid + fontSizeText) / 2,
    size: fontSizeText,
    font: fontBold,
    color: blueColor,
  })

  heightCursor -= heightLineGrid
  lineGridX({ page, thickness: 1, xInit: shorInitLineX, color: grayDarkColor })

  page.drawText('Pending:', {
    x: alingTextRight({
      fontSize: fontSizeText,
      initX: verticalLinegrid,
      textLength: 'Pending:'.length,
      spread: 0
    }),
    y: heightCursor - (heightLineGrid + fontSizeText) / 2,
    size: fontSizeText,
    font: fontBold,
    color: blueColor,
  })

  page.drawText('$00,000.00', {
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

  page.drawText('Architecture & Desing LLC', {
    x: descriptionX,
    y: heightCursor,
    size: fontSizeCaption,
    font: fontBase,
    color: whiteColor,
  })

  heightCursor -= fontSizeTextDescription

  page.drawText('Bank name:', {
    x: InvoiceRightX,
    y: heightCursor,
    size: fontSizeCaption,
    font: fontBold,
    color: whiteColor,
  })

  page.drawText('Bank of America', {
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

  page.drawText('11215144', {
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

  page.drawText('5451154', {
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

  page.drawText('manager@archdesing.llc', {
    x: descriptionX,
    y: heightCursor,
    size: fontSizeCaption,
    font: fontBase,
    color: whiteColor,
  })

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

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  
  window.open(url, '_blank')
  
  // const a = document.createElement('a');
  // a.href = url;
  // a.download = 'documento.pdf';
  // document.body.appendChild(a);
  // a.click();
  // a.remove();
}

export default function Pdf() {

  return (
    <Container style={{
      height: '100vh',
      width: '100%',
      padding: 0,
      
      display: 'flex',
      alignItems: 'center',

    }}>
      <button onClick={handleDownload}>
        Descargar PDF
      </button>
    </Container>
  )
}