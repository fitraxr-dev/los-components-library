import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useSearchAllUser from '@/hooks/services/useSearchUser';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useSaveUserAssignedDivision from '../../../hooks/useSaveUserAssignedDivision';
import { MODAL } from '../../../RisalahRapatResult.contants';


export const validationScheme = yup.object({
  division: yup.object({ id: yup.string().required(), label: yup.string().required() }).nullable().when('$others', {
    is: (val: boolean) => val === true,
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Division Tidak Boleh Kosong'),
  }),
  user: yup.object({
    division: yup.array().of(
      yup.object().shape({
        directorate: yup.object().shape({
          directorateCode: yup.string(),
          name: yup.string(),
        }),
        divisionCode: yup.string(),
        name: yup.string(),
      })),
    fullName: yup.string().required(),
    roleRefactor: yup.object({
      name: yup.string(),
    }),
    userId: yup.string(),
  }).required('Nama Tidak Boleh Kosong'),
});


const useUserCollaborationModal = (division: string) => {
  const modalId = MODAL.USER_COLLABORATION;
  const modal = useModal(modalId);
  const theme = useTheme();
  const { processId } = useIdentity();
  const [checkboxDivisi, setCheckboxDivisi] = useState([]);

  const others = division === 'OTHERS';

  const {
    control,
    formState: { errors },
    resetField,
    watch,
    getValues,
    setValue,
  } = useForm({
    context: { others },
    defaultValues: {
      division: { id: null, label: '' },
      user: {
        division: [],
        fullName: '',
      },
    },
    mode: 'onChange',
    resolver: yupResolver(validationScheme),
  });

  const { data: userData, isSuccess: directorDataNameLoading } = useSearchAllUser({
    division: division === 'OTHERS' ? watch('division.id') : division,
    value: watch('user.fullName'),
  });

  const { data: divisionData } = useSearchAllDivision(
    {
      categoryCode: 'OTHERS',
      value: watch('division.label'),
    },

    { enabled: division === 'OTHERS' }
  );

  useEffect(() => {
    if (getValues('division.id') === '') {
      resetField('user');
    }
  }, [watch('division')]);

  const { mutate, isSuccess } = useSaveUserAssignedDivision({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const directorDataName = userData?.contents?.map((data) => (
    { ...data, id: data.userId, label: data.fullName }
  ));

  const divisionDataName = divisionData?.contents?.map((data) => ({ ...data, id: data.id, label: data.name }));

  const handleSubmitCollaborator = () => {
    const data = watch();
    mutate({
      bucketProcessId: processId,
      directorateId: data.user.division?.[0]?.directorate.directorateCode,
      divisionId: others ? data.division.id : data.user.division?.[0]?.divisionCode,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
      staffId: +data.user.userId,
    });
  };

  return {
    checkboxDivisi,
    control,
    directorDataName,
    directorDataNameLoading,
    divisionData: divisionDataName,
    errors,
    handleSubmitCollaborator,
    modal,
    modalId,
    others,
    setCheckboxDivisi,
    setValue,
    theme,
    watch,
  };
};

export default useUserCollaborationModal;
