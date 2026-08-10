'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import ReportingListRoutineTable from '@/components/shared/SmiTable/ReportingListRoutine/ReportingListRoutine';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import useReportingListRoutine from './ReportingListRoutine.hooks';


const ReportingListRoutine = () => {
  const { goToNextStep } = useReportingListRoutine();
  const { processId } = useIdentity();
  return (
    <>
      <BaseContainer>
        <AlertDifferentData
          bucketProcessId={processId}
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.REVIEWER_DELST}
          isReviewer={true}
          refetchInterval={5000}
        />
        <ConfirmationLatest
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.REVIEWER_DELST}
        />
        <Title title="Daftar Pelaporan Rutin" />

        <ReportingListRoutineTable
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.REVIEWER_DELST}
        />
      </BaseContainer>

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button onClick={() => goToNextStep()}>Next</Button>
      </RowWrapper>
    </>
  );
};

export default ReportingListRoutine;
