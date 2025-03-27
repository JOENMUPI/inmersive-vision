import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css';
import '@/styles/globals.css'
import React from "react";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
  createTheme,
} from "@mantine/core";
import { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import { HeaderMenu } from '@/components/header';
import { Notifications } from '@mantine/notifications';
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Imersive Vision",
  description: "LandingPage for Imersive Vision",
  icons: '/favicon.ico',
};

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  userScalable: false,
  colorScheme: 'dark',
}

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: '400',
});

export const ThemeMantine = createTheme({
  primaryColor: 'blue',
  
  colors: {
    dark: [
      '#d5d7e0',
      '#acaebf',
      '#8c8fa3',
      '#666980',
      '#4d4f66',
      '#34354a',
      '#2b2c3d',
      '#151515', // background
      '#0c0d21',
      '#01010a',
    ],
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps} style={{ fontSize: '14px' }}>
      <head>
        <Analytics/>
        <link rel="preconnect" href="https://www.youtube.com/embed/jyznBJswDZc?si=HoRPijf6m0Tvslwu" />
        <link rel="preconnect" href="https://www.youtube.com/embed/bylU-_5BihU" />
        <ColorSchemeScript />
      </head>
      <body className={montserrat.className} >
        <MantineProvider theme={ThemeMantine} defaultColorScheme='dark' forceColorScheme='dark'>
          <Notifications position='top-center' />
          <HeaderMenu />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}