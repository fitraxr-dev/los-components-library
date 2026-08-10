'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableBusinessGroup from '@/components/shared/SmiTable/TableBusinessGroup';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import DetailDebtorSection from './components/DetailDebtorSection';
import SaveButton from './components/SaveButton';
import TitleDebtor from './components/TitleDebtor';


const DebtorInformationPage = () => {
  const { processId } = useIdentity();
  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DK,
  });
  const isGroup = debtorInfoData?.isGroup;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>

      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DK}
      />
      <TitleDebtor />
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DK}
        isReviewer={true}
        refetchInterval={5000}
      />
      <TableDebtorInformation
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DK}
      />
      <DetailDebtorSection />
      {isGroup && <TableBusinessGroup
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DK}
      />}
      <SaveButton />
    </ColumnWrapper>
  );
};

export default DebtorInformationPage;
