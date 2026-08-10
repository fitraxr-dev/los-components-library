import { useEffect, useMemo } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';


import useGetDebtorById from '../../../hooks/useGetDebtorById';
import useSaveDebtor from '../../../hooks/useSaveDebtor';
import { modalData } from '../../../ManagementShareholder.constants';

import { validationSchema } from './ModalTableDebtorNew.schema';


const useModalTableDebtorNew = ({ id }: { id: string }) => {

  const theme = useTheme();
  const modalId = modalData.MODAL_TABLE_DEBTOR_NEW;
  const modal = useModal(modalId);
  const { debtorId, processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const { isPending: isSaveLoading, mutate } = useSaveDebtor({
    onError: (err?: any) => {
      const errorDetail = err?.response?.data?.errorDetail || err?.message || 'Gagal Menambahkan Customer';
      showNiceModalV2({ title: errorDetail, type: 'error' });
    },
    onSuccess: () => {
      closeNiceModal(modalId).then(() => {
        showNiceModalV2({ title: 'Berhasil Menambahkan Customer', type: 'success' });
      });
    },
  });


  const { data, isSuccess } = useGetDebtorById({ debtorId });

  // Record activity when debtor data is loaded
  useEffect(() => {
    if (data && isSuccess) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view table debtor new in existing model',
      });
    }
  }, [data, isSuccess, processId, recordActivity]);

  const { getValues, handleSubmit, control, setValue, formState, watch } = useForm({
    defaultValues: {
      documentNpwp: {
        extension: '',
        file: null,
        name: '',
      },
      name: '',
      npwp: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data && isSuccess) {
      const { name, npwp, npwpFile } = data;
      setValue('name', name);
      setValue('npwp', npwp);

      if (npwpFile) {
        const fileName = npwpFile.split('/').pop();
        setValue('documentNpwp', {
          extension: fileName.split('.').pop(),
          file: null,
          name: fileName.split('.').shift().concat('.'),
        });
      }
    }
  }, [data, setValue, isSuccess]);

  const mutateDebtor = () => {
    const formValues = getValues();

    let listDocuments = [];

    const { documentNpwp } = formValues;

    if (documentNpwp.file) {
      listDocuments.push({
        base64: documentNpwp.file,
        documentType: 'NPWP',
        fileExt: documentNpwp.extension,
        fileName: documentNpwp.name,
      });
    }

    const payload: Record<string, any> = {
      bucketProcessId: data?.bucketProcessId,
      debtorId: id,
      module: data?.module,
      process: data?.process,
    };

    if (formValues?.npwp) {
      payload.npwp = formValues.npwp;
    }

    const npwpDocument = listDocuments.find((dt) => dt?.documentType === 'NPWP')?.base64;
    if (npwpDocument) {
      payload.npwpFile = npwpDocument;
    }

    if (data?.remark) {
      payload.remark = data.remark;
    }

    recordActivity({
      activity: ActivityType.EDIT,
      bucketProcessId: processId || '',
      changeAfter: JSON.stringify(payload),
      changeBefore: JSON.stringify(data),
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'edit debtor in modal table debtor new',
    });

    mutate(payload);
  };

  const watchedValues = watch();

  const autoSavePayload = useMemo(() => () => {
    const { documentNpwp, npwp } = watchedValues;

    const payload: Record<string, any> = {
      bucketProcessId: data?.bucketProcessId || processId,
      debtorId: id,
      module: data?.module,
      npwp: npwp,
      process: data?.process,
    };

    if (documentNpwp?.file) {
      payload.npwpFile = documentNpwp.file;
    }

    if (data?.remark) {
      payload.remark = data.remark;
    }

    return Promise.resolve(payload);
  }, [watchedValues, data, id, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !!id,
    payload: autoSavePayload,
    url: 'bucket.manage.saveCustomer',
  });


  return {
    control,
    formState,
    handleSubmit,
    isAutoSaveFetching,
    isSaveLoading,
    modal,
    modalId,
    mutateDebtor,
    setValue,
    theme,
  };
};

export default useModalTableDebtorNew;
