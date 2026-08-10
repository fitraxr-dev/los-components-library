import { useEffect, useMemo, useState } from 'react';

import { userManagement } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';

import useGetBucketListStatus from '../../../../UserList/hooks/useGetBucketListStatus';
import useGetApprovalList from '../../../hooks/useGetApprovalList';
import { modal } from '../../List.constants';

import { tableHeaderList } from './ApprovalModal.constants';

import type { ContentList } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalModal = () => {
  const router = useCustomRouter();
  const [noPage, setNoPage] = useState(0);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useState(null);
  const modules = TypeModule.USER_MANAGEMENT;
  const process = TypeProcess.USER_MANAGEMENT;

  // const { data: searchByOptions } = useGetParameterList('searchByAccessMenuDraft');
  const { data: searchByOptions } = useGetParameterList('searchByAccessMenuDraft');
  const { data: sortByOptions } = useGetParameterList('sortByAccessMenuDraft');
  const { data: statusData } = useGetBucketListStatus({ module: modules, process: process });

  const statusByOptions = statusData?.map((item: any) => ({
    label: item.label,
    value: item.label,
  })) || [];

  const { data: userApplicationListData, isLoading } = useGetApprovalList({
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });


  const tableData = userApplicationListData?.contents?.map((data) => ({
    ...data,
    accessMenuName: data.menuAccessName ?? '-',
    modifiedBy: data.lastUpdatedBy ?? '-',
    modifiedDate: data.lastUpdatedDate ? formatDate(new Date(data.lastUpdatedDate)) : '-',
    processId: data.bucketProcessId ?? '-',
  }));

  // const tableData = useMemo(() => {
  //   return data?.contents?.map((item) => ({
  //     ...item,
  //     accessMenuName: item.menuAccessName ?? '-',
  //     modifiedBy: item.lastUpdatedBy ?? '-',
  //     modifiedDate: item.lastUpdatedDate ? formatDate(new Date(item.lastUpdatedDate)) : '-',
  //     processId: item.bucketProcessId ?? '-',
  //   }));
  // }, [data]);

  const tablePage = userApplicationListData?.page;
  console.log('Table Page Data:', tablePage);
  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button variant="outlined" sx={{ px: 1, py: 0.5 }} textVariant="body4">
          {row.status}
        </Button>
      ),
      sx: {
        minWidth: '8vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(userManagement.ACCESS_MENU.DETAIL, { id: data.bucketProcessId });
            router.push(nextPath);
            closeNiceModal(modal.APPROVAL_MODAL);
          },
        },
      ],
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endLastUpdatedDate',
      label: 'Periode Waktu Pengajuan',
      startKey: 'startLastUpdatedDate',
      type: 'period',
    },
    {
      key: 'status',
      label: 'User Status',
      options: statusByOptions,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};

export default useApprovalModal;
