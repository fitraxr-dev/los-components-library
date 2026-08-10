'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import FinancingFacilitySummary from '@/components/shared/SmiSection/FinancingFacilitySummary';

import useFinancingFacilitySummaryMUP from './FinancingFacilitySummary.hook';


const FinancingFacilitySummaryPage = () => {

  const { canViewMUPList } = useFinancingFacilitySummaryMUP();

  if (!canViewMUPList) {
    return null;
  }

  return (
    <FinancingFacilitySummary module={TypeModule.MUP} process={TypeProcess.MUP} showLine />
  );
};

export default FinancingFacilitySummaryPage;
