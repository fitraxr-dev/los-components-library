import React from 'react';

import { useFormContext } from 'react-hook-form';

import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import FinancialPerformanceSection from '@/components/shared/SmiSection/DebtorInformation/FinancialPerformanceSection';


const FinancialPerformance = () => {
  const formMethods = useFormContext();
  const { viewOnly } = useViewOnly();
  const { processId, analystId } = useIdentity();
  const [processIdPrefix] = processId?.split('-') || [];
  const isAnalyst = processIdPrefix === 'MIPA';

  return (
    <FinancialPerformanceSection {...formMethods} viewOnly={viewOnly || isAnalyst} />
  );
};

export default FinancialPerformance;
