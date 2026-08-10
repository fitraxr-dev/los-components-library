import { useEffect, useState } from 'react';

import { TypeModule } from '@/enums/Module';
import useGetExposureDebtor from '@/hooks/services/bucket/debtor/useGetExposureDebtor';
import useIdentity from '@/hooks/useIdentity';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';


const useExposureDebtor = () => {
  const { processId } = useIdentity();
  const [exposuresDebtor, setExposuresDebtor] = useState([]);
  const { typeProcess } = useAnnualReviewContext();

  const { data: exposureDebtorData, isLoading } = useGetExposureDebtor({
    bucketProcessId: processId,
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  useEffect(() => {
    if (exposureDebtorData && !isLoading) {
      setExposuresDebtor([
        {
          currency: 'IDR',
          label: 'Plafond Existing',
          value: exposureDebtorData?.plafondExisting?.idr ?? '0',
          viewOnly: true,
        },
        {
          currency: 'USD',
          label: 'Plafond Existing',
          value: exposureDebtorData?.plafondExisting?.usd ?? '0',
          viewOnly: true,
        },
        {
          currency: 'IDR',
          label: 'O/S',
          value: exposureDebtorData?.outstanding?.idr ?? '0',
          viewOnly: true,
        },
        {
          currency: 'USD',
          label: 'O/S',
          value: exposureDebtorData?.outstanding?.usd ?? '0',
          viewOnly: true,
        },
        {
          currency: 'IDR',
          label: 'Propose',
          value: exposureDebtorData?.propose?.idr ?? '0',
          viewOnly: true,
        },
        {
          currency: 'USD',
          label: 'Propose',
          value: exposureDebtorData?.propose?.usd ?? '0',
          viewOnly: true,
        }]);
    }
  }, [exposureDebtorData, isLoading]);

  return {
    exposuresDebtor,
    isLoading,
  };
};

export default useExposureDebtor;
