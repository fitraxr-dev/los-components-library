'use client';

import { FormProvider } from 'react-hook-form';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import TopMenu from '../TopMenu';

import InformasiSindikasi from './components/InformasiSindikasiTab/InformasiSindikasiTab';
import LainnyaTab from './components/LainnyaTab/LainnyaTab';
import ProjectPage from './components/ProjectPage';
import { tab, TAB_ITEMS } from './InformasiLainnya.constants';
import useInformasiLainnya from './InformasiLainnya.hook';


const InformasiLainnya = () => {
  const {
    activeTab,
    handleChangeTab,
    methods,
    theme,
    topMenuType,
    changesTab,
  } = useInformasiLainnya();

  return (
    <ColumnWrapper marginY={3} gap={theme.spacing(3)}>
      <TopMenu type={topMenuType} />

      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={TAB_ITEMS}
        dataChangesList={changesTab?.data?.contents?.map((item) => item.key) || []}
      />
      <FormProvider {...methods} >
        <TabItem activeValue={activeTab} value={tab.PROJECT}>
          <ProjectPage />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.INFORMASISINDIKASI}>
          <InformasiSindikasi />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.LAINNYA}>
          <LainnyaTab />
        </TabItem>
      </FormProvider>
    </ColumnWrapper>
  );
};
export default InformasiLainnya;
