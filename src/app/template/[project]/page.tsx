  'use client';
import Page1 from '@/app/template/components/page1/page';
import Page2 from '@/app/template/components/page2/page';
import Page3 from '@/app/template/components/page3/page';
import Page4 from '@/app/template/components/page4/page';
import Page5 from '@/app/template/components/page5/page';
import Page6 from '@/app/template/components/page6/page';
import Page7 from '@/app/template/components/page7/page'; 
import Page8 from '@/app/template/components/page8/page';
import Page9 from '@/app/template/components/page9/page';
import Page10 from '@/app/template/components/page10/page';
import { configMap } from '@/app/template/config/configMap'
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [endpoint, setEndpoint] = useState<string>('')
  
  useEffect(() => {
    setEndpoint(window.location.pathname.split('/template/')[1])
    setIsLoading(false)
  }, [])

  if (isLoading || !configMap.has(endpoint)) return <></> 
  return (
    <>
      <Page1 data={configMap.get(endpoint)!.data1} />
      <Page2 data={configMap.get(endpoint)!.data2} />
      <Page3 data={configMap.get(endpoint)!.data3} />
      <Page4 data={configMap.get(endpoint)!.data4} />
      <Page5 data={configMap.get(endpoint)!.data5} />
      <Page6 data={configMap.get(endpoint)!.data6} />
      <Page7 data={configMap.get(endpoint)!.data7} />
      <Page8 data={configMap.get(endpoint)!.data8} />
      <Page9 data={configMap.get(endpoint)!.data9} />
      <Page10 />
    </>
  );
}
