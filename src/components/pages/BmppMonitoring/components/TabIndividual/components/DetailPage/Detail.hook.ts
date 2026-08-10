'use client';

import { useEffect, useMemo, useState } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { bmppMonitoring } from '@/configs/constants/pathname';
import { formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useBmppMonitoringContext } from '@/components/layouts/BmppMonitoringLayout/BmppMonitoring.context';

import { mockDataTableDetail } from '../../__mock_data__';

import { tableHeaderList } from './Detail.constants';
import useGetIndividualDetail from './hooks/useGetIndividualDetail';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useDetailPage = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const path = usePathname();
  const pathName = path.split('/');
  const debtorId = pathName[2];
  const { handleSetBreadcrumb } = useBmppMonitoringContext();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-detail-bmppmonitoring-individual', null);
  sessionStorage.setItem('bmppGroupData', null);

  const searchByOptions = useGetParameterList('searchByIndividualMonitoring2', { label: 'value1', value: 'value2' });
  const sortByOptions = useGetParameterList('sortByIndividualMonitoring2', { label: 'value1', value: 'value2' });

  useEffect(() => {
    handleSetBreadcrumb([
      { label: debtorId, url: bmppMonitoring.INDIVIDUAL_DETAIL_PAGE.replaceAll('[id]', debtorId) }
    ]);
  }, []);

  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: debtorId });

  const { data: individualDetailListData, isLoading } = useGetIndividualDetail({
    filter: {
      ...filter?.filter,
      debtorId: debtorId,
      lastResult: filter?.filter?.lastResult === 'yes' ? true : filter?.filter?.lastResult === 'no' ? false : null,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableData = individualDetailListData?.contents?.map((item) => ({
    ...item,
    lastModified: item?.lastModified ? formatDateTime(new Date(item?.lastModified)) : '-',
  }));
  const totalData = individualDetailListData?.page;
  const lastUpdateDate = individualDetailListData?.additionalData?.lastUpdate;

  const dataAsOfDate = useMemo(() => {
    return lastUpdateDate ? `${formatDateTime(new Date(lastUpdateDate), 'DD MMM YYYY, [Pukul] HH:mm:ss')}` : '-';
  }, [lastUpdateDate]);

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => {handleViewDetail(row);},
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    }
  ];

  const handleViewDetail = (data: any) => {
    router.push(
      replacePath(
        bmppMonitoring.INDIVIDUAL_CALCULATION_PAGE,
        {
          calculationId: data?.calculationId,
          id: debtorId,
        }
      )
    );
  };

  const filterDropdownList = searchByOptions.data;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions.data,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Data as of',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'lastResult',
      label: 'Melampaui BMPK/BMPD/BMPP Individual',
      options: [
        { label: 'Ya', value: 'yes' },
        { label: 'Tidak', value: 'no' }
      ],
      type: 'dropdown',
    },
  ];

  return {
    dataAsOfDate,
    debtorData,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    theme,
    totalData,
  };
};

export default useDetailPage;
