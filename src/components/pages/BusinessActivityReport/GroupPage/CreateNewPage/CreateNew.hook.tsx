import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';


import { TABLE_HEADER_MEMBER } from '../DetailPage/Detail.constants';
import useSaveDebitorGroupV2 from '../hooks/Group/useSaveDebtorGroupV2';
import useValidateGroupName from '../hooks/Group/useValidateGroupName';

import { modal } from './CreateNew.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BaseResponseGenericSingleDtoDebtorGroupDto, ParameterDto } from '@/services/openapi/loan-service';


const validationSchema = Yup.object().shape({
  groupName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  groupType: Yup.string().required('Required'),
  idGroup: Yup.string(),
  isRelatedToSmi: Yup.boolean().required('Required'),
  sector: Yup.string().required('Required'),
  yearFounded: Yup.string().notRequired(),
});

export const CreateNewPageHooks = () => {
  const theme = useTheme();
  const route = useCustomRouter();
  const { debtorId, processId } = useParams();

  const { control, handleSubmit: handleSubmitForm, formState: { errors, isDirty, isValid } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  // Dropdown data
  const { data: sectorDropdownList } = useGetParameterList('sector');

  // Group Type Data
  const { data: groupTypeList } = useGetParameterList('groupType');

  //Save Customer Data
  const { isPending: isSaveLoading, mutate: saveDebitur } = useSaveDebitorGroupV2({
    onError: (data) => {
      const errorMessage = data.response.data.errorDetail;
      showNiceModal('error', errorMessage);
    },
    onSuccess: (data: BaseResponseGenericSingleDtoDebtorGroupDto) =>
      showNiceModalV2({
        onClose: () => {
          route.replace(`detail/${data.data.content.id}`);
        }, title: 'Group Berhasil terbuat', type: 'success',
      }),
  });

  const { mutate: validateGroup } = useValidateGroupName({
    onError() {},
    onSuccess() {},
  });

  const handleSubmit = (data: any) => {
    const body = {
      bucketProcessId: processId as string,
      debtorId: debtorId as string,
      groupType: data.groupType,
      isRelatedSmi: data.isRelatedToSmi,
      module: 'BAR',
      name: data.groupName,
      process: 'BAR',
      sector: data.sector,
      yearFounded: data.yearFounded && dayjs(data.yearFounded).year().toString(),
    };

    //saveDebitur(body);
    validateGroup({
      name: data.groupName,
    }, {
      onError() {
        showNiceModalV2({
          onClose: () => {},
          type: 'error',
        });
      },
      onSuccess(resp) {
        if (resp.content.similarGroupList.length < 1) {
          saveDebitur(body);
        } else {
          NiceModal.show(modal.EXISTING_GROUP, {
            ...resp.content,
            payload: body,
          });
        }
      },
    });
  };

  const tableHeaderMember: TableHeader[] = [
    ...TABLE_HEADER_MEMBER,
    {
      key: 'action',
      label: 'Action',
      options: [],
      type: 'action',
    },
  ];

  return {
    control,
    groupTypeList,
    handleSubmit,
    handleSubmitForm,
    isDirty,
    isSaveLoading,
    isValid,
    sectorDropdownList,
    tableHeaderMember,
    theme,
  };
};
