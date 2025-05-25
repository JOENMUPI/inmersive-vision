'use client';
import { Anchor, AppShell, AppShellNavbar, AppShellSection, Burger, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import logoComppany from '@/../public/page6/LOGO_IMVI.webp';
import { useEffect, useState } from 'react';
import { CustomText } from '@/components/customText';
import { notifyShowBase, notifyUpdateBase } from '@/utils/notifications';
import { useFetch } from '@/hooks/useFetch';
import { fetchMethod } from '@/utils/enums';
import { useRouter } from 'next/navigation';
import {
  BASE_URL_CLIENT,
  BG_COLOR,
  CALCULATOR_URL_CLIENT,
  CLIENT_URL_CLIENT,
  INVOICE_COMPLETE_URL_CLIENT,
  LOGOUT_URL_SERVER,
  METHOD_PAYMENT_URL_CLIENT,
  PRIMARY_COLOR_RGB,
  PROJECT_URL_CLIENT
} from '@/utils/consts';

interface linkI {
  href: string;
  title: string;
}

interface wrapperI {
  label: string
  href?: string
  links: linkI[]
}

const config: wrapperI[] = [
  {
    label: 'Calculator',
    href: CALCULATOR_URL_CLIENT,
    links: []
  }, {
    label: 'Payment method',
    links: [{
      href: METHOD_PAYMENT_URL_CLIENT,
      title: 'Payment method managment'
    },{
      href: METHOD_PAYMENT_URL_CLIENT + '/list',
      title: 'Payment method list'
    }]
  }, {
    label: 'Client',
    links: [{
      href: CLIENT_URL_CLIENT,
      title: 'Client managment'
    },{
      href: CLIENT_URL_CLIENT + '/list',
      title: 'Client list'
    }]
  }, {
    label: 'Project',
    links: [{
      href: PROJECT_URL_CLIENT,
      title: 'Project managment'
    },{
      href: PROJECT_URL_CLIENT + '/list',
      title: 'Project list'
    }]
  }, {
    label: 'Complete invoice',
    links: [{
      href: INVOICE_COMPLETE_URL_CLIENT,
      title: 'Complete invoice managment'
    },{
      href: INVOICE_COMPLETE_URL_CLIENT + '/list',
      title: 'Complete invoice list'
    }]
  }
]

const ElementNavBar = ({
  item,
  url,
  onClick = () => {}
}: { url: string, onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void, item: linkI }) => {
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
  const [url, setUrl] = useState<string>(BASE_URL_CLIENT)
  const { sendF } = useFetch()
  const router = useRouter()

  const logout = async(e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
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
    const endpoint: string | undefined = url.split(BASE_URL_CLIENT)[1]

    if (endpoint) setUrl(BASE_URL_CLIENT + endpoint)
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
            {config.map((item) => {
              const isSelected: boolean = item.links.filter(val => val.href === url).length > 0
              if (item.href) return <ElementNavBar item={{ href: item.href, title: item.label }} url={url} key={item.href}/>
              else return <NavLink
                key={item.label}
                label={item.label}
                style={{
                  backgroundColor: isSelected ? PRIMARY_COLOR_RGB(.1) : 'transparent',
                }}
                styles={{
                  label: {
                    fontSize: '1.2rem',
                    marginTop: '1vh',
                  }
                }}
              >
              {item.links.map((link) => (
                <ElementNavBar item={link} url={url} key={link.href}/>
              ))}
              </NavLink>
            })}
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