import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { passwordSchema } from './CreatePassword.constants';


const useCreatePassword = () => {
  const methods = useForm({
    criteriaMode: 'all',
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
      oldPassword: '',
      username: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(passwordSchema),
  });

  return {
    methods,
  };
};

export default useCreatePassword;
