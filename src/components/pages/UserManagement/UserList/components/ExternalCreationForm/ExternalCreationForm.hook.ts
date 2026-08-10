import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFormContext } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { userManagement } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import { modal } from '../../constants';
import useGetAccessMenuDetail from '../../hooks/useGetAccessMenuDetail';
import useGetMasterAccessMenu from '../../hooks/useGetMasterAccessMenu';
import useGetMasterGroup from '../../hooks/useGetMasterGroup';
import useGetMasterPosition from '../../hooks/useGetMasterPosition';
import useGetMasterRole from '../../hooks/useGetMasterRole';
import useSaveUser from '../../hooks/useSaveUser';
import useValidateUser from '../../hooks/useValidateUser';

import { formDefaultValues } from './ExternalCreationForm.constants';
import { getYupSchema, getYupSchemaNonMandatory } from './ExternalCreationForm.schema';

import type { AccessMenuItems, ExternalCreationFormProps } from './ExternalCreationForm.types';


const useExternalCreationForm = (props: ExternalCreationFormProps) => {
  const {
    detailUser = {
      data: [],
      isLoading: false,
      isSuccess: false,
    },
    countResetData,
  } = props;

  const path = usePathname();
  const creationFormMethodContext = useFormContext();
  const { id }: { id: string } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchDetailValue, setSearchDetailValue] = useState({
    accessMenu: '',
    position: '',
    reason: '',
    userGroup: '',
  });

  const queryClient = useQueryClient();

  const isEdit = getLastPath(path) === 'edit';
  const isAdd = getLastPath(path) === 'add';

  const { userType, email } = creationFormMethodContext?.watch();
  const isGetDetailSuccess = detailUser.isSuccess;
  const detailData = isGetDetailSuccess && detailUser.data;
  const processIdFromParams = id && id.includes('UM-') ? id : '';
  const isHasProcessIdParams = id;
  const isHasProcessId = id && id.includes('UM-');
  const bucketProcessIdFromQs = searchParams.get('bucketProcessId');
  const processId = isAdd ? bucketProcessIdFromQs : processIdFromParams;
  const [newBucketProcessId, setNewBucketProcessId] = useState<string | undefined>(undefined);
  const isHasBucketProcessId = newBucketProcessId && newBucketProcessId.includes('UM-');
  const { recordActivity } = useRecordLog();
  const [accessMenuId, setAccessMenuId] = useState<string>('');

  const { mutate: mutateValidateUser } = useValidateUser({
    onError: (error) => {
      showNiceModalV2({
        title: error.response.data.errorDetail,
        type: 'error',
      });
    },

  });


  const yupSchema = getYupSchema(isEdit);

  const { control, handleSubmit, reset, watch, setValue, formState: { isValid } } = useForm({
    defaultValues: {
      ...formDefaultValues,
      reason: isEdit
        ? { id: '', label: '' }
        : 'Pendaftaran Baru',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(yupSchema),
  });

  const { data: userGroupData } = useGetMasterGroup({
    filter: {
      type: userType,
    },
    page: {
      itemPerPage: 10000,
      noPage: 1,
    },
    searchDetail: {
      key: 'name',
      value: searchDetailValue.userGroup,
    },
  });

  const { data: roleData } = useGetMasterRole({
    filter: {
      group: watch('userGroup.id'),
    },
    page: {
      itemPerPage: 10000,
      noPage: 1,
    },
  }, {
    enabled: !!watch('userGroup.id'),
  });

  const { data: positionData, isSuccess: isPositionSuccess } = useGetMasterPosition({
    filter: {
      division: null,
      userType,
    },
    page: {
      itemPerPage: 10000,
      noPage: 1,
    },
    searchDetail: {
      key: 'name',
      value: searchDetailValue.position,
    },
  }, {
    enabled: !!watch('role'),
  });

  const { data: accessMenuData } = useGetMasterAccessMenu({
    page: {
      itemPerPage: 10000,
      noPage: 1,
    },
    searchDetail: {
      key: 'permissionName',
      value: searchDetailValue.accessMenu,
    },
  });

  const { data: accessMenuDetailData } = useGetAccessMenuDetail(
    {
      id: accessMenuId,
    },
    {
      enabled: !!accessMenuId,
    }
  );

  const accessMenuItems = accessMenuDetailData?.menuItems as AccessMenuItems[] || [];

  const { data: reasonData } = useGetParameterList('userReason');

  const reasonList = reasonData?.map((reason) => ({
    id: reason.value,
    label: reason.label,
  }));

  const roleList = roleData?.contents?.map((role) => ({
    label: role.label,
    value: role.key,
  }));

  const positionList = isPositionSuccess ? positionData?.contents?.map((position) => ({
    label: position.label,
    value: position.key,
  })) : [];

  const userGroupList = userGroupData?.contents?.map((user) => ({
    id: user.key,
    label: user.label,
  }));

  const accessMenuList = accessMenuData?.contents?.map((access) => ({
    id: access.key,
    label: access.label,
  }));

  const userStatusList = [
    {
      label: 'Active',
      value: 'ACTIVE',
    }, {
      label: 'Inactive',
      value: 'IN_ACTIVE',
    }
  ];

  useEffect(() => {
    const fullName = creationFormMethodContext.control._options.context?.validateData?.fullName;
    if (fullName && typeof fullName === 'string' && !fullName.includes('@')) {
      setValue('name', fullName);
    }
  }, [creationFormMethodContext, setValue]);

  useEffect(() => {
    if (isEdit && isGetDetailSuccess) {

      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.USER_MANAGEMENT,
        process: TypeProcess.USER_MANAGEMENT,
        remarks: 'view user management detail page',
      });

      const reason = isEdit
        ? { id: detailData?.userAccount?.reason, label: detailData?.userAccount?.reason }
        : detailData?.userAccount?.reason;
      reset({
        accessMenu: {
          id: detailData?.permission?.key,
          label: detailData?.permission?.label,
        },
        description: detailData?.description,
        directorate: {
          id: (detailData?.status === 'IN_ACTIVE' && detailData?.accessManagements?.[0])
            ? detailData?.accessManagements?.[0]?.userDivision?.directorate?.directorateCode
            : detailData?.accessManagementActive?.userDivision?.directorate?.directorateCode,
          label: (detailData?.status === 'IN_ACTIVE' && detailData?.accessManagements?.[0])
            ? detailData?.accessManagements?.[0]?.userDivision?.directorate?.name
            : detailData?.accessManagementActive?.userDivision?.directorate?.name,
        },
        division: {
          id: (detailData?.status === 'IN_ACTIVE' && detailData?.accessManagements?.[0])
            ? detailData?.accessManagements?.[0]?.userDivision?.divisionCode
            : detailData?.accessManagementActive?.userDivision?.divisionCode,
          label: (detailData?.status === 'IN_ACTIVE' && detailData?.accessManagements?.[0])
            ? detailData?.accessManagements?.[0]?.userDivision?.name
            : detailData?.accessManagementActive?.userDivision?.name,
        },
        expiredDate: detailData?.userAccount?.expiredDate,
        institute: detailData?.institute,
        name: detailData?.fullName,
        nik: detailData?.nik,
        position: (detailData?.status === 'IN_ACTIVE' && detailData?.accessManagements?.[0])
          ? detailData?.accessManagements?.[0]?.userPosition?.map((item) => item.positionCode)
          : detailData?.accessManagementActive?.userPosition?.map((item) => item.positionCode),
        privyId: detailData?.privyId,
        processId: detailData?.bucketProcessId,
        proposalReference: detailData?.reference,
        reason,
        reportTo: {
          id: (detailData?.status === 'IN_ACTIVE' && detailData?.accessManagements?.[0])
            ? String(detailData?.accessManagements?.[0]?.userSuperior?.userId)
            : String(detailData?.accessManagementActive?.userSuperior?.userId),
          label: (detailData?.status === 'IN_ACTIVE' && detailData?.accessManagements?.[0])
            ? detailData?.accessManagements?.[0]?.userSuperior?.fullName
            : detailData?.accessManagementActive?.userSuperior?.fullName,
        },
        role: (detailData?.status === 'IN_ACTIVE' && detailData?.accessManagements?.[0])
          ? detailData?.accessManagements?.[0]?.userRoleRefactor?.roleCode
          : detailData?.accessManagementActive?.userRoleRefactor?.roleCode,
        userGroup: {
          id: (detailData?.status === 'IN_ACTIVE' && detailData?.accessManagements?.[0])
            ? detailData?.accessManagements?.[0]?.userGroup?.code
            : detailData?.accessManagementActive?.userGroup?.code,
          label: (detailData?.status === 'IN_ACTIVE' && detailData?.accessManagements?.[0])
            ? detailData?.accessManagements?.[0]?.userGroup?.name
            : detailData?.accessManagementActive?.userGroup?.name,
        },
        userId: detailData?.userId,
        userStatus: detailData?.status,
        userType: detailData?.userType,
      });
    }
  }, [detailUser.data]);

  useEffect(() => {
    if (countResetData > 1) {
      setValue('position', formDefaultValues.position);
      setValue('userGroup', formDefaultValues.userGroup);
      setValue('role', formDefaultValues.role);
    }
  }, [countResetData, setValue]);

  const { mutate: saveUser, isPending: isSaveUserLoading } = useSaveUser({
    onError: (error) => {
      const errorMessage = error?.response?.data?.errorDetail || 'Data gagal disimpan';

      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: (response, payload) => {
      recordActivity({
        activity: isEdit ? ActivityType.EDIT : ActivityType.ADD,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(payload),
        module: TypeModule.USER_MANAGEMENT,
        process: TypeProcess.USER_MANAGEMENT,
        remarks: isEdit ? 'edit user' : 'add user',
      });
      setNewBucketProcessId(response.bucketProcessId);
      showNiceModalV2({
        onClose: () => {
          if (isAdd) {
            router.replace(replacePath(userManagement.USER_LIST.EDIT, { id: response.bucketProcessId }));
          }
          if (isEdit) {

            if (!isHasProcessId) {
              router.replace(replacePath(userManagement.USER_LIST.EDIT, { id: response.bucketProcessId }));
            }
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: submitBucket } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: (variable) => {
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(variable),
        module: TypeModule.USER_MANAGEMENT,
        process: TypeProcess.USER_MANAGEMENT,
        remarks: 'Submit Data User',
      });
      queryClient.invalidateQueries({ queryKey: ['um-user-submission-list']});
      showNiceModalV2({
        onClose: () => {
          router.replace(userManagement.USER_LIST.BUCKET_LIST);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  useEffect(() => {
    const currentAccessMenuId = watch('accessMenu.id');
    if (currentAccessMenuId) {
      setAccessMenuId(currentAccessMenuId);
    }
  }, [watch('accessMenu.id')]);

  const handleOnAccessMenuChange = (value: any | null) => {
    if (value?.id) {
      setAccessMenuId(value.id);
    } else {
      setAccessMenuId('');
    }
  };

  const handleResetNextInput = (currentInputId: keyof typeof searchDetailValue | 'role') => {
    switch (currentInputId) {
      case 'userGroup':
        setValue('role', formDefaultValues.role);
        setValue('position', formDefaultValues.position);
        break;
      case 'role':
        setValue('position', formDefaultValues.position);
        break;
    }
  };

  function handleOnSave() {

    const schema = getYupSchemaNonMandatory(isEdit);
    const data = watch();
    schema.validate(data, { abortEarly: false });


    mutateValidateUser({
      email: email,
      userId: null,
      userType: userType,
    }, {
      onSuccess: () => {
        const editPayload = {
          bucketProcessId: isHasProcessId ? processId : null,
          privyId: detailData?.privyId,
          status: data.userStatus,
          userId: data.userId,
        };

        const payload = {
          accessMenuId: data.accessMenu?.id || null,
          description: data.description,
          email,
          expiredDate: data.expiredDate,
          fullName: data.name,
          institute: data.institute,
          position: data.position,
          reason: isEdit && typeof data.reason !== 'string' ? data.reason.id : data.reason as string,
          reference: data.proposalReference,
          roleCode: data.role,
          userGroup: data.userGroup.id,
          userType,
          withValidation: false,
          ...(isEdit ? editPayload : {}),
        };

        saveUser(payload);
      },
    });
  }

  const handleOnInputChange = (inputId: keyof typeof searchDetailValue, value: string) => {
    setSearchDetailValue((prev) => ({
      ...prev,
      [inputId]: value,
    }));
  };

  const handleOpenAccessMenuModal = () => {
    NiceModal.show(modal.ACCESS_MENU, { accessMenuItems });
  };

  const handleOnSubmit = () => {
    mutateValidateUser({
      email: email,
      userId: null,
      userType: userType,
    }, {
      onSuccess: () => {
        NiceModal.show(MODAL.GLOBAL.COMMENT, {
          onSave: ({ comment }) => {
            submitBucket({
              submitRequestDto: {
                action: 'SUBMIT',
                bucketProcessId: processId,
                comment,
                module: TypeModule.USER_MANAGEMENT,
                process: TypeProcess.USER_MANAGEMENT,
              },
            });
            closeNiceModal(MODAL.GLOBAL.COMMENT);
          },
        });
      },
    });
  };

  const handleOnCancelProcess = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: 'CANCELED',
            bucketProcessId: newBucketProcessId || processId,
            comment,
            module: TypeModule.USER_MANAGEMENT,
            process: TypeProcess.USER_MANAGEMENT,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  return {
    accessMenuList,
    control,
    handleOnAccessMenuChange,
    handleOnCancelProcess,
    handleOnInputChange,
    handleOnSave,
    handleOnSubmit,
    handleOpenAccessMenuModal,
    handleResetNextInput,
    handleSubmit,
    isAdd,
    isEdit,
    isHasBucketProcessId,
    isHasProcessId,
    isHasProcessIdParams,
    isSaveUserLoading,
    isValid,
    positionList,
    reasonList,
    roleList,
    setValue,
    userGroupList,
    userStatusList,
    watch,
  };
};

export default useExternalCreationForm;
