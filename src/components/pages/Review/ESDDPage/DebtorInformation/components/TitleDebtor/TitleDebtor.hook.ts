import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { mip } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBucketProcessMip from '@/hooks/services/useGetBucketProcessMip';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import { reducer } from '@/components/layouts/AppLayout/App.constants';


const useTitleDebtor = () => {
  const router = useCustomRouter();
  const { parentId } = useIdentity();
  const pathname = usePathname();
  const [state, dispatch] = useApp();
  const [isFetching, setIsFetching] = useState(true);
  const { recordActivity } = useRecordLog();

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
    enabled: debtorInfoData?.debtorId !== null && debtorInfoData?.debtorId !== undefined,
  });

  useEffect(() => {

    const bothDataReady = mipData && mipReviewData && debtorInfoData;
    const hasAnyError = isMipError || isMipReviewError;

    if (bothDataReady || hasAnyError) {
      setIsFetching(false);


      if (bothDataReady) {
        recordActivity({
          activity: ActivityType.INITIAL_PAGE,
          bucketProcessId: String(parentId),
          changeAfter: JSON.stringify(debtorInfoData),
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DELST,
          remarks: 'view debtor information page',
        });
      }
    }
  }, [mipData, mipReviewData, debtorInfoData, parentId, recordActivity, isMipError, isMipReviewError]);

  const handleRerouteViewMIP = () => {
    if (isMipError || !mipData) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: String(parentId),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'failed to navigate to MIP view - page not found',
      });

      return showNiceModalV2({
        title: 'Gagal Halaman yang dituju tidak ditemukan',
        type: 'error',
      });
    }

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: String(parentId),
      changeAfter: JSON.stringify({
        targetBucketProcessId: mipData?.bucketProcessId,
        targetModule: TypeModule.MIP,
        targetPath: mip.CUSTOMER_INFORMATION_PAGE,
      }),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: 'navigate to MIP view',
    });

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
    if (isMipReviewError || !mipReviewData) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: String(parentId),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'failed to navigate to MIP Review view - page not found',
      });

      return showNiceModalV2({
        title: 'Gagal Halaman yang dituju tidak ditemukan',
        type: 'error',
      });
    }

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: String(parentId),
      changeAfter: JSON.stringify({
        targetBucketProcessId: mipReviewData?.bucketProcessId,
        targetModule: TypeModule.MIP_REVIEW,
        targetPath: mip.CUSTOMER_INFORMATION_PAGE,
      }),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: 'navigate to MIP Review view',
    });

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
