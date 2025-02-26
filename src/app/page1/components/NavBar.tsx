import { CustomText } from "@/components/customText";
import { CustomTooltip } from "@/components/customTooltip";
import { useBreakPointHandler } from "@/hooks/breakpointHandler";
import { ActionIcon, Box, Progress } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface NavBarI {
  nextFn: () => void,
  prevFn: () => void,
  length: number,
  position: number
}

export function NavBar({ nextFn, prevFn, length, position}: NavBarI) {
  const { getByBreakPoint } = useBreakPointHandler()

  const fontSize = getByBreakPoint<string>('1.1rem','1.3rem','1.4rem','1.7rem','1.7rem')
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
      <CustomTooltip label="Previous">
        <ActionIcon
          variant="transparent"
          color="gray"
          aria-label="leftArrow"
          onClick={prevFn}
          size={iconSize}
          >
          <IconChevronLeft style={{ transition: 'all .2s ease' }} size={iconSize} /> 
        </ActionIcon>
      </CustomTooltip>
      <CustomTooltip label="Next">
        <ActionIcon
          variant="transparent"
          color="gray"
          aria-label="rightArrow"
          onClick={nextFn}
          size={iconSize}
          >
          <IconChevronRight style={{ transition: 'all .2s ease' }} size={iconSize} /> 
        </ActionIcon>
      </CustomTooltip>
    </Box>
  )
}