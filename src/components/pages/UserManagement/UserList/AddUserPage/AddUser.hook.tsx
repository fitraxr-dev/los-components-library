import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import ExternalCreationForm from '../components/ExternalCreationForm';
import InternalCreationForm from '../components/InternalCreationForm';
import { USER_TYPE } from '../constants';
import useValidateUser from '../hooks/useValidateUser';

import { yupSchema } from './AddUser.schema';


const useAddUser = () => {
  const [selectedUserType, setSelectedUserType] = useState('');
  const [countResetData, setCountResetData] = useState(1);

  const { data: userTypeList } = useGetParameterList('USER_TYPE');

  const { data: validateData, mutate: mutateValidateUser, isPending: isValidateUserLoading } = useValidateUser({
    onError: (error) => {
      showNiceModalV2({
        title: error.response.data.errorDetail || 'Gagal continue',
        type: 'error',
      });
    },
    onSuccess: (payload) => {
      setSelectedUserType(payload.userType);
      setCountResetData((prev) => prev + 1);
    },
  });

  const formMethods = useForm({
    context: {
      validateData,
    },
    defaultValues: {
      email: '',
      userType: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(yupSchema),
  });

  const { control, watch, handleSubmit, setValue } = formMethods;

  const renderUserDetail = () => {
    switch (selectedUserType) {
      case USER_TYPE.INTERNAL:
        return (
          <InternalCreationForm
            countResetData={countResetData}
          />
        );
      case USER_TYPE.EXTERNAL:
        return (
          <ExternalCreationForm countResetData={countResetData} />
        );
    }
  };

  const handleOnContinue = (data) => {
    setCountResetData(1);
    mutateValidateUser({
      email: data.email,
      userId: null,
      userType: data.userType,
    });
  };

  const isRequiredEmpty = !watch('userType') || !watch('email');

  return {
    control,
    formMethods,
    handleOnContinue,
    handleSubmit,
    isRequiredEmpty,
    isValidateUserLoading,
    renderUserDetail,
    setCountResetData,
    setValue,
    userTypeList,
    watch,
  };
};

export default useAddUser;
