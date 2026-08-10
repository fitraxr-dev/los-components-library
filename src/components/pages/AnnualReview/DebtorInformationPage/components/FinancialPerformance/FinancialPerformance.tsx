import React from 'react';

import { useFormContext } from 'react-hook-form';

import useViewOnly from '@/hooks/useViewOnly';

import FinancialPerformanceSection from '@/components/shared/SmiSection/DebtorInformation/FinancialPerformanceSection';


const FinancialPerformance = () => {
  const formMethods = useFormContext();
  const { viewOnly } = useViewOnly();

  return (
    <FinancialPerformanceSection {...formMethods} viewOnly={viewOnly} />
  );
};

export default FinancialPerformance;
