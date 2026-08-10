'use client';

import React from 'react';

import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import Autocomplete from '@/components/shared/Autocomplete';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import AdditionalInformation from './components/AdditionalInformation';
import ExternalConcern from './components/ExternalConcern';
import InternalConcern from './components/InternalConcern';
import { TAB, TAB_ITEMS } from './Summary.contants';
import useSummaryPage from './Summary.hook';


const SummaryPage = () => {
  const { processId } = useIdentity();
  const {
    activeTab,
    handleChangeTab,
    handleEdit,
    isEdit,
    isLoading,
    setIsEdit,
    setIsLoading,
    theme,
    complyNotComplyList,
    control,
    disclaimerValue,
    canUpdateShariahCompliance,
    viewOnly,
  } = useSummaryPage();

  return (
    <ColumnWrapper sx={{ gap: 6 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DK}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DK}
      />
      <RowWrapper sx={{ alignItems: 'center' }}>
        <Title title="Kesimpulan" />
      </RowWrapper>

      <Controller
        control={control}
        name="disclaimer"
        render={({ field: { ref, ...field } }) => (
          <Autocomplete
            {...field}
            label="Comply / Not Comply"
            placeholder="Choose Comply / Not Comply"
            dropdownList={complyNotComplyList}
            value={field.value}
            disabled={viewOnly || !canUpdateShariahCompliance}
          />
        )}
      />

      <Tabs activeTab={activeTab} onChange={(val: string) => handleChangeTab(val)} items={TAB_ITEMS} />

      <TabItem activeValue={activeTab} value={TAB.INTERNAL}>
        <InternalConcern onChange={(val: string) => handleChangeTab(val)} />
      </TabItem>

      <TabItem activeValue={activeTab} value={TAB.EXTERNAL}>
        <ExternalConcern onChange={(val: string) => handleChangeTab(val)} />
      </TabItem>

      <TabItem activeValue={activeTab} value={TAB.ADDITIONAL}>
        <AdditionalInformation
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          handleEdit={handleEdit}
          disclaimerValue={disclaimerValue}
          canUpdateShariahCompliance={canUpdateShariahCompliance}
        />
      </TabItem>
    </ColumnWrapper>
  );
};

export default SummaryPage;
