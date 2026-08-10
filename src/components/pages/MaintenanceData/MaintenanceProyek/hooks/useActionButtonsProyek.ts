import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';

import { CANCELED, DECLINE, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceProyek } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { actionsButtonsForEditMaster } from '../ListPage/MaintenanceProyek.constants';


const UseActionButtonsProyek = (bucketProcessId = null) => {
  const { recordActivity } = useRecordLog();
  const { id } = useParams();
  const [{ stepper }] = useApp();
  const pathname = usePathname();
  const router = useCustomRouter();
  const [idConvert, setIdConvert] = useState(Array.isArray(id) ? id[0] : id);
  const [proyekId, setProyekId] = useState(idConvert?.includes('PRJ') ? idConvert : null);
  const [actions, setActions] = useState(null);
  const isEditPage = pathname.includes('edit');

  useEffect(() => {
    for (const step of stepper.steps) {
      if (proyekId && isEditPage) {
        const actionsMock = actionsButtonsForEditMaster;
        setActions(actionsMock);
        break;
      }
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

  const [lastSubmitPayload, setLastSubmitPayload] = useState(null);

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: (error) => {
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: lastSubmitPayload?.submitRequestDto?.bucketProcessId || bucketProcessId || idConvert || '',
        changeAfter: '',
        changeBefore: JSON.stringify(lastSubmitPayload),
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: `failed to submit maintenance proyek bucket: ${error?.message || 'unknown error'}`,
      });

      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (variables) => {
      // Determine activity type based on action
      let activityType = ActivityType.SUBMIT;
      const action = variables?.submitRequestDto?.action;

      if (action === 'APPROVE') {
        activityType = ActivityType.APPROVE;
      } else if (action === 'REJECT' || action === REJECTED) {
        activityType = ActivityType.REJECT;
      } else if (action === 'CANCEL' || action === CANCELED) {
        activityType = ActivityType.CANCEL;
      } else if (action === 'DECLINE') {
        activityType = ActivityType.DECLINE;
      } else if (action === 'RETURN_TO_STAFF') {
        activityType = ActivityType.RETURN_TO_STAFF;
      } else if (action === 'RETURN_TO_TL') {
        activityType = ActivityType.RETURN_TO_TL;
      } else if (action === 'RETURN_TO_ANALYST') {
        activityType = ActivityType.RETURN_TO_ANALYST;
      } else if (action === 'RETURN_TO_SPECIALIST_DELST') {
        activityType = ActivityType.RETURN_TO_SPECIALIST_DELST;
      } else if (action === 'ASK_FOR_INFO') {
        activityType = ActivityType.ASK_FOR_INFO;
      }

      recordActivity({
        activity: activityType,
        bucketProcessId: variables?.submitRequestDto?.bucketProcessId || bucketProcessId || idConvert || '',
        changeAfter: '',
        changeBefore: JSON.stringify(variables),
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: `successfully submitted maintenance proyek bucket with action: ${action || 'unknown'}`,
      });

      showNiceModalV2({
        onClose: () => {
          router.push(maintenanceProyek.LIST_PAGE);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleClose = () => {
    router.back();
  };

  // Include SUBMIT, RETURN TO STAFF, APPROVE, DECLINE (CANCEL & REJECT)
  const handleSubmitModal = ({ action }: {action: string}) => {
    // Gunakan bucketProcessId jika ada, jika tidak gunakan idConvert
    const processId = bucketProcessId || idConvert;

    if (action === DECLINE) {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment, radioValue }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload = {
            submitRequestDto: {
              action: radioValue,
              bucketProcessId: processId,
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_PROYEK,
            },
          };
          setLastSubmitPayload(payload);
          submitBucket(payload);
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
          const payload = {
            submitRequestDto: {
              action,
              bucketProcessId: processId,
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_PROYEK,
            },
          };
          setLastSubmitPayload(payload);
          submitBucket(payload);
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
      });
    }
  };

  return {
    actions,
    handleClose,
    handleSubmitModal,
    isSubmitLoading,
  };
};

export default UseActionButtonsProyek;
