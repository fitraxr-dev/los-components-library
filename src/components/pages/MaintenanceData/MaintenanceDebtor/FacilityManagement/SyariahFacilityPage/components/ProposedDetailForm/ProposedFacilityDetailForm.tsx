'use client';
import { useRef } from 'react';

import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import useProposedFacilityTab from '../ProposedFacilityTab/ProposedFacilityTab.hook';

import ChildLimitForm from './components/ChildLimitForm';
import ParentLimitForm from './components/ParentLimitForm';
import useProposedFacilityDetailForm from './ProposedFacilityDetailForm.hook';


const ProposedFacilityDetailForm = () => {
  const theme = useTheme();
  const router = useRouter();
  const formRef = useRef<{ isDirty: boolean }>({ isDirty: false });

  const {
    activeTab,
    handleChangeTab,
    TAB,
    handleParentLimitSaved,
    setHasChildData,
    modul,
    processId,
    isViewOnly,
  } = useProposedFacilityDetailForm();

  const { clearSessionStorage } = useProposedFacilityTab();

  const handleGoToParentLimit = () => {
    handleChangeTab('ParentLimit', formRef.current?.isDirty || false);
  };

  const handleSaveSuccess = () => {
    handleParentLimitSaved();
    clearSessionStorage();
    router.push(replacePath(maintenanceDebtor.FACILITY_SYARIAH_PAGE, { module: modul, processId: processId }));
  };

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Limit Induk Syariah" />
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => {
          const isFormDirty = formRef.current?.isDirty || false;
          handleChangeTab(val, isFormDirty);
        }}
        items={TAB}
      />

      <TabItem activeValue={activeTab} value="ChildLimit">
        <ColumnWrapper gap={theme.spacing(3)}>
          <ChildLimitForm
            onDataStatusChange={setHasChildData}
            onNext={handleGoToParentLimit}
          />
        </ColumnWrapper>
      </TabItem>

      <TabItem activeValue={activeTab} value="ParentLimit">
        <ColumnWrapper gap={theme.spacing(3)}>
          <ParentLimitForm
            onSaveSuccess={handleSaveSuccess}
            isViewOnly={isViewOnly}
          />
        </ColumnWrapper>
      </TabItem>
    </ColumnWrapper>
  );
};

export default ProposedFacilityDetailForm;
