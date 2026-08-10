import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDebtorGroupById from '../hooks/Group/useGetDebtorGroupById';
import useDeleteGroupMember from '../hooks/Member/useDeleteGroupMember';
import useGetDebtorGroupMember from '../hooks/Member/useGetDebtorGroupMember';

import { TABLE_HEADER_MEMBER, modal } from './Detail.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { DebtorDetailResponseDto } from '@/services/openapi/loan-service';


export const DetailPageHook = () => {
  const [{ currentRole }] = useApp();
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const { groupId } = useParams<{ groupId: string }>();
  const { debtorId, processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  // Current User Role
  const isKadiv = currentRole.includes('KADIV');

  //Get Customer Group Detail
  const {
    data: groupDetail,
    isPending: groupDetailIsLoading,
  } = useGetDebtorGroupById({ debtorId: debtorId, groupCode: groupId });

  const isJoined = useMemo(() => {
    return groupDetail?.isGroupJoined ?? false;
  }, [groupDetail]);

  //Get Group Member
  const {
    data: groupMember,
    isLoading: groupMemberIsLoading,
  } = useGetDebtorGroupMember({ filter: { debtorId, groupCode: groupId }, page: { itemPerPage, noPage } });

  // Record activity when group detail and members are loaded
  useEffect(() => {
    if (groupDetail && groupMember) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view pipeline group detail and members',
      });
    }
  }, [groupDetail, groupMember, processId, recordActivity]);

  const [cellData, setCellData] = useState([{
    title: 'Id Group',
    value: null,
  },
  {
    title: 'Sektor Industri',
    value: null,
  },
  {
    title: 'Nama Group',
    value: null,
  },
  {
    title: 'Tahun Didirikan',
    value: null,
  },
  {
    title: 'Jenis Group Customer',
    value: null,
  },
  {
    title: 'Terkait dengan SMI',
    value: null,
  }]);

  useEffect(() => {
    setCellData([
      {
        title: 'Id Group',
        value: groupDetail?.id,
      },
      {
        title: 'Sektor Industri',
        value: groupDetail?.sectorLabel,
      },
      {
        title: 'Nama Group',
        value: groupDetail?.name,
      },
      {
        title: 'Tahun Didirikan',
        value: dayjs(groupDetail?.yearFounded).year(),
      },
      {
        title: 'Jenis Group Customer',
        value: groupDetail?.groupTypeLabel,
      },
      {
        title: 'Terkait dengan SMI',
        value: groupDetail?.isRelatedSmi ? 'Ya' : 'Tidak',
      }
    ]);
  }, [groupDetail, groupDetailIsLoading]);


  const popupGroupMemberHandler = (title: string, type: 'edit' | 'new' | 'detail', data?: DebtorDetailResponseDto) => {
    NiceModal.show(
      modal.FORM_MEMBER_GROUP,
      {
        data,
        debtorId,
        groupId,
        title,
        type,
      },
    );
  };

  // Delete Member Data
  const { isPending: isDeleteLoading, mutate: deleteMember } = useDeleteGroupMember({
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          debtorId,
          groupCode: groupId,
          groupName: groupDetail?.name,
        }),
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully deleted group member',
      });

      showNiceModal('success', 'Data berhasil dihapus');
    },
  });

  const handleDeleteData = async (props) => {
    showNiceModal('confirm', 'Apakah anda yakin ingin menghapus data?',
      () => deleteMember({ debtorId: debtorId, groupCode: groupId })
      , 'Tidak', 'Ya');
  };

  const tableHeaderMember: TableHeader[] = [
    ...TABLE_HEADER_MEMBER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          isDisabled: () => false,
          onClick: (props) => popupGroupMemberHandler('Detail Group Member', 'detail', props),
        },
        {
          iconName: 'edit',
          isDisabled: (data: any) => data.debtorCode !== debtorId || isDeleteLoading || isKadiv || viewOnly,
          onClick: (props) => popupGroupMemberHandler('Edit Group Member', 'edit', props),
        },
        {
          iconName: 'delete',
          isDisabled: (data: any) => data.debtorCode !== debtorId || isDeleteLoading || isKadiv || viewOnly,
          onClick: (props) => handleDeleteData(props),
        },
      ],
      sx: { width: '7.5vw' },
      type: 'action',
    },
  ];


  return {
    cellData,
    groupDetail,
    groupMember,
    groupMemberIsLoading,
    isJoined,
    noPage,
    popupGroupMemberHandler,
    setItemPerPage,
    setNoPage,
    tableHeaderMember,
    theme,
    viewOnly,
  };
};
