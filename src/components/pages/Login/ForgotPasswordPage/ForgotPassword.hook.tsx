import { useCallback } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';


import { MODAL } from '@/configs/constants/modalId';
import useCustomRouter from '@/hooks/useCustomRouter';

import { forgotPasswordSchema } from './ForgotPassword.constants';
import useRequestForgotPassword from './hooks/useRequestForgotPassword';


type useForgotPasswordProps = {
  token: string;
};

const useForgotPassword = (props: useForgotPasswordProps) => {
  const router = useCustomRouter();
  const methods = useForm({
    criteriaMode: 'all',
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { mutate, isPending } = useRequestForgotPassword({
    onError: (errText) => {
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        title: errText,
      });
    }, onSuccess: () => {
      NiceModal.show(MODAL.GLOBAL.SUCCESS, {
        buttonText: 'Kembali Ke Login',
        onClose: () => {
          router.push('/login');
        },
        title: 'Url reset password berhasil dikirim ke email anda, silakan buka email anda dan klik link yang telah kami kirimkan.',
      });
    } });

  const onSubmit = useCallback((data: {email: string}) => {
    mutate({ password: '', username: data.email });
  }, []);


  return {
    isPending,
    methods,
    onSubmit,
  };
};

export default useForgotPassword;
