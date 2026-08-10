import { useMemo } from 'react';

import { formatCurrency } from '@/helpers/formatCurrency';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import useGetFinancingFacilityOtherBankSummary from '../../hooks/useGetFinancingFacilityOtherBankSummary';


const useTableFinancingFacilityOtherBankSummary = () => {
  const [state] = useApp();
  const { processId } = useIdentity();

  const { data: otherBankSummaryData, isLoading, isSuccess } = useGetFinancingFacilityOtherBankSummary({
    bucketProcessId: processId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const convertCurrencyStrToNumber = (value: string) => parseFloat(value?.replace(/,/g, ''));

  const generateTotalPlafond = useMemo(() => {
    let totalNominal = 0;
    if (isSuccess) {
      otherBankSummaryData.forEach((item) => totalNominal += convertCurrencyStrToNumber(item.totalPlafond));
    }

    return String(totalNominal);
  }, [otherBankSummaryData]);

  const generateTotalOutstanding = useMemo(() => {
    let totalNominal = 0;
    if (isSuccess) {
      otherBankSummaryData.forEach((item) => totalNominal += convertCurrencyStrToNumber(item.totalOutstanding));
    }

    return String(totalNominal);
  }, [otherBankSummaryData]);

  const totalPlafond = formatCurrency(generateTotalPlafond);
  const totalOutstanding = formatCurrency(generateTotalOutstanding);

  return {
    isLoading,
    otherBankSummaryData,
    totalOutstanding,
    totalPlafond,
  };
};

export default useTableFinancingFacilityOtherBankSummary;
