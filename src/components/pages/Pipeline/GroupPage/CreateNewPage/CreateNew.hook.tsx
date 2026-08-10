import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';


import { MODAL } from '@/configs/constants/modalId';
import { pipeline } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';


import { TABLE_HEADER_MEMBER } from '../DetailPage/Detail.constants';
import useSaveDebitorGroup from '../hooks/Group/useSaveDebtorGroup';
import useValidateGroupName from '../hooks/Group/useValidateGroupName';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BaseResponseGenericSingleDtoDebtorGroupDto } from '@/services/openapi/loan-service';


const validationSchema = Yup.object().shape({
  groupName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  groupType: Yup.string().required('Required'),
  idGroup: Yup.string(),
  isRelatedToSmi: Yup.boolean().required('Required'),
  sector: Yup.string().required('Required'),
  yearFounded: Yup.string().nullable(),
});

export const modal = {
  RECOMMENDED_GROUP: 'GROUP_RECOMMENDED_GROUP',
};

export const CreateNewPageHooks = () => {
  const theme = useTheme();
  const route = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const { debtorId, processId } = useParams();
  const { control, handleSubmit: handleSubmitForm, formState: { isDirty, isValid }, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  // Dropdown data
  const { data: sectorDropdownList } = useGetParameterList('sector');
  // Group Type data
  const { data: groupTypeList } = useGetParameterList('groupType');

  //Save Customer Data
  const { isPending: isSaveLoading, mutate: saveDebitur } = useSaveDebitorGroup({
    onError: (data) => {
      const errorMessage = data.response.data.errorDetail;
      showNiceModal('error', errorMessage);
    },
    onSuccess: (data: BaseResponseGenericSingleDtoDebtorGroupDto) => {
      recordActivity({
        activity: ActivityType.CREATE,
        bucketProcessId: Array.isArray(processId) ? processId[0] : processId || '',
        changeAfter: JSON.stringify(data.data.content),
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully created new pipeline group',
      });

      showNiceModalV2({
        onClose: () => {
          route.replace(
            replacePath(pipeline.GROUP_DETAIL_PAGE, {
              debtorId,
              groupId: data.data.content.id,
              processId,
            })
          );
        }, title: 'Group Berhasil terbuat', type: 'success',
      });
    },
  });

  // Validate Group Name
  const { mutate: validateGroup } = useValidateGroupName({
    onError() {},
    onSuccess() {},
  });

  const handleSubmit = (data: any) => {
    const body = {
      bucketProcessId: Array.isArray(processId) ? processId[0] : processId,
      debtorId: Array.isArray(debtorId) ? debtorId[0] : debtorId,
      groupType: data.groupType,
      isRelatedSmi: data.isRelatedToSmi,
      module: 'PIPELINE',
      name: data.groupName,
      process: 'PIPELINE',
      sector: data.sector,
      yearFounded: dayjs(data.yearFounded).year().toString(),
    };

    validateGroup({ name: data.groupName }, {
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
          // Show recommended group modal
          NiceModal.show(modal.RECOMMENDED_GROUP, {
            ...resp.content,
            onCreateNew: () => saveDebitur(body),
            payload: body,
          });
        }
      },
    });
  };

  const handleShowRecommendedGroups = () => {
    const groupName = watch('groupName');

    NiceModal.show(modal.RECOMMENDED_GROUP, {
      groupName,
      onCreateNew: handleCreateNewGroup,
      onSelectGroup: handleSelectGroup,
    });
  };

  const handleSelectGroup = (selectedGroup: any) => {
    showNiceModalV2({
      onClose: () => {
        route.replace(
          replacePath(pipeline.GROUP_DETAIL_PAGE, {
            debtorId,
            groupId: selectedGroup.id,
            processId,
          })
        );
      },
      title: `Group "${selectedGroup.name}" has been selected`,
      type: 'success',
    });
  };

  const handleCreateNewGroup = () => {
    const formData = watch();
    handleSubmit(formData);
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
    handleCreateNewGroup,
    handleSelectGroup,
    handleShowRecommendedGroups,
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
