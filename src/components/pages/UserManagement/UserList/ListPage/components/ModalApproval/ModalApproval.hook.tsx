import { useState } from 'react';

import { userManagement } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetMasterDivision from '@/hooks/services/useGetMasterDivision';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';

import useGetBucketListStatus from '../../../hooks/useGetBucketListStatus';
import useGetUserSubmissionList from '../../../hooks/useGetUserSubmissionList';
import { modal } from '../../List.constants';

import { tableHeaderList } from './ModalApproval.constants';

import type { ContentList } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalApproval = () => {
  const [noPage, setNoPage] = useState(0);
  const [itemPerPage, setItemPerPage] = useState(10);
  // const [filter, setFilter] = useSessionStorage('filter-um-approval-status', null);
  const [filter, setFilter] = useState(null);
  const router = useCustomRouter();
  const modules = TypeModule.USER_MANAGEMENT;
  const process = TypeProcess.USER_MANAGEMENT;


  const { data: userManagementStatusOptions } = useGetParameterList('userManagementStatusFilter');
  const { data: searchByOptions } = useGetParameterList('searchByUserApprovalList ');

  // const { data: sortByOptions } = useGetParameterList('sortByUserManagement', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByUserApprovalList');
  const { data: statusData } = useGetBucketListStatus({ module: modules, process: process });
  const statusByOptions = statusData?.map((item: any) => ({
    label: item.label,
    value: item.label,
  })) || [];

  const { data: divisionData } = useGetMasterDivision();

  const divisionByOptions = divisionData?.map((item) => ({
    label: item.divisionName,
    value: item.code,
  }));


  const { data: userApplicationListData, isLoading } = useGetUserSubmissionList({
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
    division: data.divisionName ? data.divisionName : '-',
    email: data.email ?? '-',
    name: data.fullName ?? '-',
    processId: data.bucketProcessId ?? '-',
    reason: data.reason ?? '-',
    testingTime: data.createdDate ? formatDate(new Date(data.createdDate)) : '-',
    userId: data.userId ?? '-',
  }));

  const tablePage = userApplicationListData?.page;
  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button sx={{ px: 1, py: 0.5 }} variant="outlined">
          {row.status}
        </Button>
      ),
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(userManagement.USER_LIST.DETAIL, { id: data.processId });
            router.push(nextPath);
            closeNiceModal(modal.APPROVAL_MODAL);
          },
        },
      ],
      sx: {
        minWidth: '4vw',
      },
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
      endKey: 'endDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionByOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'User Status',
      options: statusByOptions, type: 'multiple-autocomplete',
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

export default useModalApproval;
