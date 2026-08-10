'use client';

import { FormProvider } from 'react-hook-form';

import ProjectTab from '@/components/pages/MaintenanceData/MaintenanceDebtor/FacilityManagement/ConventionalFacilityPage/components/InformasiLainnya/components/ProjectTab/ProjectTab';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import FacilityFinancingForm from './Component/FacilityFinancingForm';
import Penjamin from './Component/Penjamin';
import { TAB_ITEMS, tab } from './DetailFinancingFacility.constant';
import { useDetailFinancingFacility } from './DetailFinancingFacility.hooks';


const DetailFinancingFacility = () => {

  const {
    activeTab,
    methods,
    handleChangeTab,
    deltaTab,
  } = useDetailFinancingFacility();

  return (
    <>
      <Title title="Edit Fasilitas Pembiayan" />
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={TAB_ITEMS}
        dataChangesList={deltaTab?.data?.contents?.map((item) => item.key) || []}
      />
      <FormProvider {...methods} >

        <TabItem activeValue={activeTab} value={tab.FACILITAS_PEMBIAYAAN}>
          <FacilityFinancingForm />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.PENJAMIN}>
          <Penjamin />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.PROJECT_INFORMATION}>
          <ProjectTab fromSlik />
        </TabItem>

      </FormProvider>
    </>
  );
};

export default DetailFinancingFacility;
