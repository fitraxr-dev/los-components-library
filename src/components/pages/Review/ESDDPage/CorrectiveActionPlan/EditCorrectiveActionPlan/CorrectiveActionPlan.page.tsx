'use client';

import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import CorrectiveActionPlanForm from '../CorrectiveActionPlanForm';


const CorrectiveActionPlan = () => {
  const { viewOnly } = useViewOnly();
  return (
    <>
      <CorrectiveActionPlanForm
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
        isBusinessResponse={false}
        viewOnly={viewOnly}
      />
    </>
  );
};

export default CorrectiveActionPlan;
