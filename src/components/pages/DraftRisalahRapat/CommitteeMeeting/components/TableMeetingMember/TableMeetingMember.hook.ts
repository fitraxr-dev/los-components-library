import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { MODAL_ID } from '../../CommitteeMeeting.constant';
import useDeleteMeetingMember from '../../hooks/useDeleteMeetingMember';
import useGetMeetingMemberList from '../../hooks/useGetMeetingMemberList';

import { TABLE_HEADER } from './TableMeetingMember.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableMeetingMember = () => {
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const { data: meetingMemberListData, isLoading, isFetching } = useGetMeetingMemberList({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  });

  const { mutate: deleteGroupMember } = useDeleteMeetingMember({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan dicoba kembali',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: JSON.stringify(data),
        menuCode: 'risalah-rapat',
        module: TypeModule.RISALAH_RAPAT,
        process: TypeProcess.RISALAH_RAPAT,
        remarks: 'Successfully Deleted Risalah Rapat Committe Meeting Member',
      });

      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({ title: 'Data Berhasil Di hapus', type: 'success' });
    },
  });

  const handleOpenMemberModal = React.useCallback((id: string, status: string) => {
    NiceModal.show(MODAL_ID.MODAL_MEMBER, { id, status });
  }, []);

  const handleDeleteMeetingMember = React.useCallback((id: number) => {
    showNiceModalV2({
      onSubmit: () => deleteGroupMember({
        bucketProcessId: processId,
        id,
      }),
      title: 'Apakah anda yakin menghapus anggota rapat ini?',
      type: 'warning',
    });
  }, [deleteGroupMember, processId]);

  const tableHeader: TableHeader[] = React.useMemo(() => {
    return [
      ...TABLE_HEADER,
      {
        key: 'action',
        label: 'Action',
        options: [
          {
            iconName: 'detail',
            onClick: (row) => handleOpenMemberModal(row.id, 'detail'),
          },
          ...(!viewOnly ? [
            {
              iconName: 'edit',
              isDisabled: viewOnly,
              onClick: (row) => handleOpenMemberModal(row.id, 'edit'),
            },
            {
              iconName: 'delete',
              isDisabled: viewOnly,
              onClick: (row) => handleDeleteMeetingMember(row.id),
            },
          ] : [])
        ],
        type: 'action',
      },
    ];
  }, [viewOnly, handleOpenMemberModal, handleDeleteMeetingMember]);

  return {
    handleOpenMemberModal,
    isLoading: isLoading || isFetching,
    tableData: meetingMemberListData?.contents,
    tableHeader,
  };
};

export default useTableMeetingMember;
