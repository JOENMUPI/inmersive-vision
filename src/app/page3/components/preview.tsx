import { useBreakPointHandler } from "@/hooks/breakpointHandler";
import { PRIMARY_COLOR_HEX, PRIMARY_COLOR_RGB } from "@/utils/conts";
import { ActionIcon, Box, Image, Text } from "@mantine/core";
import React from "react";

interface previewI {
  image: string,
  icon: React.ReactNode,
  title: string,
  isSelected: boolean,
  onClick: () => void
}

export function Preview({
  image,
  icon,
  title,
  isSelected,
  onClick
}: previewI) {
  const { getByBreakPoint, isXS } = useBreakPointHandler()
  
  return (
    isXS 
    ? <Box style={{
      display: 'flex',
      width:'100%',
      height: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',

    }}>
      <ActionIcon
        size='xl'
        variant="transparent"
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <Box onClick={onClick} style={{
          backgroundColor: isSelected ? PRIMARY_COLOR_RGB(.4) : '',
          borderRadius: '1rem',
          height: '5rem',
          width: '5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: isSelected ? '0 0 4rem 0 rgba(0, 0, 0, .5)' : 'none',
          transition: 'all .2s ease',
        }}>
          {React.isValidElement(icon) ? icon : null}
          {/* {icon} */}
        </Box>
      </ActionIcon>
    </Box>
    : <Box style={{
      width: getByBreakPoint<string>('30%', '30%', '20%', '17%', '14%'),
      height:  isXS ? '40%' : '80%',
      transition: 'all .2s ease',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    }}>
    <Box
      onClick={onClick}
      style={{
        cursor: 'pointer',
        height: '98%',
        width: '96%',
        transition: 'all .2s ease',
        position: 'relative',
        borderRight: isSelected ? '1px solid white' : 'none',
        borderLeft: isSelected ? '1px solid white' : 'none',
        borderTop: isSelected ? '1px solid white' : 'none',
        boxShadow: isSelected ? '0 0 4rem 0 rgba(0, 0, 0, .5)' : 'none',
      }}>
      <Image
        style={{
          height: '100%',
          width: '100%',
        }}
        src={image}
        alt='dinamic-preview'
      />
      <Box style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        flexDirection: 'column',
        paddingBottom: '5%',
        gap: '2rem',
        transition: 'all .2s ease',
        background: isSelected
          ? `linear-gradient(to top, ${PRIMARY_COLOR_RGB(.4)} 0%, rgba(0, 0, 0, 0) 100%)`
          : ' rgba(0, 0, 0, .7)',
      }}>
        {icon}
        <Text style={{
          transition: 'all .2s ease',
          fontSize: getByBreakPoint<string>('.7rem', '.8rem', '.8rem', '.9rem', '1rem'),
        }}>
          {title}
        </Text>
      </Box>
    </Box>
    <Box style={{
      transition: 'all .2s ease',
      backgroundColor: PRIMARY_COLOR_HEX,
      height: '2%',
      opacity: isSelected ? 1 : 0,
      width: isSelected ? '100%' :'0%',
      zIndex: 2,
      boxShadow: '0 0 4rem 1rem ' + PRIMARY_COLOR_RGB(.5),
    }} />
  </Box>
  )
}