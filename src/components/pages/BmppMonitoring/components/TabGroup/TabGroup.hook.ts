import { useMemo, useState } from 'react';

import { useTheme } from '@mui/material';

import { bmppMonitoring } from '@/configs/constants/pathname';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetMaintenanceGroupData
  from '@/components/pages/MaintenanceData/MaintenanceGroup/hooks/useGetMaintenanceGroupData';

import { mockDataTable } from './__mock_data__';
import { tableHeaderList } from './TabGroup.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTabGroup = () => {
  const theme = useTheme();
  const router = useCustomRouter();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-bmppmonitoring-tab-group', null);

  const searchByOptions = useGetParameterList('searchByGroupMonitoring', { label: 'value1', value: 'value2' });
  const sortByOptions = useGetParameterList('sortByGroupMonitoring', { label: 'value1', value: 'value2' });
  const filterGroupTypeOptions = useGetParameterList('groupType', { label: 'value1', value: 'key' });

  const { data: groupListData, isLoading } = useGetMaintenanceGroupData({
    filter: {
      ...filter?.filter,
      isRelatedSmi: filter?.filter?.isRelatedSmi === 'yes' ? true : filter?.filter?.isRelatedSmi === 'no' ? false : null,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableData = groupListData?.data?.contents.map((item) => ({
    ...item,
    isRelatedSmi: (item.isRelatedSmi === undefined || item.isRelatedSmi === null) ? '-' : item.isRelatedSmi ? 'Ya' : 'Tidak',
  }));

  const pageData = groupListData?.data?.page;
  const lastUpdateDate = groupListData?.data?.additionalData?.lastUpdate;

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
        bmppMonitoring.GROUP_DETAIL_PAGE,
        {
          id: data?.groupCode,
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
      key: 'groupType',
      label: 'Jenis Group',
      options: filterGroupTypeOptions.data,
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
  ];

  return {
    dataAsOfDateBmpp,
    filter,
    filterContentList,
    filterDropdownList,
    page,
    pageData,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    theme,
  };
};

export default useTabGroup;
