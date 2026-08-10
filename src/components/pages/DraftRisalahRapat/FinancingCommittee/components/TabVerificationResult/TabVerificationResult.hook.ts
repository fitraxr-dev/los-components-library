import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { risalahRapat } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetSignerCount from '../../hooks/useGetSignerCount';


const useTabVerificationResult = () => {
  const [state] = useApp();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const isTaskForce = state.currentPosition.includes('TASK_FORCE');
  const isKadiv = state?.currentRole.includes(roles.KADIV);
  const isTL = state.currentRole.includes(roles.TL);

  const stepperData = state.stepper;
  const isStepperCompleted = stepperData?.from === 'COMPLETED';
  const isBucketProcessCompleted = stepperData?.from === 'RR_PROCESS_TO_NEXT_STAGE';

  const { data: containsSigner, isLoading: isSignerCountLoading } = useGetSignerCount({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  }, {
    select: (data) => Boolean(data?.content > 0),
  });

  const handleOpenConsentSheetModal = React.useCallback(() => {
    NiceModal.show(MODAL.RISALAH_RAPAT.CONSENT_SHEET_LIST);
  }, []);

  const navigateToAcknowledgementSheetPreview = React.useCallback(() => {
    const nextPath = replacePath(risalahRapat.PREVIEW_ACKNOWLEDGEMENT_SHEET, { processId });
    router.replace(nextPath);
  }, [processId, router]);

  const handleOpenMergeDocumentModal = React.useCallback(() => {
    NiceModal.show(MODAL.RISALAH_RAPAT.MERGE_DOCUMENT);
  }, []);

  const handleOpenSendToSPFPModal = React.useCallback(() => {
    NiceModal.show(MODAL.RISALAH_RAPAT.SEND_TO_SPFP);
  }, []);

  const handleClose = React.useCallback(() => {
    router.push(risalahRapat.DRAFT_LIST_PAGE);
  }, [router]);

  return {
    containsSigner,
    handleClose,
    handleOpenConsentSheetModal,
    handleOpenMergeDocumentModal,
    handleOpenSendToSPFPModal,
    isBucketProcessCompleted,
    isKadiv,
    isSignerCountLoading,
    isStepperCompleted,
    isTL,
    isTaskForce,
    navigateToAcknowledgementSheetPreview,
  };
};

export default useTabVerificationResult;
