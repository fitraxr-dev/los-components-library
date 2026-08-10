'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import { ViewOnly } from '@/components/shared/SmiModal/CommentModal/CommentModal.stories';
import CorrectiveAction from '@/components/shared/SmiTable/CorrectiveAction';
import ReportingListRoutineTable from '@/components/shared/SmiTable/ReportingListRoutine/ReportingListRoutine';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import SaveButton from '../DebtorInformation/components/SaveButton';

import { TABS, TAB_ITEMS } from './Attachment.constants';
import useAttachment from './Attachment.hooks';

/**
 *
 * NOTE: This component is not yet implemented. It is just a placeholder for the actual implementation.
 * Don't forget to change module and process if the backend is ready.
 */


const Attachment = () => {
  const {
    activeTab,
    handleChangeTab,
    setActiveTab,
    viewOnly,
  } = useAttachment();


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {/* <Title title="Lampiran" />
      <TableDebtorInformation module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />
      <Tabs activeTab={activeTab} onChange={(val: string) => handleChangeTab(val)} items={TAB_ITEMS} />

      <TabItem activeValue={activeTab} value={TABS.CORRECTIVE_ACTION}>
        <CorrectiveAction
          module={TypeModule.RISALAH_RAPAT}
          process={TypeProcess.RISALAH_RAPAT}
          viewOnly={viewOnly}
        />
      </TabItem>

      <TabItem activeValue={activeTab} value={TABS.REPORT_ROUTINE}>
        <ReportingListRoutineTable
          module={TypeModule.RISALAH_RAPAT}
          process={TypeProcess.RISALAH_RAPAT}
        />
      </TabItem>
      <SaveButton activeTab={activeTab} setActiveTab={setActiveTab} /> */}
    </ColumnWrapper>
  );
};

export default Attachment;
