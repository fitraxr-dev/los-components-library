import { useMutation } from '@tanstack/react-query';


import { API } from '@/helpers/api';

import type { ValidationRequestDto } from '../components/ModalAddNew/ModalAddNew.types';


const useValidateRequest = ({
  onSuccess = () => {},
  onError = (err) => {},
}) => {

  const mutation = useMutation({
    mutationFn: async (payload: ValidationRequestDto) => {
      const res = await API('bucket.validation.validateRequest', {
        data: payload,
      });

      return res.data.data.content;
    },
    onError: (err) => {
      onError(err);
    },
    onSuccess: (_, variable) => {
      onSuccess();
    },
  });

  return mutation;
};


export default useValidateRequest;
