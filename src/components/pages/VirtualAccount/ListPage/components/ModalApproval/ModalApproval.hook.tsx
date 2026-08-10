import { useState } from 'react';

import { virtualAccount } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime, toHourMinute, toDateString } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetMasterDivision from '@/hooks/services/useGetMasterDivision';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetBucketListStatus from '@/components/pages/UserManagement/UserList/hooks/useGetBucketListStatus';
import Button from '@/components/shared/Button';

import useGetDivisionList from '../../../hooks/useGetDivisionList';
import useGetGamList from '../../../hooks/useGetGamList';
import useGetParameterListVa from '../../../hooks/useGetParameterListVa';
import useGetSubmissionList from '../../../hooks/useGetSubmissionList';
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


  const { data: userManagementStatusOptions } = useGetParameterListVa('userManagementStatusFilter');
  const { data: searchByOptions } = useGetParameterListVa('searchByBucketVa');
  // const { data: sortByOptions } = useGetParameterListVa('sortByUserManagement',
  //  { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterListVa('sortByApprovalVA');
  // const { data: statusData } = useGetBucketListStatus({ module: modules, process: process });
  const { data: statusData } = useGetBucketListStatus({ module: TypeModule.VA_CREATION,
    process: TypeProcess.VA_CREATION });
  const statusByOptions = statusData?.map((item: any) => ({
    label: item.label,
    value: item.key,
  })) || [];

  // const { data: divisionData } = useGetMasterDivision();
  const { data: gamList } = useGetGamList();
  const gamListOptions = gamList?.map((item: any) => ({
    label: item.label,
    value: item.key,
  })) || [];
  // const divisionByOptions = divisionData?.map((item) => ({
  //   label: item.divisionName,
  //   value: item.code,
  // }));


  const { data: vaList, isFetching: isLoading } = useGetSubmissionList({
    filter: {
      ...filter?.filter,
      // status: filter?.filter?.status ? filter?.filter?.status?.map((value) => Number(value)) : [],
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tablePage = vaList?.page;


  const tableData = vaList?.contents.map((data) => ({
    ...data,
    cif: data.cif ?? '-',
    createdDate: data.createdDate ? `${formatDateTime(data.createdDate)}` : '-',
    customerId: data.customerId ?? '-',
    customerName: data.customerName ?? '-',
    gam: data.gam ?? '-',
    pic: data.pic ?? '-',
    requestDate: data.requestDate ? `${formatDateTime(data.requestDate)}` : '-',
    statusLabel: data.statusLabel ?? '-',

  }));
  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'statusLabel',
      label: 'Status',
      render: (row) => (
        <Button sx={{ px: 1, py: 1 }} variant="outlined">
          {row.statusLabel}
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
            const nextPath = replacePath(virtualAccount.VA_DETAIL_CUSTOMER,
              { processId: `${data?.customerId}~${data?.bucketProcessId ?? 'VA-ID'}` });
            const nextPathView = replacePath(virtualAccount.VA_DETAIL_CUSTOMER,
              { processId: `${data?.customerId}~${data?.bucketProcessId ?? 'VA-ID'}~VL` });
              // { processId: data.bucketProcessId });

            if (data.status === 'CANCELED' || data.status === 'REJECTED') {
              router.push(nextPathView);
            } else {
              router.push(nextPath);
            }
            closeNiceModal(modal.APPROVAL);
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
      key: 'gam',
      label: 'GAM',
      options: gamListOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
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

export default useModalApproval;
