'use client';

import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import CorrectiveActionPlanForm from '../CorrectiveActionPlanForm';


const CorrectiveActionPlan = () => {
  return (
    <>
      <CorrectiveActionPlanForm
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
        isBusinessResponse={false}
        viewOnly={false}
      />
    </>
  );
};

export default CorrectiveActionPlan;
