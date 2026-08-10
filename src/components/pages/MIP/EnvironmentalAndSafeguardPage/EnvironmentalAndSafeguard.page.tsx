'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import MemoReference from '@/components/shared/SmiSection/MemoReference';
import CorrectiveAction from '@/components/shared/SmiTable/CorrectiveAction';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';


import ReportingListRoutineTable from './components/ReportingListRoutine';
import { useEnvironmentalAndSafeguard } from './EnvironmentalAndSafeguard.hook';


const EnvironmentalAndSafeguardPage = () => {
  const [state] = useApp();
  const { processId: identityProcessId } = useIdentity();

  const {
    activeTab,
    handleChangeTab,
    processId,
    viewOnly,
    module,
    process,
    stepperStatus,
    stepperSteps,
  } = useEnvironmentalAndSafeguard();

  useUpdateMipr({
    bucketParent: identityProcessId,
    stepperStatus,
    steps: stepperSteps,
  });

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Environmental and Social Safeguard Issue" />
      <TableDebtorInformation module={module} process={process} />
      <Tabs
        activeTab={activeTab}
        onChange={handleChangeTab}
        items={[
          {
            label: 'Daftar Corrective Action Plan',
          },
          {
            label: 'Daftar Pelaporan Rutin',
          },
        ]}
      />
      <TabItem activeValue={activeTab} value={0}>
        <CorrectiveAction
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.MIP_REVIEW}
          isBusinessResponse
          viewOnly={viewOnly}
        />
      </TabItem>

      <TabItem activeValue={activeTab} value={1}>
        <ReportingListRoutineTable
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.MIP_REVIEW}
          isBusinessResponse
        />
      </TabItem>

      <MemoReference
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.MIP_REVIEW}
        childProcess={TypeProcess.REVIEWER_DELST}
      />
    </ColumnWrapper>
  );
};

export default EnvironmentalAndSafeguardPage;
