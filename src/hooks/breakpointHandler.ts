import { useMediaQuery } from '@mantine/hooks'

export const useBreakPointHandler = () => {
  const isXS = useMediaQuery('(max-width: 480px)');
  const isSM = useMediaQuery('(min-width: 480px) and (max-width: 768px)');
  const isMD = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  const isLG = useMediaQuery('(min-width: 1024px) and (max-width: 1440px)');
  const isXL = useMediaQuery('(min-width: 1440px)');

  const getByBreakPoint = <T>(xs: T, sm: T, md: T, lg: T, xl: T): T => {
    if (isXS) return xs
    if (isSM) return sm
    if (isMD) return md
    if (isLG) return lg
    if (isXL) return xl
    return xl
  }
  
  return { isXS, isSM, isMD, isLG, isXL, getByBreakPoint }
}