import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import ExternalCreationForm from '../components/ExternalCreationForm';
import InternalCreationForm from '../components/InternalCreationForm';
import { USER_TYPE } from '../constants';
import useGetDetailSubmission from '../hooks/useGetDetailSubmission';
import useGetDetailUser from '../hooks/useGetDetailUser';
import useValidateUser from '../hooks/useValidateUser';

import { yupSchema } from './EditUser.schema';


const useEditUser = () => {
  const { id }: {id: string} = useParams();
  const processId = id && id.includes('UM-') ? id : '';

  const { data: userTypeList } = useGetParameterList('USER_TYPE');
  const [selectedUserType, setSelectedUserType] = useState('');
  const [countResetData, setCountResetData] = useState(1);

  const {
    data: detailSubmission,
    isLoading: isDetailSubmissionLoading,
    isSuccess: isDetailSubmissionSuccess,
  } = useGetDetailSubmission({ bucketProcessId: processId }, {
    enabled: !!processId && id.includes('UM-'),
  });

  const {
    data: detaiUser,
    isLoading: isDetailUserLoading,
    isSuccess: isDetailUserSuccess,
  } = useGetDetailUser({ userId: id }, {
    enabled: !!id && !id.includes('UM-'),
  });

  const detailUserData = processId ? detailSubmission : detaiUser;
  const isLoding = processId ? isDetailSubmissionLoading : isDetailUserLoading;
  const isSuccess = processId ? isDetailSubmissionSuccess : isDetailUserSuccess;

  const formMethods = useForm({
    defaultValues: {
      email: '',
      userType: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: yupResolver(yupSchema),
  });

  const { control, reset, watch, handleSubmit } = formMethods;

  const { data: validateData, mutate: mutateValidateUser, isPending: isValidateUserLoading } = useValidateUser({
    onError: (error) => {
      showNiceModalV2({
        title: error.response.data.errorDetail || 'Gagal continue',
        type: 'error',
      });
    },
    onSuccess: (payload) => {
      showNiceModalV2({
        onClose: () => {
          setSelectedUserType(payload.userType);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      setCountResetData((prev) => prev + 1);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      reset({
        email: detailUserData?.email,
        userType: detailUserData?.userType,
      });
    }
  }, [detailUserData]);

  const typeUser = watch('userType');


  const renderUserDetail = () => {
    switch (typeUser) {
      case USER_TYPE.INTERNAL:
        return (
          <InternalCreationForm
            detailUser={{
              data: detailUserData,
              isLoading: isLoding,
              isSuccess: isSuccess,
            }}
            countResetData={countResetData}
          />
        );
      case USER_TYPE.EXTERNAL:
        return (
          <ExternalCreationForm
            detailUser={{
              data: detailUserData,
              isLoading: isLoding,
              isSuccess: isSuccess,
            }}
            countResetData={countResetData}
          />
        );
      default:
        null;
    }
  };

  const handleOnContinue = (data) => {
    setCountResetData(1);
    mutateValidateUser({
      email: data.email,
      userId: detailUserData?.userId ?? null,
      userType: data.userType,
    });
  };

  const isRequiredEmpty = !watch('email');


  return {
    control,
    formMethods,
    handleOnContinue,
    handleSubmit,
    isRequiredEmpty,
    renderUserDetail,
    setCountResetData,
    setValue: formMethods.setValue,
    userTypeList,
    watch,
  };
};

export default useEditUser;
