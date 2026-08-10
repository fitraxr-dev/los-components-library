'use client';

import { useTheme } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import Bmpk from './Bmpk/Bmpk';
import { tabItems, tabs } from './MemberInformation.constant';
import useMemberInformation from './MemberInformation.hook';
import MemberInformationDetail from './MemberInformationDetail/MemberInformationDetail';


const MemberInformation = () => {
  const {
    activeTab,
    handleChangeTab,
    methods,
  } = useMemberInformation();
  return (
    <FormProvider {...methods} >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Tabs
          variant="fullWidth"
          activeTab={activeTab}
          onChange={(val: number) => handleChangeTab(val)}
          items={tabItems}
        />
        <TabItem activeValue={activeTab} value={tabs.MEMBER_INFORMATION}>
          <MemberInformationDetail />
        </TabItem>
        <TabItem activeValue={activeTab} value={tabs.BMPK}>
          <Bmpk />
        </TabItem>
      </ColumnWrapper>
    </FormProvider>
  );
};
export default MemberInformation;
