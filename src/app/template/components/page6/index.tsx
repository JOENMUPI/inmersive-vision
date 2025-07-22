'use client'
import { Box, Container } from '@mantine/core';
import { PAGE_TEMPLPATE_6_ID, TEXT_COLOR_GRAY } from '@/utils/consts';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { CustomText } from '@/components/customText';
import { data6I } from '@/app/template/utils/interfaces';

export default function Page6({ data }: { data: data6I }) {
  const { isXS } = useBreakPointHandler()

  return (
    <Container id={PAGE_TEMPLPATE_6_ID} style={{
      minWidth:'100%',
      height: '100vh',
      padding: 0,
      }}>
      <Box style={{
         width: '100%',
        height: '100%',
        display: 'flex',
        gap: '2rem',
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <CustomText style={{ fontSize:'3rem', textAlign: 'center', color: TEXT_COLOR_GRAY }}>
          {data.title}
        </CustomText>
        <iframe
          style={{ border: `1px solid ${TEXT_COLOR_GRAY}` }}
          width={isXS ? '100%' : "98%"}
          height="100%"
          src={data.url}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </Box>
    </Container>
  );
};