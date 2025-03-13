import { BackgroundImage } from "@mantine/core";
import { dataI } from "@/app/page4/page";
import { CustomText } from "@/components/customText";
import { TitleLine } from "@/app/page4/components/titelLine";

interface previewFrameProps {
  data: dataI
  indexService: number
  changeProjectHandler: (index: number) => void
}

export function PreviewFrame({ data, indexService, changeProjectHandler }: previewFrameProps) {
  return data.services[indexService].projects.map((item, index) => (  
    <BackgroundImage
      className="hover-img"
      key={index}
      style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', padding: '1rem' }}
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