'use client';

import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import CorrectiveActionPlanForm from '@/components/shared/SmiTable/CorrectiveAction/CorrectiveActionPlanForm';


const CorrectiveActionForm = () => {
  const { viewOnly } = useViewOnly();

  return (
    <ColumnWrapper>
      <CorrectiveActionPlanForm
        module={TypeModule.MUP}
        process={TypeProcess.MUP}
        isBusinessResponse
        isBusinessResponseMandatory={true}
        viewOnly={viewOnly}
      />
    </ColumnWrapper>
  );
};

export default CorrectiveActionForm;
