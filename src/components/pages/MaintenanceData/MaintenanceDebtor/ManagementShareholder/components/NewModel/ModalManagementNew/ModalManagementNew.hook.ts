import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useSaveManagement from '../../../hooks/useSaveManagement';
import { modalData } from '../../../ManagementShareholder.constants';

import { validationSchema } from './ModalManagementNew.schema';


const useModalManagementNew = () => {
  const theme = useTheme();
  const { debtorId } = useIdentity();
  const modalId = modalData.MODAL_MANAGEMENT_NEW;
  const modal = useModal(modalId);

  const { isPending: isSaveLoading, mutate } = useSaveManagement({
    onError: () => showNiceModalV2({ title: 'Gagal Menambahkan Management', type: 'error' }),
    onSuccess: () => {
      closeNiceModal(modalId).then(() => {
        showNiceModalV2({ title: 'Berhasil Menambahkan Management', type: 'success' });
      });
    },
  });

  const { getValues, formState, reset, handleSubmit, control } = useForm({
    defaultValues: {
      address: '',
      city: '',
      collectability: '',
      collectabilityStatusPer: '',
      country: '',
      district: '',
      dob: '',
      etnicOrigin: '',
      gender: '',
      idNo: '',
      idType: '',
      identityExpiry: '',
      name: '',
      nationality: '',
      npwp: '',
      phone: '',
      position: '',
      postalCode: '',
      province: '',
      status: '',
      title: '',
      village: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const mutateManagement = () => {
    const formValues = getValues();

    mutate({
      ...formValues,
      debtorId,
      postalCode: Number(formValues.postalCode),
    });
  };


  return {
    control,
    formState,
    getValues,
    handleSubmit,
    isSaveLoading,
    modal,
    modalId,
    mutateManagement,
    reset,
    theme,
  };
};

export default useModalManagementNew;
