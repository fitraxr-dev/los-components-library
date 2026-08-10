'use client';
import React from 'react';

import { FormProvider } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import ApuPptData from './components/ApuPptData';
import BmpkAndOther from './components/BmpkAndOther';
import CoBorrower from './components/CoBorrower';
import DebtorIdentity from './components/DebtorIdentity';
import GeneralInformation from './components/GeneralInformation';
import InternalAssessment from './components/InternalAssessment';
import OtherCommonInformation from './components/OtherCommonInformation';
import RatingManagement from './components/RatingManagement';
import { tab, tabItems } from './DebtorInformation.constants';
import useDebtorInformation from './DebtorInformation.hooks';


const DebtorInformation = () => {
  const { activeTab, handleChangeTab, processId, handleSaveDebtorDetail, methods } = useDebtorInformation();

  return (
    <FormProvider {...methods} >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Customer Informatioan" />

        <Tabs variant="scrollable" activeTab={activeTab} onChange={(val: string) => handleChangeTab(val)} items={tabItems} />

        <TabItem activeValue={activeTab} value={tab.GENERAL_INFORMATION}>
          <GeneralInformation />
        </TabItem>


        <TabItem activeValue={activeTab} value={tab.OTHER_COMMON_INFORMATION}>
          <OtherCommonInformation />
        </TabItem>


        <TabItem activeValue={activeTab} value={tab.CO_BORROWER}>
          <CoBorrower />
        </TabItem>


        <TabItem activeValue={activeTab} value={tab.APUPPT_DATA}>
          <ApuPptData />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.DEBTOR_IDENTITY}>
          <DebtorIdentity />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.RATING_MANAGEMENT}>
          <RatingManagement />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.INTERNAL_ASSESSMENT}>
          <InternalAssessment />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.BMPK_AND_OTHER}>
          <BmpkAndOther />
        </TabItem>

        <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
          <Button onClick={methods.handleSubmit(handleSaveDebtorDetail)} color="primary">
            Save
          </Button>
          {processId &&
            <Button color="success">
              Submit
            </Button>
          }
        </RowWrapper>
      </ColumnWrapper>
    </FormProvider>
  );
};

export default DebtorInformation;
