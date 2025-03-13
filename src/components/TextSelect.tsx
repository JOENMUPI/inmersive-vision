import { CustomText } from "@/components/customText";
import { LineBottom } from "@/components/lineBotton";
import { PRIMARY_COLOR_HEX, TEXT_COLOR } from "@/utils/conts";
import { Box } from "@mantine/core";

interface TextSelectProps {
  title: string;
  textStyle?: React.CSSProperties
  condition: boolean
  onClick: () => void
}

export function TextSelect({ textStyle, title, condition, onClick }: TextSelectProps) {
  return (
    <Box
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <LineBottom styleLine={{
        opacity: condition ? 1 :  0,
        marginTop: 0,
        boxShadow: 'none'
      }}>
        <CustomText style={{
          transition: 'all .2s ease',
          fontSize: '1.5rem',
          color: condition ? PRIMARY_COLOR_HEX : TEXT_COLOR,
          ...textStyle
        }}>
          {title}
        </CustomText>
      </LineBottom>
    </Box>
  )
}