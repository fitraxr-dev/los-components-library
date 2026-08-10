import { useCallback } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';


const schema = yup.object({
  comment: yup.string().required('Comment is required'),
});

type FormData = yup.InferType<typeof schema>;

const useReturnToMakerModal = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      comment: '',
    },
    resolver: yupResolver(schema),
  });

  const onSave = (callback: (data: FormData) => void) => {
    return handleSubmit(callback);
  };

  return {
    control,
    errors,
    onSave,
  };
};

export default useReturnToMakerModal;
