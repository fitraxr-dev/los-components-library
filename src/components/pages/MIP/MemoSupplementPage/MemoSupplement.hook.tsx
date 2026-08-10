import { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { mip } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetMemoSupplementById from '@/hooks/services/mip/memo-supplement/useGetMemoSupplementById';
import useSaveMemoSupplement from '@/hooks/services/mip/memo-supplement/useSaveMemoSupplement';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';
import Button from '@/components/shared/Button';

import { action as ACTION } from './MemoSupplement.constants';

import type { MemoSupplementProps } from './MemoSupplement.types';


export const useMemoSupplement = (props: MemoSupplementProps) => {
  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [state] = useApp();
  const { recordActivity } = useRecordLog();
  const [payload, setPayload] = useState({});
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const pathList = mip.LIST_PAGE;
  const queryClient = useQueryClient();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [container, setContainer] = useState(null);
  const [lastSubmitPayload, setLastSubmitPayload] = useState<any>(null);

  const {
    data: memoSupplementDetail,
    isFetching: isFetchLoading,
  } = useGetMemoSupplementById({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const stepper = stepperData || state.stepper;
  const actionButtons = stepper?.steps?.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action ?? {};

  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh') === 'true';
    if (shouldRefresh && !viewOnly && stepperData) {
      const url = new URL(window.location.href);
      url.searchParams.delete('refresh');
      window.history.replaceState({}, '', url.toString());
      const timeoutId = setTimeout(() => {
        window.location.reload();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchParams, viewOnly, stepperData]);

  const modifiedObject = !viewOnly ? { SAVE: 'SAVE' } : {};

  // Process action buttons similar to Recommendation
  if (Object.keys(actionButtons).length !== 0) {
    for (const key in actionButtons) {
      if (key.includes('CANCEL') || key.includes('REJECT')) {
        modifiedObject['DECLINE'] = 'DECLINE';
      } else if (key.includes('MEMO_SUPPLEMENT_RETURN_FROM_KADIV_TO_STAFF') || key.includes('KADIV_TO_STAFF')) {
        modifiedObject['RETURN_TO_STAFF'] = actionButtons[key];
      } else if (key.includes('MEMO_SUPPLEMENT_RETURN_FROM_KADIV_TO_TL') || key.includes('KADIV_TO_TL')) {
        modifiedObject['RETURN_TO_TL'] = actionButtons[key];
      } else if (key.includes('MEMO_SUPPLEMENT_RETURN_FROM_TL_TO_STAFF') || key.includes('TL_TO_STAFF')) {
        modifiedObject['RETURN_TO_STAFF'] = actionButtons[key];
      } else if (key.includes('RETURN_TO_MAKER') || key.includes('MAKER')) {
        modifiedObject['RETURN_TO_MAKER'] = actionButtons[key];
      } else if (key.includes('SUBMIT')) {
        modifiedObject['SUBMIT'] = actionButtons[key];
      } else {
        modifiedObject[key] = actionButtons[key];
      }
    }
  } else {
    modifiedObject['CLOSE'] = 'CLOSE';
  }

  const sortArray = [
    'DECLINE',
    'SAVE',
    'RETURN_TO_STAFF',
    'RETURN_TO_TL',
    'RETURN_TO_MAKER',
    'SUBMIT',
    'CLOSE'
  ];

  const sortedKeys = sortArray.filter((key) => Object.keys(modifiedObject).includes(key));

  let sortedObject = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
  });

  const progress = stepperData?.progress ?? 0;
  const isProgressNotCompleted = progress < 100;

  const { isPending: isSaveLoading, mutate: saveMemoSupplement } = useSaveMemoSupplement({
    onSuccess: () => {
      setDirtyMsg(undefined);
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: String(processId),
        changeAfter: payload ? JSON.stringify(payload) : null,
        changeBefore: JSON.stringify(memoSupplementDetail),
        menuCode: 'mip',
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
        remarks: `Save Memo Supplement data MIP with Id: ${String(processId)}`,
      });

      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
    },
  });

  const onSuccess = () => {
    showNiceModalV2({
      onClose: () => {
        router.push(pathList);
      },
      title: 'Data berhasil disimpan',
      type: 'success',
    });
  };

  const { mutate: submitMemoSupplement, isPending: isSubmitMemoSuppLoading } = useSubmitBucket({
  });

  const handleSave = (blob: Blob) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      const savePayload = {
        bucketProcessId: processId as string,
        description: blob,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      };
      setPayload(savePayload);
      saveMemoSupplement(savePayload);
    }
  };

  const handleSaveButton = () => {
    convertToDocx(container).then(handleSave);
  };

  const handleOpenSubmitModal = ({ action }: { action: any }) => {
    if (action === ACTION.DECLINE || action === 'DECLINE') {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment, radioValue }) => {
          const bucketAction = radioValue === '1' ? 'CANCEL' : 'REJECT';
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload = {
            submitRequestDto: {
              action: bucketAction,
              bucketProcessId: String(processId),
              comment,
              module: state.pages.mipModule,
              process: state.pages.mipProcess,
            },
          };
          setLastSubmitPayload(payload.submitRequestDto);
          submitMemoSupplement(payload, {
            onError: () => showNiceModalV2({ title: 'Terjadi kesalahan silahkan coba kembali.', type: 'error' }),
            onSuccess: () => {
              recordActivity({
                activity: radioValue === '1' ? ActivityType.CANCEL : ActivityType.REJECT,
                bucketProcessId: String(processId),
                menuCode: 'mip',
                module: state.pages.mipModule,
                process: state.pages.mipProcess,
                remarks: (radioValue === '1' ? 'Cancel' : 'Reject') + ` Memo Supplement MIP with Id: ${String(processId)}`,
              });
              queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
              onSuccess();
            },
          });
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Canceled', value: '1' },
          { label: 'Rejected', value: '2' }
        ],
      },
      );
    } else {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload = {
            submitRequestDto: {
              action,
              bucketProcessId: processId as string,
              comment,
              module: state.pages.mipModule,
              process: state.pages.mipProcess,
            },
          };
          setLastSubmitPayload(payload.submitRequestDto);
          submitMemoSupplement(payload, {
            onSuccess: () => {
              recordActivity({
                activity: action as ActivityType ?? ActivityType.SUBMIT,
                bucketProcessId: String(processId),
                menuCode: 'mip',
                module: state.pages.mipModule,
                process: state.pages.mipProcess,
                remarks:
                  (action.charAt(0).toUpperCase() + action.slice(1).toLowerCase())
                  + ` Memo Supplement MIP with Id: ${String(processId)}`,
              });
              queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
              onSuccess();
            },
          });
        },
      });
    }
  };

  const isTl = state.currentRole.includes(roles.TL);
  const isKadiv = state.currentRole.includes(roles.KADIV);
  const isMaker = state.currentRole.includes(roles.MAKER);
  const isChecker = state.currentRole.includes(roles.CHECKER);
  const isWaitingKadiv = stepper?.from === 'MEMO_SUPPLEMENT_WAITING_KADIV';
  const isWaitingChecker = stepper?.from === 'MEMO_SUPPLEMENT_WAITING_CHECKER';

  const handleButton = (key: string, value: string) => {
    switch (key) {
      case 'RETURN_TO_MAKER':
        return (
          <Button
            color="darkBlue"
            disabled={viewOnly}
            isLoading={isSubmitMemoSuppLoading}
            onClick={() => handleOpenSubmitModal({ action: value })}
            sx={{ mr: 2 }}
          >
            Return to Maker
          </Button>
        );
      case 'DECLINE':
        return (
          <Button
            onClick={() => handleOpenSubmitModal({ action: 'DECLINE' })}
            variant="outlined"
            color="error"
            disabled={viewOnly}
            isLoading={isSubmitMemoSuppLoading}
            sx={{ mr: 2 }}
          >
            Decline
          </Button>
        );
      case 'SAVE':
        return (
          <Button
            color="primary"
            isLoading={isSaveLoading}
            sx={{ mr: 2 }}
            disabled={viewOnly}
            onClick={handleSaveButton}
          >
            Save
          </Button>
        );
      case 'RETURN_TO_TL':
        return (
          <Button
            color="info"
            isLoading={isSubmitMemoSuppLoading}
            sx={{ mr: 2 }}
            onClick={() => handleOpenSubmitModal({ action: value })}
            disabled={viewOnly}
          >
            Return To TL
          </Button>
        );
      case 'RETURN_TO_STAFF':
        return (
          <Button
            isLoading={isSubmitMemoSuppLoading}
            sx={{ mr: 2 }}
            onClick={() => handleOpenSubmitModal({ action: value })}
            disabled={viewOnly}
          >
            Return To Staff
          </Button>
        );
      case 'SUBMIT':
        return (
          <Button
            color="success"
            isLoading={isSubmitMemoSuppLoading}
            onClick={() => handleOpenSubmitModal({ action: value })}
            disabled={viewOnly || isProgressNotCompleted}
          >
            {((isWaitingKadiv && (isKadiv || isMaker)) || (isWaitingChecker && isChecker)) ? 'Approve' : 'Submit'}
          </Button>
        );
      default:
        return null;
    }
  };

  const renderActionButtons = () => {
    return sortedObject && Object.keys(sortedObject).length > 0
      ? Object.entries(sortedObject).map((dt: [string, string], index: number) => {
        return <span key={index}>{handleButton(dt[0], dt[1])}</span>;
      })
      : null;
  };

  return {
    container,
    handleOpenSubmitModal,
    handleSave,
    isFetchLoading,
    isProgressNotCompleted,
    isSaveLoading,
    isSubmitMemoSuppLoading,
    memoSupplementDetail,
    renderActionButtons,
    setContainer,
    viewOnly,
  };
};
