import { useState, useMemo } from 'react';

import useSessionStorage from '@/hooks/useSessionStorage';

import useGetCustomerCheckList from '../../hooks/useGetCustomerCheckList';
import useGetLovCategory from '../../hooks/useGetLovCategory';
import useGetLovProfile from '../../hooks/useGetLovProfile';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalCustomerCheck = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filter, setFilter] = useSessionStorage(
    'filter-customer-check-upload-database-dk',
    {} as SearchValue
  );

  const { data: categoryOptions } = useGetLovCategory();
  const { data: profileOptions } = useGetLovProfile();

  const buildPayload = useMemo(() => {
    const payload: any = {
      filter: null,
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      searchDetail: null,
      sortList: null,
    };

    if (filter?.filter) {
      const filterObj: any = {};

      if (filter.filter.profil) {
        filterObj.profile = filter.filter.profil as string;
      }

      if (filter.filter.watchlist) {
        filterObj.category = filter.filter.watchlist as string;
      }

      if (Object.keys(filterObj).length > 0) {
        payload.filter = filterObj;
      }
    }

    if (filter?.searchDetail?.value) {
      payload.searchDetail = {
        key: filter.searchDetail.key || 'name',
        value: filter.searchDetail.value,
      };
    }

    if (filter?.sortList?.columnName) {
      payload.sortList = {
        columnName: filter.sortList.columnName,
        sortType: filter.sortList.sortType || 'ASC',
      };
    }

    return payload;
  }, [filter, page, pageSize]);

  const { data: tableData, isLoading } = useGetCustomerCheckList(buildPayload);

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4vw' },
      type: 'index',
    },
    {
      key: 'name',
      label: 'Nama',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'code',
      label: 'Kode',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'profile',
      label: 'Profil',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'birthPlace',
      label: 'Tempat Lahir',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'birthDate',
      label: 'Tanggal Lahir',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'nationality',
      label: 'Warga Negara',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'category',
      label: 'Watchlist',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
      sx: { minWidth: '10vw' },
    },
  ];

  const transformedTableData = useMemo(() => {
    if (!tableData?.contents) return [];

    return tableData.contents.map((item) => ({
      ...item,
      birthDate: item.birthDate === 'null' || !item.birthDate ? null : item.birthDate,
    }));
  }, [tableData]);

  const filterDropdownList = [
    { label: 'Nama', value: 'name' },
    { label: 'Kode', value: 'code' },
    { label: 'Tempat Lahir', value: 'birthPlace' },
    { label: 'Warga Negara', value: 'nationality' },
  ];

  const sortByOptions = [
    { label: 'Nama', value: 'name' },
    { label: 'Kode', value: 'code' },
    { label: 'Profil', value: 'profile' },
    { label: 'Tempat Lahir', value: 'birthPlace' },
    { label: 'Tanggal Lahir', value: 'birthDate' },
    { label: 'Warga Negara', value: 'nationality' },
    { label: 'Watchlist', value: 'category' },
  ];

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'profil',
      label: 'Profil',
      options: profileOptions || [],
      type: 'dropdown',
    },
    {
      key: 'watchlist',
      label: 'Watchlist',
      options: categoryOptions || [],
      type: 'dropdown',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData: {
      contents: transformedTableData,
      page: tableData?.page,
    },
    tableHeader,
  };
};
