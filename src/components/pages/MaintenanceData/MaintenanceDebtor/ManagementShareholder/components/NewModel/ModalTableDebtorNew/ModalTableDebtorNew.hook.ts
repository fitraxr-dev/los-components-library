import { useEffect } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';


import useGetDebtorById from '../../../hooks/useGetDebtorById';
import useSaveDebtor from '../../../hooks/useSaveDebtor';
import { modalData } from '../../../ManagementShareholder.constants';

import { validationSchema } from './ModalTableDebtorNew.schema';

import type { DocumentDto } from '@/services/openapi/master-service';


const useModalTableDebtorNew = ({ id }: { id: string }) => {
  console.log('id', id);
  const theme = useTheme();
  const modalId = modalData.MODAL_TABLE_DEBTOR_NEW;
  const modal = useModal(modalId);
  const { debtorId } = useIdentity();

  const { isPending: isSaveLoading, mutate } = useSaveDebtor({
    onError: () => showNiceModalV2({ title: 'Gagal Menambahkan Customer', type: 'error' }),
    onSuccess: () => {
      closeNiceModal(modalId).then(() => {
        showNiceModalV2({ title: 'Berhasil Menambahkan Customer', type: 'success' });
      });
    },
  });


  const { data, isSuccess } = useGetDebtorById({ debtorId });

  const { getValues, handleSubmit, control, setValue, formState } = useForm({
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
      const { name, npwp, npwpFileName } = data;
      setValue('name', name);
      setValue('npwp', npwp);

      if (npwpFileName) {
        setValue('documentNpwp', {
          extension: npwpFileName.split('.').pop(),
          file: null,
          name: npwpFileName.split('.').shift().concat('.'),
        });
      }
    }
  }, [data, setValue, isSuccess]);

  const mutateDebtor = () => {
    const formValues = getValues();

    let listDocuments: DocumentDto[] = [];

    const { documentNpwp } = formValues;

    if (documentNpwp.file) {
      listDocuments.push({
        base64: documentNpwp.file,
        documentType: 'NPWP',
        fileExt: documentNpwp.extension,
        fileName: documentNpwp.name,
      });
    }


    mutate({
      debtorId: id,
      listDocuments,
      name: formValues.name,
      npwp: formValues.npwp,
    });
  };


  return {
    control,
    formState,
    handleSubmit,
    isSaveLoading,
    modal,
    modalId,
    mutateDebtor,
    theme,
  };
};

export default useModalTableDebtorNew;
