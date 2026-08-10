import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import { useSaveProjectPhase } from '../../hooks/useProjectPhase';
import { modal as MODAL } from '../../ListPage/MaintenanceProyek.constants';

import { addEditProjectPhaseSchema } from './AddEditProjectPhase.schema';


interface Data {
  id: number;
  name: string;
  statusAsOf: string;
}

interface AddEditProjectPhaseProps {
  action: 'Add' | 'Edit';
  projectCode: string;
  data?: Data;
  listPayload: any;
}

const useAddEditProjectPhase = (props: AddEditProjectPhaseProps) => {
  const { recordActivity } = useRecordLog();
  const modalId = MODAL.ADD_EDIT_PROJECT_PHASE_MODAL;
  const modal = useModal(modalId);
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { action, projectCode, data, listPayload } = props;

  const [originalFormData, setOriginalFormData] = useState(null);

  const defaultValues = {
    id: data ? data.id : null,
    projectPhase: data ? data.name : '',
    statusAsOf: data ? data.statusAsOf : '',
  };

  const { control, watch, formState: { isValid }, handleSubmit } = useForm({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(addEditProjectPhaseSchema),
  });

  useEffect(() => {
    setOriginalFormData(JSON.parse(JSON.stringify(defaultValues)));
  }, [data]);

  const form = watch();

  const maxDate = new Date();
  maxDate.setHours(23, 59, 59, 999); // jam 23:59:59.999

  // API SAVE
  const { mutate: savePhase, isPending: isSaveLoading, data: submissionData } = useSaveProjectPhase({
    onError: (error) => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (response, variable) => {
      // Record activity for successful save
      recordActivity({
        activity: action === 'Add' ? ActivityType.ADD : ActivityType.EDIT,
        bucketProcessId: response?.data?.content?.bucketProcessId || projectCode || '',
        changeAfter: JSON.stringify(form),
        changeBefore: originalFormData ? JSON.stringify(originalFormData) : '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: `successfully ${action.toLowerCase()}ed maintenance proyek project phase`,
      });

      showNiceModalV2({
        onClose: () => {
          const getSessionValues = () => {
            if (typeof window === 'undefined') return { maintenanceProyek: null, step: null };
            return {
              maintenanceProyek: sessionStorage.getItem('maintenance-proyek'),
              step: sessionStorage.getItem('step'),
            };
          };

          const sessionValues = getSessionValues();

          queryClient.invalidateQueries({
            queryKey: [
              'project-phase-list',
              listPayload,
              sessionValues.step,
              sessionValues.maintenanceProyek
            ],
          });
          closeNiceModal(modalId);
          const currentUrl = window.location.href;
          if (currentUrl.includes('PRJ-')) {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('step', '1');

              // Debug: log response structure
              // console.log('Full response:', response);
              // console.log('Response data:', response?.data);
              // console.log('Response data content:', response?.data?.content);

              // Update maintenance-proyek dengan bucketProcessId dari response
              const bucketProcessId = response?.data?.content?.bucketProcessId;
              if (bucketProcessId) {
                // console.log('Setting bucketProcessId:', bucketProcessId);
                sessionStorage.setItem('maintenance-proyek', bucketProcessId);

                // Invalidate queries again with new session values
                const newSessionValues = {
                  maintenanceProyek: bucketProcessId,
                  step: '1',
                };

                queryClient.invalidateQueries({
                  queryKey: [
                    'project-phase-list',
                    listPayload,
                    newSessionValues.step,
                    newSessionValues.maintenanceProyek
                  ],
                });
              } else {
                console.log('bucketProcessId not found in response');
              }
            }
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = () => {
    let finalProjectCode = projectCode;

    if (typeof window !== 'undefined') {
      const sessionStep = sessionStorage.getItem('step');

      // console.log('Session step:', sessionStep);

      if (sessionStep && sessionStep === '1') {
        const sessionProjectCode = sessionStorage.getItem('maintenance-proyek');
        // console.log('Session maintenance-proyek:', sessionProjectCode);

        if (sessionProjectCode) {
          finalProjectCode = sessionProjectCode;
          // console.log('Using session projectCode:', finalProjectCode);
        }
      }
    }

    // console.log('Final projectCode used:', finalProjectCode);

    const payload = {
      name: form.projectPhase,
      projectCode: finalProjectCode,
      projectPhaseId: form.id,
      statusAsOf: form.statusAsOf,
    };

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        savePhase(payload);
      },
      submitText: 'Ya',
      title: 'Pastikan Data Sudah Sesuai',
      type: 'warning',
    });

    closeNiceModal(modalId);
  };

  return {
    action,
    control,
    handleSave,
    handleSubmit,
    isSaveLoading,
    isValid,
    maxDate,
    modal,
    modalId,
    theme,
  };
};

export default useAddEditProjectPhase;
