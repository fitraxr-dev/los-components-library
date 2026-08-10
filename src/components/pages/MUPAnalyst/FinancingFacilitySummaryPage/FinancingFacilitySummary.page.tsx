'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import FinancingFacilitySummary from '@/components/shared/SmiSection/FinancingFacilitySummary';

import useFinancingFacilitySummaryMUPAnalyst from './FinancingFacilitySummary.hook';


const FinancingFacilitySummaryPage = () => {
  const { canView } = useFinancingFacilitySummaryMUPAnalyst();

  if (!canView) {
    return null;
  }

  return (
    <FinancingFacilitySummary module={TypeModule.MUP} process={TypeProcess.MUP_ANALYST} />
  );
};

export default FinancingFacilitySummaryPage;
