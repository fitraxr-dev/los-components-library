import { useCallback } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';


import { MODAL } from '@/configs/constants/modalId';
import { HOME_PAGE } from '@/configs/constants/pathname';
import useRequestChangePassword from '@/hooks/services/useRequestChangePassword';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import { passwordSchema } from './ChangePassword.constants';


type useChangePasswordProps = {
  modalId: string;
};

const useChangePassword = (props: useChangePasswordProps) => {
  const methods = useForm({
    criteriaMode: 'all',
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
      oldPassword: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(passwordSchema),
  });
  const router = useCustomRouter();

  const { mutate, isPending } = useRequestChangePassword({
    onError: () => {
      closeNiceModal(props.modalId);
    }, onSuccess: (data) => {
      closeNiceModal(props.modalId);
    },
  });

  const onSubmit = useCallback((data: {oldPassword: string; newPassword: string; newPasswordConfirm: string}) => {
    console.log('data', data);
    mutate({ confirmPassword: data.newPasswordConfirm, currentPassword: data.oldPassword, password: data.newPassword });
  }, []);


  return {
    isPending,
    methods,
    onSubmit,
  };
};

export default useChangePassword;
