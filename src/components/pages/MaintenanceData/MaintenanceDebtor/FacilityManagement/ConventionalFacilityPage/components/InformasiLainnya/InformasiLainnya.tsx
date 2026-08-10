'use client';

import { FormProvider } from 'react-hook-form';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import TopMenu from '../TopMenu';

import FacilityInformation from './components/FacilityInformation/FacilityInformation';
import InformasiSindikasi from './components/InformasiSindikasiTab/InformasiSindikasiTab';
import LainnyaTab from './components/LainnyaTab/LainnyaTab';
import ProjectTab from './components/ProjectTab/ProjectTab';
import VirtualAccount from './components/VirtualAccount/VirtualAccount';
import { tab, TAB_ITEMS } from './InformasiLainnya.constants';
import useInformasiLainnya from './InformasiLainnya.hook';


const InformasiLainnya = () => {
  const {
    activeTab,
    handleChangeTab,
    methods,
    theme,
    changesTab,
  } = useInformasiLainnya();

  return (
    <ColumnWrapper marginY={3} gap={theme.spacing(3)}>
      <TopMenu />

      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={TAB_ITEMS}
        dataChangesList={changesTab?.data?.contents?.map((item) => item.key) || []}
      />
      <FormProvider {...methods} >
        {/* <TabItem activeValue={activeTab} value={tab.FACILITYINFORMATION}>
          <FacilityInformation />
        </TabItem> */}
        <TabItem activeValue={activeTab} value={tab.PROJECT}>
          <ProjectTab />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.INFORMASISINDIKASI}>
          <InformasiSindikasi />
        </TabItem>

        {/* <TabItem activeValue={activeTab} value={tab.VIRTUALACCOUNT}>
          <VirtualAccount />
        </TabItem> */}

        <TabItem activeValue={activeTab} value={tab.LAINNYA}>
          <LainnyaTab />
        </TabItem>
      </FormProvider>
    </ColumnWrapper>
  );
};
export default InformasiLainnya;
