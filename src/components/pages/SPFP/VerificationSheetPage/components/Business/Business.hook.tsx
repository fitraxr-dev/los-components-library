import { useContext, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { spfp } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useCheckSubmitAskForInfo from '@/hooks/services/useCheckSubmitAskForInfo';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import useSaveVerificationSheet from '../../hooks/useSaveVerification';
import { action } from '../../VerificationSheet.constants';


export const useBusiness = (container?: any) => {
  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const router = useCustomRouter();
  const pathList = spfp.LIST_PAGE;
  const bucket = useSpfpBucketContext();
  const { viewOnly } = useViewOnly();
  const { goToNextStep } = useSpfpContext();

  const [shouldGoNext, setShouldGoNext] = useState(false);
  const queryClient = useQueryClient();

  const path = usePathname();
  const [state] = useApp();
  const stepper = state?.stepper;

  let actions = [];
  const buttons = {};

  if (stepper) {
    actions = stepper.steps.filter((steps) => steps.urlPath === getLastPath(path))[0]?.action;
  }

  const isActionNull = actions === null || actions === undefined;

  const { data: checkSubmitAskForInfo } = useCheckSubmitAskForInfo({
    bucketProcessId: bucket?.bucketProcessId || '',
  });

  const isEnableSubmitAskForInfo = checkSubmitAskForInfo === true;


  for (const key in actions) {
    buttons[key] = actions[key];
  }

  // Save
  const { isPending: isSaveLoading, mutate: saveVerificationSheet } = useSaveVerificationSheet({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon dicoba kembali',
        type: 'error',
      });
    },
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
      if (shouldGoNext) {
        setShouldGoNext(false);
        goToNextStep();
      }
    },
  });

  const { mutate: submitVerificationBusiness, isPending: isSubmitBusinessVerifLoading } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon dicoba kembali',
        type: 'error',
      });
    },
  });

  const onSuccess = () => {
    showNiceModalV2({
      onClose: () => {
        router.push(pathList);
      },
      title: 'Data berhasil dikirim',
      type: 'success',
    });
  };

  const handleSave = (blob: Blob) => {
    saveVerificationSheet({
      description: blob,
      ...bucket,
    });
  };

  const handleOpenSubmitModal = ({ action }: { action: any }) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        closeNiceModal(MODAL.GLOBAL.COMMENT);
        submitVerificationBusiness({
          submitRequestDto: {
            action,
            comment,
            ...bucket,
          },
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
            onSuccess();
          },
        });
      },
    });
  };

  const handleDecline = async () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        closeNiceModal(MODAL.GLOBAL.COMMENT);
        submitVerificationBusiness({
          submitRequestDto: {
            action: radioValue,
            comment,
            ...bucket,
          },
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
            onSuccess();
          },
        });
      },
      radioLabel: 'Declined',
      radioOptions: [
        { label: 'Cancelled', value: action.CANCELED },
        { label: 'Rejected', value: action.REJECTED }
      ],

    });
  };

  // const businessData = verificationSheetData?.length ?
  //   verificationSheetData?.find((e) => e.division?.includes('BUSINESS')) : {};

  const autoSavePayload = useMemo(() => async () => {

    const blob = await convertToDocx(container);

    return {
      description: blob,
      ...bucket,
    };
  }, [container, bucket]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!container,
    payload: autoSavePayload,
    url: 'agreement.add.saveSheet',
  });

  return {
    buttons,
    handleDecline,
    handleOpenSubmitModal,
    handleSave,
    isActionNull,
    isAutoSaveFetching,
    isEnableSubmitAskForInfo,
    isSaveLoading,
    isSubmitBusinessVerifLoading,
    setShouldGoNext,
    stepper,
  };
};
