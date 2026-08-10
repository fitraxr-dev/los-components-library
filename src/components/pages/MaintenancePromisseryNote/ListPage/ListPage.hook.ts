import { useContext, useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { maintenanceSuratHutang } from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import { MaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import useGetListDebtSecurities from '../hooks/useGetListDebtSecurities';

import { TABLE_HEADER } from './ListPage.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useListPage = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-component-promisery', null);
  const path = usePathname();
  const pathModule = getLastPath(path);

  const [state, setState] = useContext(MaintenanceDataContext);

  const { data, isLoading } = useGetListDebtSecurities({
    filter: {
      ...filter?.filter,
      debtorName: '',
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const processPage = data?.page;

  useEffect(() => {
    setPage(1);
  }, [filter]);

  /** Start Get Parameter List */
  const { data: statusOptions } = useGetParameterList('filterStatusLPSBList');
  const { data: searchByOptions } = useGetParameterList('searchByLPSBMonitoringList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByLPSBMonitoringList', {
    label: 'value1',
    value: 'value2',
  });
  /** End Get Parameter List */

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            router.push(
              replacePath(
                maintenanceSuratHutang.DETAIL_PAGE,
                {
                  processId: data.id,
                },
              ),
            );
          },
        }
      ],
      sx: { minWidth: '5vw' },
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
      key: 'createdDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];


  const showModal = () => {
    NiceModal.show('surat-hutang-debtor', { setState, state });
  };


  return {
    data,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    processPage,
    setFilter,
    setPage,
    setPageSize,
    showModal,
    tableHeader,
    theme,
  };
};


export default useListPage;
