import { useEffect, useMemo } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetManagement from '../../../hooks/useGetManagementById';
import useSaveManagement from '../../../hooks/useSaveManagement';
import { modalData } from '../../../ManagementShareholder.constants';

import { validationSchema } from './ModalManagement.constants';

import type { ModalManagementExistingProps } from './ModalManagementExisting.type';


const useModalManagementExisting = (props: ModalManagementExistingProps) => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const theme = useTheme();
  const modalId = modalData.MODAL_MANAGEMENT_EXISTING;
  const modal = useModal(modalId);

  const { isPending: isSaveLoading, mutate } = useSaveManagement({
    onError: (err?: any) => {
      const errorDetail = err?.response?.data?.errorDetail || err?.message || 'Gagal Menambahkan Management';
      showNiceModalV2({ title: errorDetail, type: 'error' });
    },
    onSuccess: () => {
      closeNiceModal(modalId).then(() => {
        showNiceModalV2({ title: 'Berhasil Menambahkan Management', type: 'success' });
      });
    },
  });

  const { data } = useGetManagement({
    bucketProcessId: processId,
    managementCode: props.managementCode,
    module: TypeModule.PIPELINE,
    process: TypeProcess.PIPELINE,
  }, { enabled: props.managementCode !== undefined });

  // Record activity when management detail is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view management in existing modal',
      });
    }
  }, [data, processId, recordActivity]);

  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);
  const { data: idDocTypeData } = useGetParameterList('idDocType');

  const { getValues, setValue, watch, formState, reset, handleSubmit, control } = useForm({
    defaultValues: {
      dob: undefined,
      identityDocFile: {
        extension: undefined,
        file: null,
        name: undefined,
        url: undefined,
      },
      identityDocNumber: undefined,
      identityTypeKey: undefined,
      name: undefined,
      npwp: undefined,
      npwpFile: {
        extension: undefined,
        file: null,
        name: undefined,
        url: undefined,
      },
      position: undefined,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      setValue('dob', data.dateOfBirth);
      setValue('name', data.name);
      setValue('identityDocNumber', data.identityDocNumber);
      setValue('identityTypeKey', data.identityDocTypeKey);
      setValue('npwp', data.npwp);
      setValue('position', data.position);

      if (data.npwpFile) {
        const fileName = data.npwpFile.split('/').pop();
        setValue('npwpFile', {
          extension: fileName.split('.').pop(),
          file: null,
          name: fileName.split('.').shift().concat('.'),
        });
      }

      if (data.identityDocUrl) {
        const fileName = data.identityDocUrl.split('/').pop();
        setValue('identityDocFile', {
          extension: fileName.split('.').pop(),
          file: null,
          name: fileName.split('.').shift().concat('.'),
        });
      }
    }
  }, [data, setValue]);

  const mutateManagement = () => {
    const { npwpFile, name, npwp, position, dob, identityDocFile, identityDocNumber, identityTypeKey } = getValues();

    let updateManagement = {
      bucketProcessId: processId,
      dob,
      id: props.id,
      identityDocFile: identityDocFile?.file || undefined,
      identityDocNumber,
      identityTypeKey,
      jobPosition: position,
      managementCode: props.managementCode,
      module: TypeModule.PIPELINE,
      name,
      npwp,
      npwpFile: npwpFile.file || undefined,
      process: TypeProcess.PIPELINE,
    };
    // Removing `null` values and converting them to `undefined`
    updateManagement = Object.fromEntries(
      Object.entries(updateManagement).map(([key, value]) => [key, value !== null ? value : undefined])
    );

    recordActivity({
      activity: ActivityType.EDIT,
      bucketProcessId: processId || '',
      changeAfter: JSON.stringify(updateManagement),
      changeBefore: JSON.stringify(data),
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'edit existing management',
    });

    mutate(updateManagement);
  };

  const watchedValues = watch();

  const autoSavePayload = useMemo(() => () => {
    const { npwpFile, name, npwp, position, dob, identityDocFile, identityDocNumber, identityTypeKey } = watchedValues;

    const payload: any = {
      bucketProcessId: processId,
      // dob,
      id: props.id,
      identityDocFile: identityDocFile?.file || undefined,
      identityDocNumber,
      identityTypeKey,
      managementCode: props.managementCode,
      module: TypeModule.PIPELINE,
      name,
      npwp,
      npwpFile: npwpFile?.file || undefined,
      position: position,
      process: TypeProcess.PIPELINE,
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, value !== null ? value : undefined])
    );

    return Promise.resolve(cleanedPayload);
  }, [watchedValues, processId, props.id, props.managementCode]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !!props.id,
    payload: autoSavePayload,
    url: 'bucket.manage.saveCustomerManagement',
  });

  return {
    control,
    formState,
    getValues,
    handleSubmit,
    idDocTypeData,
    isAutoSaveFetching,
    isSaveLoading,
    jobPositionData,
    modal,
    modalId,
    mutateManagement,
    reset,
    setValue,
    theme,
    watch,
  };
};

export default useModalManagementExisting;
