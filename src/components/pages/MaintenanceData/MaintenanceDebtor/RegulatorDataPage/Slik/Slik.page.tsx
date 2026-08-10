'use client';

import { FormProvider } from 'react-hook-form';

import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import Customer from './Component/Customer';
import FinancingFacility from './Component/FinancingFacility';
import Management from './Component/Management/Management.page';
import { TAB_ITEMS, tab } from './Slik.constants';
import useSlik from './Slik.hooks';


const Slik = () => {
  const { activeTab, handleChangeTab, methods, deltaTab } = useSlik();
  return (
    <>
      <Title title="Regulator Data - Slik" />
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={TAB_ITEMS}
        dataChangesList={deltaTab?.data?.contents?.map((item) => item.key) || []}
      />
      <FormProvider {...methods} >

        <TabItem activeValue={activeTab} value={tab.CUSTOMER}>
          <Customer />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.MANAGEMENT}>
          <Management />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.FACILITAS_PEMBIAYAAN}>
          <FinancingFacility />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.FACILITAS_PEMBIAYAAN_SYARIAH}>
          <FinancingFacility isSyariah />
        </TabItem>
      </FormProvider>
    </>
  );
};

export default Slik;
