import { Tooltip } from "@mantine/core";

interface CustomTooltipI {
  label: string,
  children: React.ReactNode,
  delay?: number,
  duration?: number,
  position?: 'top' |
  'top-end' |
  'top-start' |
  'bottom' |
  'bottom-start' |
  'bottom-end' |
  'left' |
  'left-start' |
  'left-end' |
  'right-start' |
  'right-end' |
  'right'
}

export function CustomTooltip({
  label,
  position = 'top',
  children,
  duration = 200,
  delay = 200
}: CustomTooltipI) {
  return (
    <Tooltip
      label={label}
      position={position}
      openDelay={delay}
      withArrow
      transitionProps={{
        duration: duration,
        transition: 'pop'
      }} 
    >
      {children}
    </Tooltip>
  )
}