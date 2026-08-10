import { useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { maintenanceGroup } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllDebtor from '@/hooks/services/useGetAllDebtor';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetGroupById from '../../../hooks/useGetGroupById';
import useModifyGroupMember from '../../../hooks/useModifyGroupMember';
import { modal } from '../../Create.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalFormMember = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const modalId = modal.FORM_MEMBER_GROUP;
  const { groupId } = useParams<{ groupId: string }>();
  const isSubmission = groupId?.includes('MG');

  const [filter, setFilter] = useState('');
  const [selectedMember, setSelectedMember] = useState([]);
  const { visible } = useModal(modalId);

  const { data: debtorListData, isLoading } = useGetAllDebtor({
    filter: {
      status: ['APPROVED'],
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
    searchDetail: { key: 'md.debtor_name', value: filter },
  }, { enabled: filter?.length > 2 });

  const { data: debtorGroupDetail, isLoading: isLoadingGroupDetail } = useGetGroupById(
    {
      id: groupId,
    }
  );
  const bucketProcessId = debtorGroupDetail?.data?.content?.bucketProcessId;
  const groupCode = debtorGroupDetail?.data?.content?.groupCode;

  const { mutate: saveModifyMember, isPending: isSaveModifyMemberLoading } = useModifyGroupMember({
    onError: (e) => {
      showNiceModalV2({
        title: e.response?.data?.errorDetail ?? 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      showNiceModalV2({
        onClose: () => {
          if (!isSubmission) {
            router.push(replacePath(
              maintenanceGroup.DETAIL_PAGE, {
                groupId: data?.data?.content?.bucketProcessId,
              }
            ));
          }
          closeNiceModal(modalId);
          queryClient.invalidateQueries({
            queryKey: ['list-group-member-by-id',
              {
                filter: {
                  id: bucketProcessId,
                },
                page: {
                  itemPerPage: 10,
                  noPage: 1,
                },
              }
            ],
          });
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleDeleteDataGM = (data) => {
    setSelectedMember(selectedMember.filter((item) => item.debtorId !== data.debtorId));
  };

  const handleAddMember = () => {
    const listDebtorId = selectedMember?.map((val) => {
      return val?.debtorId;
    });
    saveModifyMember({
      bucketProcessId: bucketProcessId,
      debtorCode: listDebtorId,
      groupCode: groupCode,
    });
  };
  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          onClick: handleDeleteDataGM,
        }
      ],
      type: 'action',
    },
  ];

  const debtorAutoCompleteList = debtorListData?.data?.contents?.map((val) => {
    return {
      id: val?.debtorId,
      label: val?.debtorName,
    };
  });

  const mockTableData = [
    {
      name: 'Test Customer 1',
    },
    {
      name: 'Test Customer 2',
    },
    {
      name: 'Test Customer 3',
    }
  ];

  return {
    debtorAutoCompleteList,
    debtorListData,
    filter,
    handleAddMember,
    isLoading,
    mockTableData,
    modalId,
    selectedMember,
    setFilter,
    setSelectedMember,
    tableHeader,
    theme,
    visible,
  };
};

export default useModalFormMember;
