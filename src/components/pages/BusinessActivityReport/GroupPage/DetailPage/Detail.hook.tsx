import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';

import showNiceModal from '@/helpers/showNiceModal';
import useViewOnly from '@/hooks/useViewOnly';

import useBarInformation from '../../InformationPage/Information.hook';
import useGetDebtorGroupByIdV2 from '../hooks/Group/useGetDebtorGroupByIdV2';
import useDeleteGroupMemberV2 from '../hooks/Member/useDeleteGroupMemberV2';
import useGetDebtorGroupMemberV2 from '../hooks/Member/useGetDebtorGroupMemberV2';

import { TABLE_HEADER_MEMBER, modal } from './Detail.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { DebtorDetailResponseDto } from '@/services/openapi/loan-service';


export const DetailPageHook = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const { groupId } = useParams<{ groupId: string }>();
  const { debtorId }: {debtorId: string} = useParams();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const { isBarCreation } = useBarInformation();

  //Get Customer Group Detail
  const {
    data: groupDetail,
    isPending: groupDetailIsLoading,
  } = useGetDebtorGroupByIdV2({ debtorId: debtorId, groupCode: groupId });

  const isJoined = useMemo(() => {
    return groupDetail?.isGroupJoined ?? false;
  }, [groupDetail]);

  //Get Group Member
  const {
    data: groupMember,
    isPending: groupMemberIsLoading,
    isLoading: groupMemberLoading,
  } = useGetDebtorGroupMemberV2({ filter: { groupCode: groupId }, page: { itemPerPage, noPage } });


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
        value: groupDetail?.yearFounded ? dayjs(groupDetail?.yearFounded).year() : '-',
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


  const popupGroupMemberHandler = (title: string, type: 'edit' | 'new', data?: DebtorDetailResponseDto) => {
    NiceModal.show(
      modal.FORM_MEMBER_GROUP,
      {
        data,
        debtorId,
        groupId,
        isBarCreation,
        title,
        type,
      },
    );
  };

  // Delete Member Data
  const { isPending: isDeleteLoading, mutate: deleteMember } = useDeleteGroupMemberV2({
    onSuccess: () => { showNiceModal('success', 'Data berhasil dihapus'); },
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
          iconName: 'edit',
          isDisabled: (data: any) => data.debtorCode !== debtorId || isDeleteLoading,
          isHidden: !isBarCreation,
          onClick: (props) => popupGroupMemberHandler('Edit Group Member', 'edit', props),
        },
        {
          iconName: 'delete',
          isDisabled: (data: any) => data.debtorCode !== debtorId || isDeleteLoading,
          isHidden: !isBarCreation,
          onClick: (props) => handleDeleteData(props),
        },
        {
          iconName: 'detail',
          isDisabled: (data: any) => data.debtorCode !== debtorId || isDeleteLoading,
          isHidden: isBarCreation,
          onClick: (props) => popupGroupMemberHandler('Detail Group Member', 'edit', props),
        },
      ],
      type: 'action',
    },
  ];

  return {
    cellData,
    groupDetail,
    groupMember,
    groupMemberIsLoading,
    groupMemberLoading,
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
