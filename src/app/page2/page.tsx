'use client'
import { BackgroundImage, Box, Container } from '@mantine/core';
import { CustomText } from '@/components/customText';
import { PAGE_2_ID, PRIMARY_COLOR_HEX, TEXT_COLOR_GRAY } from '@/utils/conts';
import bgImg from '@/../public/page2/background_CLIENT_PAIN.png';
import { useBreakPointHandler } from '@/hooks/breakpointHandler';
import { LineBottom } from '@/components/lineBotton';

interface definitionI {
  title: string,
  description: string,
}

interface data {
  title: string,
  text: string,
  highlight: string,
  definitions: definitionI[],
}

const data: data = {
  highlight: 'Exclusivity',
  title: ' is not an option; it is the standard.',
  text: 'What defines Us?',
  definitions: [
    {
      title: 'Immersive experiences',
      description: 'A gateway to the extraordinary, offering an unique experience that goes beyond the tangible.',
    }, {
      title: 'Unique Identity',
      description: 'Every space tells a story, reflecting the essence and character of those who seek to transcend.'
    }, {
      title: 'Inspiring spaces',
      description: 'We capture the beauty of each space, awakening emotions that linger in memmory.',
    },
  ] 
}

export default function Page2() {
  const { getByBreakPoint, isXS, isSM, isMD } = useBreakPointHandler()

  const titleSize: string = getByBreakPoint<string>('1.2rem','1.3rem','1.5rem','2rem','2.2rem')
  const definitionSize: string = getByBreakPoint<string>('.8rem','.8rem','.9rem','1.1rem','1.4rem')
  const changeDefinitionGridLayout: boolean = !!(isXS || isSM || isMD)
  
  return (
    <Container id={PAGE_2_ID} style={{
      minWidth:'100%',
      height: '100vh',
      padding: 0,
      }}>
      <BackgroundImage
        src={bgImg.src}
        style={{
          zIndex: -1,
          minHeight: '100vh',
          position: 'absolute',
        }}
      />  
      <Box style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '12vw',
        paddingTop: '22vh',
        paddingRight: '12vw',
        paddingBottom: '9vh',
      }}>
        <Box style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          height: '15%'
        }}>
          <Box>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <LineBottom>
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                  <CustomText style={{
                    fontSize: titleSize,
                    fontStyle:'italic',
                    color: TEXT_COLOR_GRAY
                  }}>
                    {'"'}
                  </CustomText>
                  <CustomText style={{
                    fontSize: titleSize,
                    fontStyle:'italic',
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    {data.highlight}
                  </CustomText>
                  <CustomText style={{
                    fontSize: titleSize,
                    paddingLeft: '.5rem',
                    fontStyle:'italic',
                    color: TEXT_COLOR_GRAY
                  }}>
                    {'"'}
                  </CustomText>
                </Box>
              </LineBottom>
            </Box>  
            <CustomText style={{
                fontSize: titleSize,
                paddingLeft: '.5rem',
                fontStyle:'italic',
                color: TEXT_COLOR_GRAY
              }}>
                {data.title}
            </CustomText>
          </Box>
        </Box>
        <Box style={{
          height: changeDefinitionGridLayout ? '20%' :'40%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: changeDefinitionGridLayout ? 'end' : 'center'
        }}>
          <CustomText style={{
            fontStyle:'italic',
            fontWeight: 600,
            textAlign: 'center',
            fontSize: getByBreakPoint<string>('1.4rem','1.5rem','1.7rem','1.8rem','2rem'),
          }}>
            {data.text}
          </CustomText>
        </Box>
        <Box style={{ 
          display: 'flex',
          height: changeDefinitionGridLayout ? '45%' : '30%',
          transition: 'all .2s ease',
          justifyContent: 'space-between',
          flexDirection: changeDefinitionGridLayout ? 'column' : 'row',
          width:'100%',
        }}>
          {data.definitions.map((definition, index) => (
            <Box key={index} style={{
              marginTop: changeDefinitionGridLayout ? '2rem' : '3rem',
              width: changeDefinitionGridLayout ? '100%' : '32%',
              display:'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <CustomText style={{
                textAlign: 'center',
                fontSize: definitionSize,
                fontWeight: 600,
                color: PRIMARY_COLOR_HEX
              }}>
                {definition.title}
              </CustomText>
              <CustomText style={{
                textAlign: 'center',
                fontSize: definitionSize,
                color: TEXT_COLOR_GRAY,
                maxWidth: changeDefinitionGridLayout ? '90%' : '100%',
                lineHeight: '1.2',
              }}>
                {definition.description}
              </CustomText>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};