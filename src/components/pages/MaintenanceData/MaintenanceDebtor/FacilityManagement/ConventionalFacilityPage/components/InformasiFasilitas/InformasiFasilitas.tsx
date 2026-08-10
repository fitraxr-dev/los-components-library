'use client';

import { FormProvider } from 'react-hook-form';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import TopMenu from '../TopMenu';

import BusinessHolidayCountry from './components/BusinessHolidayCountry/BusinessHolidayCountry';
import DetailMultiRate from './components/DetailMultiRate/DetailMultiRate';
import FacilityData from './components/FacilityData/FacilityData';
import FacilityDataDetail from './components/FacilityDataDetail/FacilityDataDetail';
import FacilityFee from './components/FacilityFee/FacilityFee';
import InterestDuringContructions from './components/InterestDuringContructions/InterestDuringContructions';
import Notification from './components/Notification/Notification';
import { tab } from './InformasiFasilitas.constants';
import useInformasiFasilitas from './InformasiFasilitas.hook';


const InformasiFasilitas = () => {
  const {
    activeTab,
    handleChangeTab,
    methods,
    theme,
    changesTab,
    facilityInformation,
  } = useInformasiFasilitas();

  const productTypeList = [
    'RESTRUKTURISASI',
    'DANA TALANGAN',
    'DANA TALANGAN REVOLVING',
    'DEFERRED INTEREST',
    'KI MDF 2',
    'KI TANPA IDC',
    'KMK TRANSAKSIONAL',
    'KMK REVOLVING',
  ];

  const hideNotificationProductType = [
    'KI Def IDC Subordinated',
    'KI dengan IDC 100%',
    'KI dengan IDC'
  ];

  const packageName = facilityInformation?.productType;
  const isNotificationHidden = hideNotificationProductType.includes(packageName);

  const interestDuringConstructions = { label: 'Interest During Constructions', value: tab.INTERESTDURINGCONSTRUCTIONS };
  const tabItems = [
    { label: 'Facility Data', value: tab.FACILITYDATA },
    { label: 'Facility Data Detail', value: tab.FACILITYDATADETAIL },
    { label: 'Detail Multi Rate', value: tab.DETAILMULTIRATE },
    !isNotificationHidden ? { label: 'Notification', value: tab.NOTIFICATION } : null,
    { label: 'Business Holiday Country', value: tab.BUSINESSHOLIDAYCOUNTRY },
    !productTypeList.includes(facilityInformation?.productType.toUpperCase()) ? interestDuringConstructions : null,
    { label: 'Facility Fee', value: tab.FACILITYFEE }
  ];

  const TAB_ITEMS = tabItems.filter((item) => item !== null);

  return (
    <ColumnWrapper marginY={3} gap={theme.spacing(3)}>
      <TopMenu />

      <Tabs activeTab={activeTab} onChange={(val: string) => handleChangeTab(val)} items={TAB_ITEMS} variant={!productTypeList.includes(facilityInformation?.productType.toUpperCase()) ? 'scrollable' : 'fullWidth'} dataChangesList={changesTab?.data?.contents?.map((item) => item.key) || []} />
      <FormProvider {...methods} >
        <TabItem activeValue={activeTab} value={tab.FACILITYDATA}>
          <FacilityData facilityInformation={facilityInformation} />
        </TabItem>
        <TabItem activeValue={activeTab} value={tab.FACILITYDATADETAIL}>
          <FacilityDataDetail facilityInformation={facilityInformation} />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.DETAILMULTIRATE}>
          <DetailMultiRate facilityInformation={facilityInformation} />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.NOTIFICATION}>
          <Notification facilityInformation={facilityInformation} />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.BUSINESSHOLIDAYCOUNTRY}>
          <BusinessHolidayCountry facilityInformation={facilityInformation} />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.INTERESTDURINGCONSTRUCTIONS}>
          <InterestDuringContructions facilityInformation={facilityInformation} />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.FACILITYFEE}>
          <FacilityFee facilityInformation={facilityInformation} />
        </TabItem>
      </FormProvider>
    </ColumnWrapper>
  );
};
export default InformasiFasilitas;
