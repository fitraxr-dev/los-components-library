import { useMemo } from 'react';

import { formatCurrency } from '@/helpers/formatCurrency';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import useGetAccountInformationSummaryList from '../../hooks/useGetAccountInformationSummaryList ';


const useTableFinancingFacilityOtherBankSummary = () => {
  const [state] = useApp();
  const { processId } = useIdentity();

  const { data, isLoading, isSuccess } = useGetAccountInformationSummaryList({
    bucketProcessId: processId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const otherBankSummaryData = data?.data?.contents;

  const generateGrandTotal = useMemo(() => {
    let totalNominal = 0;
    if (isSuccess) {
      otherBankSummaryData.forEach((item) => totalNominal += item?.grandTotal);
    }

    return String(totalNominal);
  }, [otherBankSummaryData]);

  const generateTotalPercentage = useMemo(() => {
    let totalPercent = 0;
    if (isSuccess) {
      otherBankSummaryData.forEach((item) => totalPercent += item?.percentage);
    }

    return String(totalPercent);
  }, [otherBankSummaryData]);

  const totalGrand = formatCurrency(generateGrandTotal);
  const totalPercentage = formatCurrency(generateTotalPercentage);

  return {
    isLoading,
    otherBankSummaryData,
    totalGrand,
    totalPercentage,
  };
};

export default useTableFinancingFacilityOtherBankSummary;
