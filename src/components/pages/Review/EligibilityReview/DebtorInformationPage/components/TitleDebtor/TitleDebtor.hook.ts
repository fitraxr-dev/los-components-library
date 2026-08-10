import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { mip } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBucketProcessMip from '@/hooks/services/useGetBucketProcessMip';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import { reducer } from '@/components/layouts/AppLayout/App.constants';


const useTitleDebtor = () => {
  const router = useCustomRouter();
  const { parentId } = useIdentity();
  const pathname = usePathname();
  const [state, dispatch] = useApp();
  const [isFetching, setIsFetching] = useState(true);

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(parentId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
  });


  const {
    data: mipData,
    isError: isMipError,
  } = useGetBucketProcessMip({
    bcmId: debtorInfoData?.bucketMaster,
    module: TypeModule.MIP,
    process: TypeProcess.MIP,
  }, {
    enabled: !!debtorInfoData?.bucketMaster,
  });

  const {
    data: mipReviewData,
    isError: isMipReviewError,
  } = useGetBucketProcessMip({
    bcmId: debtorInfoData?.bucketMaster,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
  }, {
    enabled: !!debtorInfoData?.bucketMaster,
  });
  const isShowMipReview = debtorInfoData?.isChangeMIPR;
  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: debtorInfoData?.debtorId,
  }, {
    enabled: debtorInfoData?.debtorId !== null,
  });

  useEffect(() => {
    const isAllDataReady = mipData && mipReviewData && debtorInfoData;
    const hasAnyError = isMipError || isMipReviewError;

    if (isAllDataReady || hasAnyError) {
      setIsFetching(false);
    }
  }, [mipData, mipReviewData, debtorInfoData, isMipError, isMipReviewError]);

  const handleRerouteViewMIP = () => {
    if (isMipError) {
      return showNiceModalV2({
        title: 'Gagal Halaman yang dituju tidak ditemukan',
        type: 'error',
      });
    }

    dispatch({
      data: { ...state.pages, lastPath: pathname },
      type: reducer.SET_PAGES,
    });

    const previewPath = setPreviewPage(
      replacePath(mip.CUSTOMER_INFORMATION_PAGE, {
        processId: mipData?.bucketProcessId,
      })
    );
    router.push(previewPath);
  };

  const handleRerouteViewMIPReview = () => {
    if (isMipReviewError) {
      return showNiceModalV2({
        title: 'Gagal Halaman yang dituju tidak ditemukan',
        type: 'error',
      });
    }

    dispatch({
      data: { ...state.pages, lastPath: pathname },
      type: reducer.SET_PAGES,
    });

    const previewPath = setPreviewPage(
      replacePath(mip.CUSTOMER_INFORMATION_PAGE, {
        processId: mipReviewData?.bucketProcessId,
      })
    );
    router.push(previewPath);
  };

  return {
    handleRerouteViewMIP,
    handleRerouteViewMIPReview,
    isFetching,
    isShowMipReview,
    isValidateSuccess,
    validateResult,
  };
};

export default useTitleDebtor;
