'use client'
import { Box, Container } from '@mantine/core';
import { CustomText } from '@/components/customText';
import { PAGE_TEMPLPATE_2_ID, TEXT_COLOR_GRAY } from '@/utils/consts';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { data2I } from '@/app/template/utils/interfaces';

export default function Page2({ data }: { data: data2I }) {
  const { getByBreakPoint } = useBreakPointHandler()
  
  const textSize: string = getByBreakPoint<string>('1.2rem','1.3rem','1.4rem','1.5rem','1.7rem')

  return (
    <Container id={PAGE_TEMPLPATE_2_ID} style={{
      minWidth:'100%',
      height: '40vh',
      padding: 0,
      }}>
      <Box style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        gap: '1rem',
        backgroundColor: '#0a0a0a',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '15vh 12vw 9vh 12vw',
      }}>
        <CustomText style={{
            textAlign:'center',
            fontSize: textSize,
            paddingLeft: '.5rem',
            fontWeight: 600,
          }}>
            {data.title}
        </CustomText>
        <CustomText style={{
          fontWeight: 200,
          color: TEXT_COLOR_GRAY,
          textAlign: 'center',
          fontSize: textSize,
        }}>
          {data.text}
        </CustomText>
      </Box>
    </Container>
  );
};