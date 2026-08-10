import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { lpaRequestReview, lpaReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import useGetCurrentModule from '../../../hooks/useGetCurrentModule';

import useGetLatestRequest from './hooks/useGetLatestRequest';


const useTitleDebtor = () => {
  const { processId, parentId, debtorId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { module, process } = useGetCurrentModule();
  const path = usePathname();
  const pathArray = path.split('/');
  const processModule = pathArray[3];

  const { data: bucketData } = useGetBucketById({
    bucketProcessId: processId,
    module,
    process,
  });

  // Record activity when bucket data is loaded
  useEffect(() => {
    if (bucketData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view lpa review debtor information page',
      });
    }
  }, [bucketData, processId, module, process, recordActivity]);

  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId,
  }, {
    enabled: debtorId !== null && debtorId !== undefined,
  });

  // Check for Request button
  const { data: requestButtonData, isLoading: isLoadingRequest } = useGetLatestRequest({
    bucketMasterId: bucketData?.bucketMaster || '',
    bucketParentId: bucketData?.bucketParentId || '',
    bucketProcessId: processId,
    module,
    process,
    request: true,
  }, {
    enabled: !!bucketData?.bucketMaster && !!processId,
  });

  // Check for Latest button
  const { data: latestButtonData, isLoading: isLoadingLatest } = useGetLatestRequest({
    bucketMasterId: bucketData?.bucketMaster || '',
    bucketParentId: bucketData?.bucketParentId || '',
    bucketProcessId: processId,
    module,
    process,
    request: false,
  }, {
    enabled: !!bucketData?.bucketMaster && !!processId,
  });

  const handleViewRequest = () => {
    const targetProcessId = requestButtonData?.bucketProcessId || parentId;

    // Record activity for viewing request
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: targetProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lpa-review',
      module: module,
      process: process,
      remarks: `view request from lpa review (targetProcessId: ${targetProcessId})`,
    });

    const newUrl = replacePath(
      lpaRequestReview.DEBTOR_INFORMATION, { module: 'bucket-list', processId: targetProcessId }
    );
    const returnUrl = encodeURIComponent(path);
    const fullUrl = `${newUrl}?return=${returnUrl}`;
    window.open(setPreviewPage(fullUrl), '_blank', 'noopener,noreferrer');
  };

  const handleViewLatest = () => {
    const targetProcessId = latestButtonData?.bucketProcessId;

    // Record activity for viewing latest
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: targetProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lpa-review',
      module: module,
      process: process,
      remarks: `view latest kajian lpa from lpa review (targetProcessId: ${targetProcessId})`,
    });

    const newUrl = replacePath(
      lpaReview.DEBTOR_INFORMATION, { module: 'bucket-list', processId: targetProcessId }
    );
    const returnUrl = encodeURIComponent(path);
    const fullUrl = `${newUrl}?return=${returnUrl}`;
    window.open(setPreviewPage(fullUrl), '_blank', 'noopener,noreferrer');
  };

  const isRequestPath = path.includes('/bucket-list/');

  const checkBtn = () => {
    let btn = [];

    // Show "View Request" button based on API response
    if (requestButtonData?.hasPreviousCompleted) {
      btn = [{
        disabled: false,
        iconName: 'monitor',
        isLoading: isLoadingRequest,
        label: 'View Request',
        onClick: handleViewRequest,
      }];
    }

    // Show "View The Latest" button based on API response
    if (latestButtonData?.hasPreviousCompleted) {
      btn.push({
        color: isRequestPath ? 'primary' : 'info',
        disabled: false,
        iconName: 'show',
        isLoading: isLoadingLatest,
        label: 'View The Latest Kajian LPA',
        onClick: handleViewLatest,
      });
    }

    return btn;
  };

  return {
    checkBtn,
    isValidateSuccess,
    processModule,
    validateResult,
  };
};

export default useTitleDebtor;
