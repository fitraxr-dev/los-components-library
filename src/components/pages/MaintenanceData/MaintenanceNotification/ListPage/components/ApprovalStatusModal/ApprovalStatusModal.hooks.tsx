import { useState } from 'react';

import dayjs from 'dayjs';

import { roles } from '@/configs/constants';
import { maintenanceNotification } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';


import useGetNotificationSubmission from '../../hooks/useGetNotificationSubmission';
import { modal } from '../../MaintenanceNotification.constant';

import { TABLE_HEADER } from './ApprovalStatusModal.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalStatusModal = () => {
  const router = useCustomRouter();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filter, setFilter] = useState<SearchValue>(null);

  // cek role
  const [state] = useApp();
  const userId = state.userData?.user?.userId || '';
  const username = state.userData?.user?.fullName || '';

  const isMAKER = state.currentRole.includes(roles.MAKER);
  const isCHECKER = state.currentRole.includes(roles.CHECKER);

  const { data: searchByOptions } = useGetParameterList('searchByNotificationApprovalStatus');
  const { data: sortByOptions } = useGetParameterList('sortByNotificationApprovalStatus');
  const { data: statusOptions } = useGetParameterList('notificationStatus');

  const defaultStatuses = (() => {
    if (isMAKER) return ['MAINTENANCE_DATA', 'RETURN_TO_MAKER'];
    if (isCHECKER) return ['WAITING_APPROVAL_CHECKER'];
    return [];
  })();

  const { data: submissionData, isFetching: isLoading } = useGetNotificationSubmission({
    filter: {
      ...filter?.filter,
      status: filter?.filter?.status ?? defaultStatuses,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail
      ? {
        ...filter.searchDetail,
        value:
          filter.searchDetail.key === 'status'
            ? filter.searchDetail.value.replace(/\s+/g, '_')
            : filter.searchDetail.value,
      }
      : { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  dayjs.locale('id');
  const totalPage = submissionData?.page?.totalPage;
  const tableData = submissionData?.contents?.map((item) => ({
    ...item,
    createdDate: item.createdDate
      ? dayjs(item.createdDate).format('D MMMM YYYY, HH:mm:ss')
      : '-',
    messageSubject: item.messageSubject || '-',
    status: item.status ? item.status.replace(/_/g, ' ') : '-',
    templateType: item.templateType || '-',
  }));

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            closeNiceModal(modal.APPROVAL_STATUS_MODAL);

            // console.log('--- created by: ', data?.createdBy);
            // console.log('--- userId: ', userId);
            // console.log('--- username: ', username);

            let nextPath: string | null = null;

            if (isMAKER && data?.createdBy === userId) {
              if (data?.status === 'MAINTENANCE DATA') {
                nextPath = replacePath(
                  `${maintenanceNotification.DETAIL_PAGE}?action=edit&flow=maintenance-data`,
                  { id: data?.bucketProcessId }
                );
              } else if (data?.status === 'RETURN TO MAKER') {
                // decline, save, submit
                nextPath = replacePath(
                  `${maintenanceNotification.DETAIL_PAGE}?action=edit&flow=return-maker`,
                  { id: data?.bucketProcessId }
                );
              }
            }

            if (!nextPath) {
              if (isCHECKER && data?.status === 'WAITING APPROVAL CHECKER') {
                // approve, return to maker, decline (jika decline ada pop up comment pilihan canceled/rejected)
                nextPath = replacePath(
                  `${maintenanceNotification.DETAIL_PAGE}?action=edit&flow=waiting-approval`,
                  { id: data?.bucketProcessId }
                );
              } else {
                nextPath = replacePath(
                  `${maintenanceNotification.DETAIL_PAGE}?action=detail-from-approval`,
                  { id: data?.bucketProcessId }
                );
              }
            }

            if (nextPath) {
              router.push(nextPath);
            }
          },
        }
      ],
      sx: { minWidth: '5vw' },
      type: 'action',
    }
  ];

  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endModifiedDate',
      label: 'Modified Date',
      startKey: 'startModifiedDate',
      type: 'period',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'isActive',
      label: 'Active',
      options: [
        { label: 'Ya', value: true },
        { label: 'Tidak', value: false }
      ],
      type: 'single-select',
    },
  ];


  return {
    filter,
    filterContentList,
    filterDropdownList: searchByOptions,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  };
};

export default useApprovalStatusModal;
