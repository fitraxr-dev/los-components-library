import { useEffect, useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import useGetTotalExposureDebtor from '../../hooks/useGetTotalExposureDebtor';


const useTotalDebtorExposure = () => {
  const { processId } = useIdentity();
  const [exposuresDebtor, setExposuresDebtor] = useState([]);
  const { data: exposureDebtorData, isLoading } = useGetTotalExposureDebtor({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
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

export default useTotalDebtorExposure;
