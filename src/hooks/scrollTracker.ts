import { useEffect, useState } from 'react';

export enum ScrollDirection { UP = 'UP', DOWN = 'DOWN' }

export const useScrollTracker = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection | undefined>();
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDirection(ScrollDirection.DOWN);
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection(ScrollDirection.UP);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  return { scrollDirection };
};
