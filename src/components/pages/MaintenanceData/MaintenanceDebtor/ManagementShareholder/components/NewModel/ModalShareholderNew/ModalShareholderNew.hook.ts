import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useSaveShareholder from '../../../hooks/useSaveShareholder';
import { modalData } from '../../../ManagementShareholder.constants';

import { validationSchema } from './ModalShareholderNew.schema';


const useModalShareholderNew = () => {
  const { debtorId } = useIdentity();
  const theme = useTheme();
  const modalId = modalData.MODAL_SHAREHOLDER_NEW;
  const modal = useModal(modalId);


  const { isPending: isSaveLoading, mutate } = useSaveShareholder({
    onError: () => showNiceModalV2({ title: 'Gagal Menambahkan Shareholder', type: 'error' }),
    onSuccess: () => {
      closeNiceModal(modalId).then(() => {
        showNiceModalV2({ title: 'Berhasil Menambahkan Shareholder', type: 'success' });
      });
    },
  });

  const { getValues, setValue, watch, formState, reset, handleSubmit, control } = useForm({
    defaultValues: {
      address: '',
      collectability: '',
      collectabilityStatus: '',
      currency: '',
      district: '',
      gender: '',
      level: '',
      name: '',
      nik: '',
      nominal: '',
      npwp: '',
      owner: '',
      percentage: '',
      shareholderType: '',
      shares: '',
      village: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });


  const mutateShareholder = () => {
    const formValues = getValues();

    mutate({
      ...formValues,
      debtorId,
      percentage: Number(formValues.percentage),
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
    mutateShareholder,
    reset,
    setValue,
    theme,
    watch,
  };
};

export default useModalShareholderNew;
