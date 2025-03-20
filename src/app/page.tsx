'use client';
import Page1 from '@/app/page1/page';
import Page2 from '@/app/page2/page';
import Page3 from '@/app/page3/page';
import Page6 from '@/app/page6/page';
import Page5 from '@/app/page5/page';
import Page4 from '@/app/page4/page';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) return <></> 
  return (
    <>
      <Page1 />
      <Page2 />
      <Page3 />
      <Page4 />
      <Page5 />
      <Page6 />
    </>
  );
}
