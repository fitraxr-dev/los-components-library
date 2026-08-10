import { useCallback } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';


import { MODAL } from '@/configs/constants/modalId';
import { HOME_PAGE } from '@/configs/constants/pathname';
import useCustomRouter from '@/hooks/useCustomRouter';

import { passwordSchema } from './CreatePassword.constants';
import useAuthCreatePassword from './hooks/useAuthCreatePassword';

import type { CreateNewPasswordRequest } from '@/services/openapi/auth-service';


type useCreatePasswordProps = {
  token: string;
};

const useCreatePassword = (props: useCreatePasswordProps) => {
  const methods = useForm({
    criteriaMode: 'all',
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(passwordSchema),
  });
  const router = useCustomRouter();

  const { mutate, isPending } = useAuthCreatePassword({
    onError: (errText) => {
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        title: errText,
      });
    }, onSuccess: () => {
      router.push(HOME_PAGE);
    },
    token: props.token });

  const onSubmit = useCallback((data: {newPassword: string; newPasswordConfirm: string}) => {
    mutate({ confirmPassword: data.newPasswordConfirm, password: data.newPassword });
  }, []);


  return {
    isPending,
    methods,
    onSubmit,
  };
};

export default useCreatePassword;
