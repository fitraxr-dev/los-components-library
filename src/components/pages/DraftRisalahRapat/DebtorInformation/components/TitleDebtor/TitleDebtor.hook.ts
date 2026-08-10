import { usePathname } from 'next/navigation';

import { mup } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import { reducer } from '@/components/layouts/AppLayout/App.constants';
import useGetBucketDebtorDetail from '@/components/shared/SmiComponent/AlertDifferentData/hooks/useGetBucketDebtorDetail';


const useTitleDebtor = () => {
  const { processId } = useIdentity();
  const pathname = usePathname();
  const [state, dispatch] = useApp();

  const { data: bucketData, isLoading: bucketDataIsLoading } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  });

  const { data: debtorDetailData } = useGetBucketDebtorDetail({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: debtorDetailData?.debtorId,
  }, {
    enabled: !!debtorDetailData?.debtorId,
  });

  const handleRerouteViewMUP = () => {
    dispatch({
      data: { ...state.pages, lastPath: pathname },
      type: reducer.SET_PAGES,
    });
    dispatch({
      data: { viewOnly: true },
      type: reducer.SET_VIEW_ONLY,
    });

    const path = replacePath(
      mup.DEBTOR_INFORMATION_PAGE,
      { processId: bucketData?.bucketParentId }
    );
    window.open(path, '_blank');
  };

  return {
    bucketDataIsLoading,
    handleRerouteViewMUP,
    isValidateSuccess,
    validateResult,
  };
};

export default useTitleDebtor;
