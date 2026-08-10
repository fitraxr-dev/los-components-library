import { useEffect, useState } from 'react';

import useGetExposureDebtor from '@/hooks/services/bucket/debtor/useGetExposureDebtor';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';


const useExposureDebtor = () => {
  const [state] = useApp();
  const { processId } = useIdentity();
  const [exposuresDebtor, setExposuresDebtor] = useState([]);

  const { data: exposureDebtorData, isLoading } = useGetExposureDebtor({
    bucketProcessId: processId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
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
