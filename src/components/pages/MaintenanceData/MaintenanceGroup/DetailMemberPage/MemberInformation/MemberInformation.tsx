'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';

import useSessionStorage from '@/hooks/useSessionStorage';

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
    resetFormState,
  } = useMemberInformation();

  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  const [currentPositionForm] = useSessionStorage('maintenance-group-session-page', null);
  const searchParams = useSearchParams();
  const fromCreate = searchParams.get('from') === 'create';
  const fromApprovalStatus = searchParams.get('from') === 'approval-status';
  const isViewOnly = searchParams.get('viewOnly') === 'true';

  const isGroupEdit = (currentPositionForm === 'edit' || fromCreate || fromApprovalStatus) && !isViewOnly;

  return (
    <FormProvider {...methods} >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Tabs
          variant="fullWidth"
          activeTab={activeTab}
          onChange={(val: string) => handleChangeTab(val, isSaveButtonEnabled)}
          items={tabItems}
        />
        <TabItem activeValue={activeTab} value={tabs.MEMBER_INFORMATION}>
          <MemberInformationDetail
            isGroupEdit={isGroupEdit}
            isViewOnly={isViewOnly}
            onSaveSuccess={resetFormState}
            onSaveButtonStateChange={setIsSaveButtonEnabled}
          />
        </TabItem>
        <TabItem activeValue={activeTab} value={tabs.BMPK}>
          <Bmpk />
        </TabItem>
      </ColumnWrapper>
    </FormProvider>
  );
};

export default MemberInformation;
