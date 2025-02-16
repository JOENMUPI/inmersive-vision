import { Box } from "@mantine/core";
import { PRIMARY_COLOR_HEX_2, PRIMARY_COLOR_RGB } from "@/utils/conts";

export function LineBottom({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      {children}
      <Box style={{
        width: '100%',
        marginTop: '.4rem',
        minHeight: '.1rem',
        borderRadius: '10srem',
        boxShadow: '0 0 2rem .8rem ' + PRIMARY_COLOR_RGB(.2),
        backgroundColor: PRIMARY_COLOR_HEX_2
      }}/>
    </Box>
  )
}