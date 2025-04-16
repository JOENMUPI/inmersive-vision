import { Box } from "@mantine/core";
import { PRIMARY_COLOR_HEX_2, PRIMARY_COLOR_RGB } from "@/utils/consts";

export function LineBottom({ style, styleLine, children }: {
  style?: React.CSSProperties,
  styleLine?: React.CSSProperties,
  children: React.ReactNode
}) {
  return (
    <Box style={style}>
      {children}
      <Box style={{
        width: '100%',
        transition: 'all .2s ease',
        marginTop: '.4rem',
        minHeight: '.1rem',
        borderRadius: '10rem',
        boxShadow: '0 0 2rem .8rem ' + PRIMARY_COLOR_RGB(.2),
        backgroundColor: PRIMARY_COLOR_HEX_2,
        ...styleLine
      }}/>
    </Box>
  )
}