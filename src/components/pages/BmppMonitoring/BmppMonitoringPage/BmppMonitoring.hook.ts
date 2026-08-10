import { useEffect, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import useCustomRouter from '@/hooks/useCustomRouter';

import { useBmppMonitoringContext } from '@/components/layouts/BmppMonitoringLayout/BmppMonitoring.context';

import { tab, tabItems } from './BmppMonitoring.constants';


const useBmppMonitoringPage = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('individual');
  const { handleSetBreadcrumb } = useBmppMonitoringContext();

  const tabs = tabItems;

  useEffect(() => {
    handleSetBreadcrumb([
    ]);
  }, []);

  useEffect(() => {
    const val = searchParams?.get('tab');

    if (val === tab.GROUP) {
      setActiveTab(tab.GROUP);
    } else {
      setActiveTab(tab.INDIVIDUAL);
      handleChangeTab(tab.INDIVIDUAL);
    }
  }, [searchParams]);

  const handleChangeTab = (val: string) => {
    setActiveTab(val);

    if (val === tab.INDIVIDUAL) {
      router.push(`${pathname}?tab=individual`);
    }
    if (val === tab.GROUP) {
      router.push(`${pathname}?tab=group`);
    }
  };

  return {
    activeTab,
    handleChangeTab,
    tabs,
  };
};

export default useBmppMonitoringPage;
