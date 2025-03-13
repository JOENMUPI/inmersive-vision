import { CustomText } from "@/components/customText";
import { useBreakPointHandler } from "@/hooks/breakpointHandler";
import { Box, Progress } from "@mantine/core";

interface NavBarI {
  length: number,
  position: number,
  style?: React.CSSProperties
}

export function NavBar({ length, position, style }: NavBarI) {
  const { getByBreakPoint } = useBreakPointHandler()

  const fontSize = getByBreakPoint<string>('1.1rem','1.3rem','1.4rem','1.7rem','1.7rem')

  return (
    <Box style={{
      display: 'flex',
      width: getByBreakPoint<string>('60%','40%','35%','30%','30%'),
      transition: 'all .2s ease',
      gap: getByBreakPoint<string>('1.5rem','1.5rem','1.5rem','2rem','2rem'),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '-1rem',
      ...style
      }}> 
      <CustomText style={{ fontSize: fontSize }}>
        {length < 10 ? '0' : ''}{position + 1}.
      </CustomText>
      <Progress
        style={{ flex: "1", height:'.3vh' }}
        color="#999999" 
        value={length > 0 ? (position + 1) / length * 100 : 0}
        transitionDuration={200}
      />
      <CustomText style={{ fontSize: fontSize }}>
        {length < 10 ? '0' : ''}{length}.
      </CustomText>
    </Box>
  )
}