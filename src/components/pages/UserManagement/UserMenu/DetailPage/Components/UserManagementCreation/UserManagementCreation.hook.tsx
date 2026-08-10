'use client';
import { useEffect, useState } from 'react';

import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { userManagement } from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';


import useGetGroupList from '../../../shared/hooks/master-controller/useGetGroupList';
import useGetMasterDivision from '../../../shared/hooks/master-controller/useGetMasterDivision';
import useGetMasterPosition from '../../../shared/hooks/master-controller/useGetMasterPosition';
import useGetMasterRole from '../../../shared/hooks/master-controller/useGetMasterRole';
import useGetMasterUser from '../../../shared/hooks/master-controller/useGetMasterUser';
import useCreateOrUpdateUser from '../../../shared/hooks/user-controller/useCreateOrUpdateUser';
import useGetDetailUser from '../../../shared/hooks/user-controller/useGetDetailUser';


const useUserManagementCreation = () => {
  const { processId }: { processId: string } = useParams();
  const path = usePathname();
  const { setProcessId } = useIdentity();
  const router = useCustomRouter();

  const isEdit = getLastPath(path) !== 'add';
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      description: null,
      divisionCode: null,
      email: null,
      fullName: null,
      lastLogin: null,
      nik: null,
      position: null,
      privyId: null,
      roleCode: null,
      status: null,
      superiorCode: null,
      userGroup: { key: null, label: null },
      userId: null,
    },
  });

  const watchFields = watch();

  const {
    data: detailUser,
    isFetched: detailUserIsFetched,
  } = useGetDetailUser(processId);

  const { data: roleList } = useGetMasterRole();
  const { data: divisionList } = useGetMasterDivision();
  const { data: positionList } = useGetMasterPosition();
  const { data: groupList } = useGetGroupList();
  const { data: userList } = useGetMasterUser(watchFields.divisionCode, watchFields.roleCode);


  const { mutate, isPending: isSaveLoading } = useCreateOrUpdateUser(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: (variable) => {
        setProcessId(variable.data.bucketProcessId),
        showNiceModalV2({
          onClose() {
            router.push(replacePath(
              userManagement.USER_DETAIL, {
                processId: variable.data.bucketProcessId,
              }));
          }, title: 'Data berhasil diupdate!', type: 'success' });
      },
    });


  useEffect(() => {
    if (detailUserIsFetched && isEdit) {

      reset({
        description: detailUser.description,
        divisionCode: detailUser.division.map((dt) => dt.divisionCode),
        email: detailUser.email,
        fullName: detailUser.fullName,
        lastLogin: detailUser.lastLoginDate,
        nik: detailUser.nik,
        position: detailUser.position.map((dt) => dt.positionCode),
        privyId: detailUser.privyId,
        roleCode: detailUser.roleRefactor.roleCode,
        status: detailUser.status,
        superiorCode: detailUser.superior,
        userGroup: detailUser.userGroup,
        userId: detailUser.userId,
      });
    }
  }, [detailUserIsFetched]);

  const handleCancel = () => {
    if (isEdit) {
      router.push(replacePath(userManagement.USER_DETAIL, { processId }));
    } else {
      router.push(userManagement.USER_LIST);
    }

  };

  const handleSetUserGroup = (e) => {
    const res = groupList.find((dt) => dt.value === e);

    setValue('userGroup', { key: res.value, label: res.label });
  };

  const handleOnSave = (data: any) => {

    const isApplicationDetail = getLastPath(path).split('-')[0] === 'UM';

    mutate({
      bucketProcessId: isApplicationDetail ? processId : undefined,
      description: data.description,
      divisionCode: data.divisionCode,
      email: data.email,
      fullName: data.fullName,
      nik: data.nik,
      position: data.position,
      privyId: data.privyId,
      roleCode: data.roleCode,
      status: data.status,
      superiorCode: data.superiorCode,
      userGroup: data.userGroup.key,
      userId: data.userId,
    });
  };

  return {
    divisionList,
    groupList,
    handleCancel,
    handleOnSave,
    handleSetUserGroup,
    handleSubmit,
    isEdit,
    isSaveLoading,
    positionList,
    register,
    roleList,
    setValue,
    userList,
    watchFields,
  };
};

export default useUserManagementCreation;
