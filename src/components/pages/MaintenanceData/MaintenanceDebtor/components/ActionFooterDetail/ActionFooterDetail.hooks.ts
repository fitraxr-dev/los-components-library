import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { DECLINE, CANCELED, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, engagementSubmission, loanProcessingSummary, maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { modal } from './ActionFooterDetail.constant';


export const useActionFooterDetail = () => {
  const theme = useTheme();
  // Action Button
  const [{ stepper, currentRole }] = useApp();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'customer-information')?.enable;
  const [actions, setActions] = useState(null);
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const [saveAndSubmit, setSaveAndSubmit] = useState(false);

  useEffect(() => {
    for (const step of stepper.steps) {
      if ('childrenSteps' in step) {
        if (step.childrenSteps) {
          if (step.childrenSteps.find((children) => children.urlPath === getLastPath(pathname))) {
            const actions = step.childrenSteps.find((children) => children.urlPath === getLastPath(pathname));
            setActions(actions);
            break;
          }
        }
        else {
          if (step.urlPath === getLastPath(pathname)) {
            const actions = step;
            setActions(actions);
            break;
          }
        }
      }
    }
  }, [stepper]);

  const handleClose = () => {
    router.back();
  };

  const handleOpenSubmitModal = ({ action }: {action: string}) => {
    if (action === DECLINE) {
      if (roleCanEdit) {
        NiceModal.show(MODAL.GLOBAL.COMMENT, {
          onSave: ({ comment, radioValue }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);
            submitBucket({
              submitRequestDto: {
                action: roleCanEdit ? CANCELED : radioValue,
                bucketProcessId: String(processId),
                comment,
                module: TypeModule.MAINTENANCE_DATA,
                process: TypeProcess.MAINTENANCE_CUSTOMER,
              },
            });
          },
        });
      } else {
        NiceModal.show(MODAL.GLOBAL.COMMENT, {
          onSave: ({ comment, radioValue }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);
            submitBucket({
              submitRequestDto: {
                action: radioValue,
                bucketProcessId: String(processId),
                comment,
                module: TypeModule.MAINTENANCE_DATA,
                process: TypeProcess.MAINTENANCE_CUSTOMER,
              },
            });
          },
          radioLabel: 'Declined',
          radioOptions: [
            { label: 'Canceled', value: CANCELED },
            { label: 'Rejected', value: REJECTED }
          ],
        });
      }

    } else {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          if (!isViewOnly) {
            setSaveAndSubmit(true);
          }
          submitBucket({
            submitRequestDto: {
              action,
              bucketProcessId: String(processId),
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CUSTOMER,
            },
          });
        },
      });
    }
  };

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: (error: any) => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);

      if (error?.message.includes('BCM')) {
        NiceModal.show(modal.PLAFON_VALIDATION, { errorMessage: error?.message });
      } else {
        showNiceModalV2({
          title: error?.message ? error?.message : 'Data gagal disimpan',
          type: 'error',
        });
      }
    },
    onSuccess: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: handleBackToListPage,
        title: 'Data berhasil disimpan',
        type: 'success',
      });

    },
  });

  const handleBackToListPage = () => {
    router.replace(maintenanceDebtor.LIST_PAGE);
  };

  return {
    actions,
    handleClose,
    handleOpenSubmitModal,
    isPending: isSubmitLoading,
    isSubmitLoading,
    saveAndSubmit,
    setSaveAndSubmit,
    theme,
  };
};
