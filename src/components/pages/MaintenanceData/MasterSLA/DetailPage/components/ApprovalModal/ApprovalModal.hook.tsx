import { useState } from 'react';

import useGetApprovalList from '@/components/pages/UserManagement/AccessMenu/hooks/useGetApprovalList';
import Button from '@/components/shared/Button';


import { HEADER_TABLE } from './ApprovalModal.constants';

import type { SearchValue } from '@/components/shared/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalModal = (modalId: string) => {
  const [contentList, setContentList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filter, setFilter] = useState<SearchValue>({});

  const { data, isLoading } = useGetApprovalList({
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: { key: 'roleRefactorCode', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableHeader: TableHeader[] = [
    ...HEADER_TABLE,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button variant="outlined" sx={{ px: 1, py: 0.5 }} textVariant="body4">
          {row.STATUS}
        </Button>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
          },
        },
      ],
      type: 'action',
    },
  ];

  return {
    contentList,
    data,
    isLoading,
    page,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useApprovalModal;
