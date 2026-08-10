'use client';


import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useGetGroupDetail from '../hooks/useGetGroupDetail';
import useGetDebtorGroupMember from '../hooks/useGetMemberDebtorGroup';
import useRemoveGroupMember from '../hooks/useRemoveGroupMember';

import { modal, tableHeaderList } from './Detail.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { DebtorDetailResponseDto } from '@/services/openapi/master-service';


export const useDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { debtorId } = useIdentity();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);


  const popUpGroupMemberHandler = (title: string, type: 'edit' | 'new', data?: DebtorDetailResponseDto) => {
    NiceModal.show(modal.FORM_MEMBER_GROUP, {
      data,
      debtorId,
      groupId,
      title,
      type,
    });
  };


  const handleViewDetailGroupModal = () => {
    NiceModal.show(modal.VIEW_DETAIL_GROUP_MODAL);
  };

  // Get Group Detail
  const { data: debtorGroupDetail, isLoading: isLoadingGroupDetail } = useGetGroupDetail(
    {
      debtorId: debtorId,
      groupId: groupId,
    },
  );

  // Get Member Customer Group
  const { data: debtorGroupMember, isLoading: isLoadingGroupMember } = useGetDebtorGroupMember(
    {
      filter: {
        groupId: groupId,
      },
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
    },
  );

  const { mutate: removeGroupMember, isPending: isRemoveGroupMemberLoading } = useRemoveGroupMember({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil di hapus',
        type: 'success',
      });
    },
  });

  const handleDeleteGroup = () => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => { },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
  };

  const handleDeleteDataGM = (props) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        removeGroupMember({ debtorId: props.debtorId, groupId });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
  };

  const handleDecline = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        const bucketAction = radioValue === 1 || radioValue === '1' ? 'CANCELED' : 'REJECTED';
        closeNiceModal(MODAL.GLOBAL.COMMENT);

        showNiceModalV2({
          title: `Group berhasil ${bucketAction === 'CANCELED' ? 'dicancel' : 'direject'}`,
          type: 'success',
        });
      },
      radioLabel: 'Declined',
      radioOptions: [
        { label: 'Canceled', value: '1' },
        { label: 'Rejected', value: '2' }
      ],
    });
  };

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: () => {
            handleViewDetailGroupModal();
          },
        },
        {
          iconName: 'edit',
          onClick: (props) => {
            popUpGroupMemberHandler('Edit Group Member', 'edit', props);
          },
        },
        {
          iconName: 'delete',
          isDisabled: isRemoveGroupMemberLoading,
          onClick: (props) => {
            handleDeleteDataGM(props);
          },
        }
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    }
  ];

  return {
    debtorGroupDetail,
    debtorGroupMember,
    handleDecline,
    handleDeleteGroup,
    isLoadingGroupMember,
    page,
    popUpGroupMemberHandler,
    setPage,
    setPageSize,
    tableHeader,
  };
};
