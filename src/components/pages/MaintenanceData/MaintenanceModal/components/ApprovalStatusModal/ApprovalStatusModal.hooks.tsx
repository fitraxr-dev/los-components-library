import { useEffect, useState } from 'react';

import { maintenanceModal } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';


import useGetApprovalStatusList from '../../hooks/useGetApprovalStatusList';

import { MODAL, TABLE_HEADER } from './ApprovalStatusModal.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalStatusModal = () => {
  const modalId = MODAL.APPROVAL_MODAL;
  const [contentList, setContentList] = useState([]);
  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const router = useCustomRouter();

  const payload = {
    filter: {
      capitalPositionDateEnd: filter?.filter?.capitalPositionDateEnd || '',
      capitalPositionDateStart: filter?.filter?.capitalPositionDateStart || '',
      createdDateEnd: filter?.filter?.createdDateEnd || '',
      createdDateStart: filter?.filter?.createdDateStart || '',
      statusModals: filter?.filter?.statusModals || [],
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  };


  const { data: approvalList, isFetching: isLoading } = useGetApprovalStatusList(payload as any);

  const approvalPage = approvalList?.page;
  const approvalListData = approvalList?.contents?.map((item) => ({
    ...item,
    bucketProcessId: item.bucketProcessId ?? '-',
  }));

  useEffect(() => {
    setContentList(approvalListData);
  }, [approvalList]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  // --- PARAMETER ---
  // Dropdown data
  const { data: searchByOptions } = useGetParameterList('searchByMaintenanceModal');
  const { data: statusMaintenanceModal = []} = useGetParameterList('statusMaintenanceModal');
  const { data: sortByMaintenanceModal = []} = useGetParameterList('sortByMaintenanceModal');

  const filterDropdownListApproval = searchByOptions;

  const filterContentListApproval = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByMaintenanceModal,
      type: 'sort',
    },
    {
      endKey: 'capitalPositionDateEnd',
      label: 'Tanggal Posisi Modal',
      startKey: 'capitalPositionDateStart',
      type: 'period',
    },
    {
      endKey: 'createdDateEnd',
      label: 'Request Date',
      startKey: 'createdDateStart',
      type: 'period',
    },
    {
      key: 'statusModals',
      label: 'Status Maintenance Modal',
      options: statusMaintenanceModal,
      type: 'multiple-autocomplete',
    },
  ];

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          noClick
        >
          {row?.status ?? '-'}
        </Button >
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            closeNiceModal(modalId);
            router.push(
              replacePath(
                maintenanceModal.MAINTENANCE_MODAL_PAGE,
                {
                  processId: data?.bucketProcessId,
                }
              )
            );
          },
        }
      ],
      type: 'action',
    }
  ];

  return {
    approvalPage,
    contentList,
    filter,
    filterContentListApproval,
    filterDropdownListApproval,
    isLoading,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useApprovalStatusModal;
