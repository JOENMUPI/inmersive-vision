import { ActionIcon, BackgroundImage, Box, Image } from "@mantine/core"
import { IconArrowLeft, IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react"
import { projectI } from "@/app/page4/page"
import { TitleLine } from "@/app/page4/components/titelLine"
import { CustomTooltip } from "@/components/customTooltip"
import { useIndexList } from "@/hooks/indexList"
import { useEffect } from "react"
import { useBreakPointHandler } from "@/hooks/breakpointHandler"

interface viewFrameProps {
  project:  projectI
  backAction: () => void
}

const initIndex = 0

export function ViewFrame({ project, backAction }: viewFrameProps) {
  const { isXS } = useBreakPointHandler()
  const { nextIndex, prevIndex, dataIndex, setDataIndex } = useIndexList({ length: project.imgs?.length ?? 0, initIndex})
  const dinamicSizeImgListElement: string = (100 / (project.imgs?.length ?? 1)) + '%'

  useEffect(()=> {
    setDataIndex(initIndex)
  }, [project])

  if (project.useImgs) return (
    <BackgroundImage
      src={project.imgs?.[dataIndex] ?? project.imgPreview}
      style={{
        transition: 'all .2s ease',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: isXS ? '' : 'end',
        alignItems: isXS ? 'end' : ''
      }}
    >
      <Box style={{
        width: isXS ? '100%' : '20%',
        heigth: isXS ? '20%' : '100%',
        display: 'flex',
        justifyContent: 'end',
        alignItems: isXS ? 'start' : 'center',
        backgroundColor: 'rgba(9, 9, 9, .7)',
        padding: '1%'
      }}>
        <Box style={{
          width: isXS ? '90%' : '80%',
          height: isXS ? '100%' : '90%',
          display: 'flex',
          flexDirection: isXS ? 'row' : 'column'
        }}>
          <Box style={{
            width: isXS ? '80%' : '100%',
            height: isXS ? '100%' : '90%',
            display: 'flex',
            flexDirection: isXS ? 'row' : 'column',
          }}>
            {project.imgs?.map((img, index) => (
              <Image
                onClick={() => { setDataIndex(index) }}
                key={index}
                src={img}
                alt={`img-list-${index}`}
                style={{
                  transition: 'all .2s ease',
                  border: index === dataIndex ? '1px white solid' : '',
                  width:  isXS ? dinamicSizeImgListElement : '100%',
                  height: isXS ? '100%' : dinamicSizeImgListElement,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
          <Box style={{
            width: isXS ? '10%' : '100%',
            height: isXS ? '100%' : '100%',
            display:'flex',
            alignItems:'end',
            justifyContent: 'space-between'
          }}>
            <CustomTooltip label="Previus" >
              <ActionIcon variant="transparent" onClick={prevIndex} >
                <IconChevronLeft />
              </ActionIcon>
            </CustomTooltip>
            <CustomTooltip  label="Next">
              <ActionIcon variant="transparent" onClick={nextIndex} >
                <IconChevronRight />
              </ActionIcon>
            </CustomTooltip>
          </Box>
        </Box>
        { isXS
          ? <Box style={{ width:'10%', height: '100%', display:'flex', justifyContent: 'end' }} >
              <ActionIcon variant="transparent" onClick={backAction}>
                <IconX />
              </ActionIcon> 
            </Box>
          : <Box style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems:'center',
            width: '20%',
            height:'100%',
            gap: '.5rem',
            flexDirection: 'column'
          }}>
            <ActionIcon variant="transparent" onClick={backAction}>
              <IconX />
            </ActionIcon>
            <TitleLine text="" style={{ gap:'.5rem' }} />
          </Box>
        }
      </Box>
    </BackgroundImage>
  )
  else if (project.url) return (
    <Box style={{ width:'100%', heigth: '100%', display:'flex', justifyContent:'end' }}>
      <ActionIcon style={{ position:'absolute' }} variant="light" onClick={backAction}>
        <IconArrowLeft />
      </ActionIcon>
      <iframe
        src={project.url}
        name="Virtual tour"
        width="100%"
        height="100%"
        allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr; xr-spatial-tracking; autoplay; camera; microphone"
        frameBorder="0"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </Box>
  )
  else return  <Box style={{ width:'100%', heigth: '100%', display:'flex', justifyContent:'end' }}>
    <ActionIcon style={{ position:'absolute' }} variant="light" onClick={backAction}>
      <IconArrowLeft />
    </ActionIcon>
    <BackgroundImage
      src={project.imgPreview}
      style={{ width: '100%', height: '100%', /*backgroundSize:'contain', backgroundRepeat: 'no-repeat'*/ }}
    />
  </Box>
}