import { CustomTooltip } from "@/components/customTooltip";
import { useBreakPointHandler } from "@/hooks/breakpointHandler";
import { ActionIcon, Box, Progress } from "@mantine/core";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

interface NavBarI {
  nextFn: () => void,
  prevFn: () => void,
  length: number,
  position: number
}

export function NavBar({ nextFn, prevFn, length, position}: NavBarI) {
  const { getByBreakPoint, isXS } = useBreakPointHandler()

  const iconSize = getByBreakPoint<string>('1.5rem','1.6rem','1.7rem','2rem','2rem')

  return (
    <Box style={{
      display: 'flex',
      width: getByBreakPoint<string>('100%','45%','40%','35%','35%'),
      transition: 'all .2s ease',
      gap: getByBreakPoint<string>('1rem','1rem','1.5rem','2rem','2rem'),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem',
      }}> 
      <CustomTooltip label="Previous">
        <ActionIcon
          variant="transparent"
          color="gray"
          aria-label="leftArrow"
          onClick={prevFn}
          style={{ border: '1px solid white', borderRadius: '20rem', width: isXS ? '10vw' : '3vw' }}
          size={iconSize}
          >
          <IconArrowNarrowLeft style={{ transition: 'all .2s ease' }} size={iconSize} /> 
        </ActionIcon>
      </CustomTooltip>
      <Progress
        aria-label="progress bar page 1"
        style={{ flex: "1", height:'.3vh' }}
        color="#999999" 
        value={length > 0 ? (position + 1) / length * 100 : 0}
        transitionDuration={200}
      />
      <CustomTooltip label="Next">
        <ActionIcon
          variant="transparent"
          color="gray"
          aria-label="rightArrow"
          onClick={nextFn}
          style={{ border: '1px solid white', borderRadius: '20rem', width: isXS ? '10vw' : '3vw' }}
          size={iconSize}
          >
          <IconArrowNarrowRight style={{ transition: 'all .2s ease' }} size={iconSize} /> 
        </ActionIcon>
      </CustomTooltip>
    </Box>
  )
}