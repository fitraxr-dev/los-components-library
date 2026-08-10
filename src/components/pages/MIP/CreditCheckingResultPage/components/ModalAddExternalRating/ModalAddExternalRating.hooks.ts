import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useGetExternalRating from '../../hooks/useGetExternalRatingDetail';
import useSaveExternalRating from '../../hooks/useSaveExternalRatings';

import { modalId } from './ModalAddExternalRating.constants';

import type { ExternalRatingRequestDto } from '@/services/openapi/mip-service';


const resultSchema = yup.object().shape({
  ratingDescription: yup.string().required('Remark is required'),
  ratingResult: yup.string().required('Result is required'),
});

const useModalAddExternalRating = (props) => {
  const { processId } = useIdentity();

  const { data } = useGetExternalRating({
    id: props?.id,
  });

  const { control, handleSubmit, reset } = useForm<ExternalRatingRequestDto>({
    defaultValues: {
      ratingDescription: '',
      ratingResult: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(resultSchema),
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  const { mutate } = useSaveExternalRating({
    onError: () => {
      showNiceModalV2({ title: 'Data gagal disimpan.', type: 'error' });
    },
    onSuccess: () => {
      closeNiceModal(modalId.MODAL_ADD_EXTERNAL_RATING).then(() => {
        showNiceModalV2({ title: 'Data berhasil disimpan.', type: 'success' });
      });
    },
  });

  const handleAddExternalRating = (data: ExternalRatingRequestDto) => {
    mutate({
      ...data,
      bucketProcessId: processId,
      module: TypeModule.MIP,
      process: TypeProcess.MIP,
    });
  };

  return {
    control,
    handleAddExternalRating,
    handleSubmit,
  };
};

export default useModalAddExternalRating;
