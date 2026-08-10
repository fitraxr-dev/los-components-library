'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';

// import useGetMaintenanceList from '../hooks/useGetMaintenanceData';

import { TABLE_HEADER, modal } from './List.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const { setDebtorId, setProcessId } = useIdentity();
  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // --- PARAMETER ---
  // Get MIP status filter options
  const { data: mipStatusOptions } = useGetParameterList(pathname === '/mip' ? 'mipStatusFilter' : 'analystStatusFilter');

  // Get MIP search by options
  const { data: searchByOptions } = useGetParameterList('searchByMip');

  // Get MIP sort by options
  const { data: sortByOptions } = useGetParameterList('sortByMip');
  // --- END OF PARAMETER ---

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    setDebtorId(null);
    setProcessId(null);
  }, []);

  const handleApprovalModal = () => {
    NiceModal.show(modal.APPROVAL_MASTER_MODAL);
  };

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            setDebtorId(data.debtorId);
            router.push(
              replacePath(
                maintenanceDebtor.MASTER_DETAIL_PAGE,
                {
                  debtorId: data.debtorId,
                },
              ),
            );
          },
        },
      ],
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
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
      key: 'status',
      label: 'Status',
      options: mipStatusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    data: { contents: [], page: { totalPage: 1 } }, //dummy
    filterContentList,
    filterDropdownList,
    handleApprovalModal,
    isLoading: false, //dummy
    page,
    pageSize,
    pathname,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};
