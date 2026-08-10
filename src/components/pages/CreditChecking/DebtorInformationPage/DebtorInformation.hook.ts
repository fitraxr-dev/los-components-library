import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import { MODAL } from '@/configs/constants/modalId';
import { creditChecking } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useDivision from '@/hooks/useDivision';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';

import useGetSimiliarProcess from '../../ApuPpt/DebtorProfileInformationPage/hooks/useGetSimiliarProcess';

import useGetActivationPopUp from './hooks/useGetActivationPopUp';


const useDebtorInformation = () => {
  const { processId } = useIdentity();
  const { divisionCode } = useDivision();
  const { recordActivity } = useRecordLog();

  const { isRequestModule } = useCreditCheckingContext();
  const goToNextStep = useGoToNextStep();
  const queryClient = useQueryClient();

  const [hasModalShown, setHasModalShown] = useState(false);
  const isDpop = divisionCode === 'DPOP_DIVISION';

  const {
    data: bucketDetail,
    isLoading: bucketDetailIsLoading,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.CREDIT_CHECKING,
    process: isDpop ?
      (isRequestModule ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP) :
      TypeProcess.CREDIT_CHECKING,
  });

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.CREDIT_CHECKING,
    process: isDpop ?
      (isRequestModule ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP) :
      TypeProcess.CREDIT_CHECKING,
  });
  const isGroup = debtorInfoData?.isGroup;

  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: bucketDetail?.debtorId,
  }, {
    enabled: bucketDetail?.debtorId !== null,
  });

  const { data: similiarProcessData, isLoading: isLoadingSimiliar, isSuccess: isSuccesSimi } = useGetSimiliarProcess({
    bucketProcessId: processId,
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.CREDIT_CHECKING,
    process: TypeProcess.CREDIT_CHECKING_DPOP,
  }, {
    enabled: bucketDetail?.debtorId !== null,
  });

  useEffect(() => {
    if (bucketDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.CREDIT_CHECKING,
        process: isDpop ?
          (isRequestModule ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP) :
          TypeProcess.CREDIT_CHECKING,
        remarks: 'view credit checking debtor information page',
      });
    }
  });

  const handleLatest = () => {
    const path = replacePath(
      creditChecking.DETAIL_REQUEST_PAGE,
      {
        processId: isDpop ? similiarProcessData?.content?.bucketProcessId :
          similiarProcessData?.content?.bucketParentId,
      });
    window.open(setPreviewPage(path), '_blank', 'noopener,noreferrer');
  };

  const checkBtn = (similiarProcessData) => {
    let btn = [];

    if (isSuccesSimi && !!similiarProcessData?.content) {
      btn.push({
        color: 'primary',
        disabled: !similiarProcessData?.content,
        iconName: 'show',
        isLoading: isLoadingSimiliar,
        label: 'View The Latest Credit Checking',
        onClick: handleLatest,
      });
    }

    return btn;
  };

  const handleClickViewRequest = () => {
    const path = replacePath(creditChecking.DETAIL_REQUEST_PAGE, {
      processId: bucketDetail.bucketParentId,
    });

    window.open(setPreviewPage(path), '_blank', 'noopener, noreferrer');
  };

  const handleNext = () => {
    goToNextStep();
    queryClient.invalidateQueries({
      queryKey: ['bucket-stepper', {
        bucketProcessId: processId,
        module: TypeModule.CREDIT_CHECKING,
        process: isDpop ? TypeProcess.CREDIT_CHECKING_DPOP : TypeProcess.CREDIT_CHECKING,
      }],
    });
  };

  const {
    data: popUp,
  } = useGetActivationPopUp({
    debtorId: bucketDetail?.debtorId,
  });

  useEffect(() => {
    if (popUp && popUp.invalid && !hasModalShown) {
      NiceModal.show(MODAL.GLOBAL.WARNING, {
        cancelText: 'Close',
        title: popUp.result,
      });
      setHasModalShown(true);
    }
  }, [popUp, hasModalShown]);


  return {
    bucketDetail,
    bucketDetailIsLoading,
    checkBtn,
    handleClickViewRequest,
    handleNext,
    isDpop,
    isGroup,
    isRequestModule,
    isValidateSuccess,
    similiarProcessData,
    validateResult,
  };
};

export default useDebtorInformation;
