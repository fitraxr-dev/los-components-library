import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import CorrectiveActionPlanForm from '@/components/shared/SmiTable/CorrectiveAction/CorrectiveActionPlanForm';


const CorrectiveActionForm = () => {
  return (
    <ColumnWrapper>
      <CorrectiveActionPlanForm module={TypeModule.MUP} process={TypeProcess.MUP} isBusinessResponse />
    </ColumnWrapper>
  );
};

export default CorrectiveActionForm;
