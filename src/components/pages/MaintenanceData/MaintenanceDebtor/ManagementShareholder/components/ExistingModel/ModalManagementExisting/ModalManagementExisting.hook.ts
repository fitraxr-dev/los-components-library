import { useEffect } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useGetManagement from '../../../hooks/useGetManagementById';
import useSaveManagement from '../../../hooks/useSaveManagement';
import { modalData } from '../../../ManagementShareholder.constants';

import { validationSchema } from './ModalManagement.constants';

import type { ModalManagementExistingProps } from './ModalManagementExisting.type';


const useModalManagementExisting = (props: ModalManagementExistingProps) => {
  const { debtorId } = useIdentity();
  const theme = useTheme();
  const modalId = modalData.MODAL_MANAGEMENT_EXISTING;
  const modal = useModal(modalId);

  const { isPending: isSaveLoading, mutate } = useSaveManagement({
    onError: () => showNiceModalV2({ title: 'Gagal Menambahkan Management', type: 'error' }),
    onSuccess: () => {
      closeNiceModal(modalId).then(() => {
        showNiceModalV2({ title: 'Berhasil Menambahkan Management', type: 'success' });
      });
    },
  });

  const { data } = useGetManagement({
    id: props.id,
  });

  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);

  const { getValues, setValue, watch, formState, reset, handleSubmit, control } = useForm({
    defaultValues: {
      dob: '',
      name: '',
      nik: '',
      nikFile: {
        extension: '',
        file: null,
        name: '',
        url: '',
      },
      npwp: '',
      npwpFile: {
        extension: '',
        file: null,
        name: '',
        url: '',
      },
      position: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      setValue('dob', data.dob);
      setValue('name', data.name);
      setValue('nik', data.nik);
      setValue('npwp', data.npwp);
      setValue('position', data.jobPosition);

      if (data.listDocuments.length > 0) {
        const npwpDoc = data.listDocuments?.find((item) => item.documentType === 'NPWP_MANAGEMENT');
        const nikDoc = data.listDocuments?.find((item) => item.documentType === 'NIK_MANAGEMENT');

        const npwpFile = npwpDoc ? {
          extension: npwpDoc.documentExtension ? `.${npwpDoc.documentExtension}` : null,
          name: npwpDoc.documentName,
          url: npwpDoc.document,
        } : null;

        const nikFile = nikDoc ? {
          extension: nikDoc.documentExtension ? `.${nikDoc.documentExtension}` : null,
          name: nikDoc.documentName,
          url: nikDoc.document,
        } : null;


        setValue('npwpFile', npwpFile);
        setValue('nikFile', nikFile);
      }
    }
  }, [data, setValue]);

  const mutateManagement = () => {
    const { npwpFile, name, npwp, position, dob, nik, nikFile } = getValues();

    let listDocuments = [];

    if (npwpFile?.file || nikFile?.file) {
      if (npwpFile?.file) {
        const { extension, name, file } = npwpFile;

        listDocuments.push({
          base64: file,
          documentType: 'NPWP',
          fileExt: extension,
          fileName: name,
        });
      }

      if (nikFile?.file) {
        const { extension, file, name } = nikFile;
        listDocuments.push({
          base64: file,
          documentType: 'NIK',
          fileExt: extension,
          fileName: name,
        });
      }
    }

    mutate({
      debtorId,
      dob,
      id: props.id,
      jobPosition: position,
      listDocuments,
      name,
      nik,
      npwp,
    });
  };

  return {
    control,
    formState,
    getValues,
    handleSubmit,
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
