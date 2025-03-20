import { BackgroundImage } from "@mantine/core";
import { dataI } from "@/app/page4/page";
import { CustomText } from "@/components/customText";
import { TitleLine } from "@/app/page4/components/titelLine";
import '@/app/page4/styles/page.css'
import { useBreakPointHandler } from "@/hooks/breakpointHandler";

interface previewFrameProps {
  data: dataI
  indexService: number
  changeProjectHandler: (index: number) => void
}

export function PreviewFrame({ data, indexService, changeProjectHandler }: previewFrameProps) {
  const { isXS } = useBreakPointHandler()
  return data.services[indexService].projects.map((item, index) => (  
    <BackgroundImage
      className={ isXS ? '': "hover-img"}
      key={index}
      style={{
        ...(isXS && data.services.length < 4 ? { width: (100 / data.services.length) + '%' } : {}),
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'space-between',
        padding: '1rem'
      }}
      src={item.imgPreview}
      onClick={() => changeProjectHandler(index)}
    >
      <CustomText style={{ fontSize: '2.2rem' }}>
        {index < 10 ? '0' : '' }{index+1}
      </CustomText>
      <TitleLine text={item.title} />
    </BackgroundImage>
  ))
}