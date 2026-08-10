'use client';
import React, { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableBusinessGroup from '@/components/shared/SmiTable/TableBusinessGroup/TableBusinessGroup';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';


import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';
import useGetCurrentModule from '../hooks/useGetCurrentModule';

// import BusinessGroupSection from './components/BusinessGroupSection';
import DetailDebtorSection from './components/DetailDebtorSection';
import SaveButton from './components/SaveButton';
import TitleDebtor from './components/TitleDebtor';


const DebtorInformation = () => {
  const { module, process } = useGetCurrentModule();
  const { processId } = useIdentity();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.LPA,
    process: TypeProcess.LPA,
  });

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <TitleDebtor />
      <TableDebtorInformation module={module} process={process} />
      <DetailDebtorSection />
      {debtorInfoData?.isGroup && (
        <TableBusinessGroup module={module} process={process} />
      )}
      <SaveButton />
    </ColumnWrapper>
  );
};

export default DebtorInformation;
