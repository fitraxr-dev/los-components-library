'use client';

import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import CorrectiveAction from '@/components/shared/SmiTable/CorrectiveAction';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import useCorrectiveActionPlan from './CorrectiveActionPlan.hooks';


const CorrectiveActionPlan = () => {
  const { goToNextStep } = useCorrectiveActionPlan();
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  return (
    <>
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
      <Title title="Corrective Action Plan" />
      <CorrectiveAction
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
        viewOnly={viewOnly}
      />
      <RowWrapper sx={{ gap: 1, justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          onClick={goToNextStep}
        >
          Next
        </Button>
      </RowWrapper>
    </>
  );
};

export default CorrectiveActionPlan;
