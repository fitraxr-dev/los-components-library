import { useMemo, useState } from 'react';

import { useTheme } from '@mui/material';

import { bmppMonitoring } from '@/configs/constants/pathname';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import { mockDataTable } from './__mock_data__';
import useGetIndividualList from './hooks/useGetIndividualList';
import { tableHeaderList } from './TabIndividual.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTabIndividual = () => {
  const theme = useTheme();
  const router = useCustomRouter();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-bmppmonitoring-tab-individual', null);

  const searchByOptions = useGetParameterList('searchByIndividualMonitoring', { label: 'value1', value: 'value2' });
  const sortByOptions = useGetParameterList('sortByIndividualMonitoring', { label: 'value1', value: 'value2' });
  const debtorTypeOptions = useGetParameterList('debtorType', { label: 'value1', value: 'key' });

  const { data: gamOptions } = useGetAllGam(
    { value: '' },
    { division: 'divisionShort', label: 'fullName', value: 'userId' });

  const gamListData = gamOptions?.map((gam) => ({
    label: `${gam?.division ? gam?.division : ''} - ${gam?.label}`,
    value: gam?.value,
  }));

  const { data: individualListData, isLoading } = useGetIndividualList({
    filter: {
      ...filter?.filter,
      isRelatedSmi: filter?.filter?.isRelatedSmi === 'yes' ? true : filter?.filter?.isRelatedSmi === 'no' ? false : null,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: (!!filter?.searchDetail?.key && !!filter?.searchDetail?.value) ? filter?.searchDetail : { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const lastUpdateDate = individualListData?.additionalData?.lastUpdate;
  const totalData = individualListData?.page;
  const tableData = individualListData?.contents?.map((item) => ({
    ...item,
    cif: item.cif ?? '-',
    isRelatedSmi: item.isRelatedSmi === true ? 'Ya' : item.isRelatedSmi === false ? 'Tidak' : '-',
  }));

  const dataAsOfDateBmpp = useMemo(() => {
    return `${formatDate(new Date(), 'DD MMM YYYY, [Pukul] HH:mm:ss')}`;
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

  const handleViewDetail = (data) => {
    router.push(
      replacePath(
        bmppMonitoring.INDIVIDUAL_DETAIL_PAGE,
        {
          id: data?.debtorId,
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
      key: 'debtorType',
      label: 'Jenis Customer',
      options: debtorTypeOptions.data,
      type: 'multiple-autocomplete',
    },
    {
      key: 'isRelatedSmi',
      label: 'Terkait SMI',
      options: [
        { label: 'Ya', value: 'yes' },
        { label: 'Tidak', value: 'no' }
      ],
      type: 'dropdown',
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      options: gamListData,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    dataAsOfDateBmpp,
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

export default useTabIndividual;
