import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import router from 'next/router';

import { DECLINE, CANCELED, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';


const useELODocument = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { processId } = useIdentity();

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Document', url: '' },
      { label: 'ELO', url: '' }
    ]);
  }, []);

  // Action Button
  const [{ stepper }] = useApp();
  const pathname = usePathname();
  const [actions, setActions] = useState(null);

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
    } else {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          submitBucket({
            submitRequestDto: {
              action,
              bucketProcessId: String(processId),
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CUSTOMER,
            },
          });
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
      });
    }
  };

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
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
    isSubmitLoading,
  };
};

export default useELODocument;
