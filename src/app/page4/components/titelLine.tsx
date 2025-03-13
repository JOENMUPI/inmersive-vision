import { CustomText } from "@/components/customText"
import { PRIMARY_COLOR_HEX, TEXT_COLOR } from "@/utils/conts"
import { Box, MantineStyleProp } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

interface titleLineI {
  text: string
  style?: MantineStyleProp
}

export const TitleLine = ({ style, text }: titleLineI) =>{
  return (<Box style={{
    writingMode: 'vertical-lr',
    transform:'rotate(180deg)',
    display:'flex',
    alignItems: 'center',
    gap: '1rem',
    height: '100%',
    ...style
  }}>
    <IconPlus size={'1rem'} color={PRIMARY_COLOR_HEX} />
    <CustomText style={{ fontSize: '1rem' }}>
      {text}
    </CustomText>
    <Box style={{ backgroundColor: TEXT_COLOR, width: '.1rem', flexGrow: 1 }} />
  </Box>)
}