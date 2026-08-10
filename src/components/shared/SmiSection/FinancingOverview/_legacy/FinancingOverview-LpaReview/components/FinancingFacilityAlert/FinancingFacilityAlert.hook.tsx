import { useMemo } from 'react';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetCurrentModule from '@/components/pages/Review/LpaReview/hooks/useGetCurrentModule';

import useApplyFinancingFacilityDiff from '../../hooks/useApplyFinancingFacilityDiff';
import useGetFinancingFacilityDiff from '../../hooks/useGetFinancingFacilityDiff';


const useFinancingFacilityAlert = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { module, process } = useGetCurrentModule();

  const isEnabled = useMemo(() => {
    let enabled = false;
    const bucketId = processId?.split('-')[0];
    const isLPA = bucketId === 'LPA';
    if (isLPA && !viewOnly) enabled = true;

    return enabled;
  }, [processId, viewOnly]);


  const { data, isSuccess } = useGetFinancingFacilityDiff({
    bucketProcessId: processId,
    module,
    process,
  }, {
    enabled: isEnabled,
  });


  const { mutate: applyDiff, isPending: isSaveLoading } = useApplyFinancingFacilityDiff({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan dicoba lagi',
        type: 'error',
      });

    },
    onSuccess: () => {
      window.location.reload();
    },
  });


  const handleApplyDiff = () => {
    applyDiff({
      bucketProcessId: processId,
      module,
      process,
    });
  };


  const isShowAlert = useMemo(() => {
    let isShow = false;
    if (data?.hasAnyDifference === true && isSuccess) isShow = true;
    return isShow;
  }, [data, isSuccess]);


  return {
    diffData: data,
    handleApplyDiff,
    isSaveLoading,
    isShowAlert,
  };
};


export default useFinancingFacilityAlert;
