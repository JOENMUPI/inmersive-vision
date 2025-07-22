'use client'
import { Container, Grid, Image } from '@mantine/core';
import { PAGE_TEMPLPATE_4_ID } from '@/utils/consts';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { data4I } from '@/app/template/utils/interfaces';

export default function Page4({ data }: { data: data4I }) {
  const { isXS } = useBreakPointHandler()
  
  return (
    <Container id={PAGE_TEMPLPATE_4_ID} style={{
      minWidth:'100%',
      height: isXS ? '850vh' : '410vh',
      padding: 0,
      }}>
      <Grid gutter={{ base: 0 }}>
        <Grid.Col span={{ base: 12, xs: 6 }}>
          <Grid gutter={{ base: 0 }}>
            <Grid.Col h='25vh' span={{ base: 12, xs: 7 }}>
              <Image
                alt='kuku'
                src={data.imgs[0]}
                style={{
                  width: '100%',
                  height:  '100%',
                }}
              />  
            </Grid.Col>
            <Grid.Col h='25vh' span={{ base: 12, xs: 5 }}>
              <Image
                alt='kuku'
                src={data.imgs[1]}
                style={{
                  width: '100%',
                  height:  '100%',
                }}
              />  
            </Grid.Col>
            <Grid.Col h='60vh' span={{ base: 12, xs: 12 }}>
              <Image
                alt='kuku'
                src={data.imgs[2]}
                style={{
                  width: '100%',
                  height:  '100%',
                }}
              />  
            </Grid.Col>
            <Grid.Col h='75vh' span={{ base: 12, xs: 12 }}>
              <Image
                alt='kuku'
                src={data.imgs[3]}
                style={{
                  width: '100%',
                  height:  '100%',
                }}
              />  
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>
          <Grid gutter={{ base: 0 }}>
            <Grid.Col h='50vh' span={{ base: 12, xs: 12 }}>
              <Image
                alt='kuku'
                src={data.imgs[4]}
                style={{
                  width: '100%',
                  height:  '100%',
                }}
              />    
            </Grid.Col>
            <Grid.Col h='110vh' span={{ base: 12, xs: 12 }}>
              <Image
                alt='kuku'
                src={data.imgs[5]}
                style={{
                  width: '100%',
                  height:  '100%',
                }}
              />    
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col h='50vh' span={{ base: 12, xs: 4 }}>
          <Image
            alt='kuku'
            src={data.imgs[6]}
            style={{
              width: '100%',
              height:  '100%',
            }}
          />  
        </Grid.Col>
        <Grid.Col h='50vh' span={{ base: 12, xs: 4 }}>
          <Image
            alt='kuku'
            src={data.imgs[7]}
            style={{
              width: '100%',
              height:  '100%',
            }}
          />  
        </Grid.Col>
        <Grid.Col h='50vh'   span={{ base: 12, xs: 4 }}>
          <Image
            alt='kuku'
            src={data.imgs[8]}
            style={{
              width: '100%',
              height:  '100%',
            }}
          />  
        </Grid.Col>
        <Grid.Col h='60vh' span={{ base: 12, xs: 6 }}>
          <Image
            alt='kuku'
            src={data.imgs[9]}
            style={{
              width: '100%',
              height:  '100%',
            }}
          />  
        </Grid.Col>
        <Grid.Col h='60vh' span={{ base: 12, xs: 6 }}>
          <Image
            alt='kuku'
            src={data.imgs[10]}
            style={{
              width: '100%',
              height:  '100%',
            }}
          />  
        </Grid.Col>
        <Grid.Col h='90vh' span={{ base: 12, xs: 12 }}>
          <Image
            alt='kuku'
            src={data.imgs[11]}
            style={{
              width: '100%',
              height:  '100%',
            }}
          />  
        </Grid.Col>
        <Grid.Col h='50vh' span={{ base: 12, xs: 4 }}>
          <Image
            alt='kuku'
            src={data.imgs[12]}
            style={{
              width: '100%',
              height:  '100%',
            }}
          />  
        </Grid.Col>
        <Grid.Col h='50vh' span={{ base: 12, xs: 4 }}>
          <Image
            alt='kuku'
            src={data.imgs[13]}
            style={{
              width: '100%',
              height:  '100%',
            }}
          />  
        </Grid.Col>
        <Grid.Col h='50vh' span={{ base: 12, xs: 4 }}>
          <Image
            alt='kuku'
            src={data.imgs[14]}
            style={{
              width: '100%',
              height:  '100%',
            }}
          />  
        </Grid.Col>
      </Grid>
    </Container>
  );
};