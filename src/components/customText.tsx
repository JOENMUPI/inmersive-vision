import { TEXT_COLOR } from "@/utils/conts"
import { Text } from "@mantine/core"

interface customTextI {
  children: React.ReactNode,
  style?: React.CSSProperties
}

export const CustomText = ({ children, style }: customTextI) => {
  return (
    <Text style={{ transition:'all .2s ease', textWrap: 'pretty', color: TEXT_COLOR, ...style }}>
      {children}
    </Text>
  )
} 