'use client';
import { Anchor, AppShell, AppShellNavbar, AppShellSection, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import logoComppany from '@/../public/page6/LOGO_IMVI.webp';
import { useEffect, useState } from 'react';
import { BG_COLOR, LOGOUT_URL_SERVER, PRIMARY_COLOR_RGB } from '@/utils/consts';
import { CustomText } from '@/components/customText';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { useFetch } from '@/hooks/useFetch';
import { fetchMethod } from '@/utils/enums';
import { useRouter } from 'next/navigation';


interface configI {
  href: string;
  title: string;
}

const hrefbase = '/app'
const config: configI[] = [
  {
    href: hrefbase + '/calculator',
    title: 'Calculator'
  }, {
    href: hrefbase + '/method-payment',
    title: 'Method payment'
  }, {
    href: hrefbase + '/client',
    title: 'Client'
  }, {
    href: hrefbase + '/project',
    title: 'Project'
  }, {
    href: hrefbase + '/complete-invoice',
    title: 'Complete invoice'
  }
]

const ElementNavBar = ({ item, url, onClick = () => {} }: { url: string, onClick?: () => void, item: configI}) => {
  return <Anchor
    onClick={onClick} 
    href={item.href}
    style={{
      marginTop: '1vh',
      width: '100%',
      textDecoration: 'none', 
      flex: 1,
      display: 'flex',
      color: 'inherit',
      backgroundColor: url === item.href ? PRIMARY_COLOR_RGB(.1) : 'transparent',
      borderRadius: '.3rem',
      padding: '1rem',
    }}
  >
    <CustomText style={{ fontSize: '1.2rem' }} >
      {item.title}
    </CustomText>
  </Anchor>
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [url, setUrl] = useState<string>(hrefbase)
  const { sendF } = useFetch()
  const router = useRouter()

  const logout = async() => {
    notifyShowBase({
      id: 'test',
      title: 'Sending login',
      message: 'Wait a momment..',
      loading: true
    })
    const responseServer = await sendF({ endpoint: LOGOUT_URL_SERVER, method: fetchMethod.GET })
    
    if (!responseServer.hasError) {
      router.push('/app/login');
    }
    notifyUpdateBase({
      id: 'test',
      title: responseServer.hasError ? 'Error' : 'login sent',
      message: responseServer.message,
      loading: false
    })
  }
  
  const checkUrl = (url: string) => {
    const endpoint: string | undefined = url.split(hrefbase)[1]

    if (endpoint) setUrl(hrefbase + endpoint)
  }

  useEffect(() => {
    checkUrl(window.location.href)
  }, [])

  return (
    <AppShell
      padding="md"
      styles={{ header: { backgroundColor: BG_COLOR }, navbar: { backgroundColor: BG_COLOR } }}
      header={{ height: '10vh' }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: '2rem' }}>
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
        <Image
          alt='Company logo'
          src={logoComppany.src}
          width={logoComppany.width / 3}
          height={logoComppany.height / 3}
        />
      </AppShell.Header>
      <AppShell.Navbar p="2rem" >
        <AppShellNavbar p="md">
          <AppShellSection grow mt="md">
            {config.map((item) => (
              <ElementNavBar item={item} url={url} key={item.href} />
            ))}
            <ElementNavBar item={{ href:'',  title: 'Logout' }} url={url} onClick={logout} />
          </AppShellSection>
        </AppShellNavbar>
      </AppShell.Navbar>
      <AppShell.Main >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}