'use client'
import { Container, Grid, Image, Modal } from '@mantine/core';
import { PAGE_TEMPLPATE_4_ID } from '@/utils/consts';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { data4I } from '@/app/template/utils/interfaces';
import { useState } from 'react';
import { Carousel } from '@mantine/carousel';

export default function Page4({ data }: { data: data4I }) {
  const { isXS } = useBreakPointHandler()
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imgIndexModal, setImgIndexModal] = useState<number>(0);
  
  const handleModal = ({ imgIndex, showModal }: { imgIndex: number, showModal: boolean }) => {
    setImgIndexModal(imgIndex);
    setShowModal(showModal)
  }

  return (
    <Container id={PAGE_TEMPLPATE_4_ID} style={{
      minWidth:'100%',
      height: isXS ? '850vh' : '410vh',
      padding: 0,
      backgroundColor: '#0a0a0a',
      }}>
      <Modal
        opened={showModal}
        fullScreen
        onClose={() => handleModal({ imgIndex: imgIndexModal, showModal: false })}
        styles={{ body: { padding: 0 }}}
      >
        <Carousel withIndicators height='90vh'  styles={{ control: { backgroundColor: 'red' } }} controlSize='50' autoFocus={showModal} initialSlide={imgIndexModal}>
          {data.imgs.map((val, index) => 
            <Carousel.Slide key={index} >
              <Image
                onClick={() => handleModal({ imgIndex: imgIndexModal, showModal: false })}
                alt={`Carousel-img-${val}`}
                src={val}
                fit='contain'
                style={{
                  width: '100%',
                  height:  '100%',
                }}
              />
            </Carousel.Slide>)
          }
        </Carousel>
      </Modal>
      <Grid gutter={{ base: 0 }}>
        <Grid.Col span={{ base: 12, xs: 6 }}>
          <Grid gutter={{ base: 0 }}>
            <Grid.Col h='25vh' span={{ base: 12, xs: 7 }}>
              <Image
                onClick={() => handleModal({ imgIndex: 0, showModal: true })}
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
                onClick={() => handleModal({ imgIndex: 1, showModal: true })}
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
                onClick={() => handleModal({ imgIndex: 2, showModal: true })}
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
                onClick={() => handleModal({ imgIndex: 3, showModal: true })}
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
                onClick={() => handleModal({ imgIndex: 4, showModal: true })}
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
                onClick={() => handleModal({ imgIndex: 5, showModal: true })}
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
            onClick={() => handleModal({ imgIndex: 6, showModal: true })}
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
            onClick={() => handleModal({ imgIndex: 7, showModal: true })}
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
            onClick={() => handleModal({ imgIndex: 8, showModal: true })}
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
            onClick={() => handleModal({ imgIndex: 9, showModal: true })}
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
            onClick={() => handleModal({ imgIndex: 10, showModal: true })}
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
            onClick={() => handleModal({ imgIndex: 11, showModal: true })}
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
            onClick={() => handleModal({ imgIndex: 12, showModal: true })}
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
            onClick={() => handleModal({ imgIndex: 13, showModal: true })}
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
            onClick={() => handleModal({ imgIndex: 14, showModal: true })}
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