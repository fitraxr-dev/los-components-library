'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { technicalStudyReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import useGetLatestRequest from './hooks/useGetLatestRequest';


const useDebtorInformation = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [state] = useApp();
  const [{ currentRole, currentPosition }] = useApp();
  const isSpecialistDelst = currentRole?.includes('STAFF') && currentPosition?.includes('SPECIALIST');
  const isKadivDelst = currentRole?.includes('KADIV') && currentPosition?.includes('SPECIALIST');
  const path = usePathname();


  const { data, isLoading: bucketDetailIsLoading } = useGetBucketById({
    bucketProcessId: processId,
    module: state.pages.module,
    process: state.pages.process,
  }, { enabled: isSpecialistDelst });

  // Record activity when debtor information page is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: state.pages.module,
        process: state.pages.process,
        remarks: 'view technical study review debtor information page',
      });
    }
  }, [data, processId, state.pages.module, state.pages.process, recordActivity]);


  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: data?.debtorId,
  }, {
    enabled: data?.debtorId !== null,
  });

  // Check for Request button
  const { data: requestButtonData, isLoading: isLoadingRequest } = useGetLatestRequest({
    bucketMasterId: data?.bucketMaster || '',
    bucketParentId: data?.bucketParentId,
    bucketProcessId: processId,
    module: state.pages.module,
    process: state.pages.process,
    request: true,
  }, {
    enabled: !!data?.bucketMaster && !!processId,
  });

  // Check for Latest button
  const { data: latestButtonData, isLoading: isLoadingLatest } = useGetLatestRequest({
    bucketMasterId: data?.bucketMaster || '',
    bucketParentId: data?.bucketParentId,
    bucketProcessId: processId,
    module: state.pages.module,
    process: state.pages.process,
    request: false,
  }, {
    enabled: !!data?.bucketMaster && !!processId,
  });

  const handleViewRequest = () => {
    const targetProcessId = requestButtonData?.bucketProcessId || data.bucketParentId;

    // Record activity for viewing request
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: targetProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'technical-study-review',
      module: state.pages.module,
      process: state.pages.process,
      remarks: `view request from technical study review (targetProcessId: ${targetProcessId})`,
    });

    const newUrl = replacePath(
      technicalStudyReview.DEBTOR_INFORMATION_PAGE, { module: 'request', processId: targetProcessId }
    );
    const returnUrl = encodeURIComponent(path);
    const fullUrl = `${newUrl}?return=${returnUrl}`;
    window.open(setPreviewPage(fullUrl), '_blank', 'noopener,noreferrer');
  };

  const handleLatest = () => {
    const targetProcessId = latestButtonData?.bucketProcessId;

    // Record activity for viewing latest kajian teknis
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: targetProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'technical-study-review',
      module: state.pages.module,
      process: state.pages.process,
      remarks: `view latest kajian teknis from technical study review (targetProcessId: ${targetProcessId})`,
    });

    const newUrl = replacePath(
      technicalStudyReview.DEBTOR_INFORMATION_PAGE, { module: 'monitoring', processId: targetProcessId }
    );
    const returnUrl = encodeURIComponent(path);
    const fullUrl = `${newUrl}?return=${returnUrl}`;
    window.open(setPreviewPage(fullUrl), '_blank', 'noopener,noreferrer');
  };

  const isRequestPath = path.includes('/request/');

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
        label: 'View The Latest Kajian Teknis',
        onClick: handleLatest,
      });
    }

    return btn;
  };

  return {
    bucketDetailIsLoading,
    checkBtn,
    data,
    handleViewRequest,
    isKadivDelst,
    isSpecialistDelst,
    isValidateSuccess,
    latestButtonData,
    requestButtonData,
    validateResult,
  };
};

export default useDebtorInformation;
