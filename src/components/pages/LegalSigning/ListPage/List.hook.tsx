import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { accessid, legalSigning } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';

import { TABLE_HEADER } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useListPage = () => {
  const router = useCustomRouter();
  const [filter, setFilter] = useSessionStorage('filter-component-legalsigning', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const path = usePathname();
  const pathModule = getLastPath(path);
  const canViewLegalSigning = useCheckAccess(accessid.LEGAL_SIGING_BUCKET_LIST_VIEW);

  /** Start Get Parameter */
  const { data: statusOptions } = useGetParameterList('filterStatusPKDHList', { label: 'value1', value: 'key' });
  const { data: searchByOptions } = useGetParameterList('searchByPKList', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByPKList', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  /** End Get Parameter */


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
      allowFutureDates: true,
      endKey: 'endDueDate',
      label: 'Due Date',
      startKey: 'startDueDate',
      type: 'period',
    },
    {
      endKey: 'endAging',
      label: 'Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    {
      key: 'division',
      label: 'Division',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];


  const { data, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.LEGAL_SIGNING,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });


  const processList = data?.contents?.map((process) => ({
    ...process,
    aging: process.aging ?? '-',
  }));
  const processPage = data?.page;


  const handleOpenModalStatusPk = (bucketId: string) => NiceModal.show(MODAL.STATUS_PK, {
    id: bucketId,
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.PROCESSING_TYPE_PK,
  });


  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ borderRadius: '12px', px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row?.statusLabel}
        </Button>
      ),
      sx: {
        minWidth: '17vw',
      },
    },
    {
      key: 'statusLabel',
      label: 'Status PK',
      render: (row) => (
        <Button
          sx={{ borderRadius: '7px', px: 3, py: 1.5 }}
          textVariant="button"
          startIcon="monitor"
          onClick={handleOpenModalStatusPk.bind(null, row?.bucketParentId)}
        >
          View Status PK
        </Button>
      ),
      sx: { minWidth: '17vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewLegalSigning ? [{
          iconName: 'detail', onClick: (row) => {
            router.push(
              replacePath(
                legalSigning.DEBTOR_INFORMATION_PAGE,
                {
                  module: pathModule,
                  processId: row.bucketProcessId,
                },
              ),
            );
          },
        }] : []),
      ],
      sx: {
        minWidth: '7vw',
        textAlign: 'center',
      },
      type: 'action',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    processList,
    processPage,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};
