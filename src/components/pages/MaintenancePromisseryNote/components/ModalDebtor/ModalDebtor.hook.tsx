import { useEffect, useState } from 'react';

import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetMasterDebtor from '@/hooks/services/useGetMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDebtor = () => {
  const [selected, setSelected] = useState([]);

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hasSearched, setHasSearched] = useState(false);

  const { data: searchByOptions } = useGetParameterList('searchByDebtor', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByDebtor', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division');

  const { data, isFetching: isLoading } = useGetMasterDebtor({
    filter: filter?.filter ?? {},
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail?.value?.length >= 3 ? filter?.searchDetail : {},
    sortList: filter?.sortList ?? {},
  }, { enabled: filter?.searchDetail?.value?.length >= 3 && filter?.searchDetail?.key?.length > 0 });

  const listMasterDebtor = data?.data.contents.map((debtor) => ({
    ...debtor,
    cif: debtor.cif ?? '-',
    groupName: debtor.groupName || '-',
    npwp: debtor.npwp ?? '-',
  }));

  const totalPage = data?.data.page.totalPage ?? 1;

  useEffect(() => {
    if (
      !hasSearched
      && filter?.searchDetail?.value !== undefined
      && filter?.searchDetail?.value !== null
      && filter?.searchDetail?.value !== ''
    ) {
      setHasSearched(true);
    }

    setPage(1);
    setSelected([]);
  }, [filter]);

  const { data: filterByGamOptions } = useGetAllGam({ value: '' }, { division: 'divisionShort', label: 'fullName', value: 'userId' });

  const gamList = filterByGamOptions?.map((gam) => ({
    label: `${gam?.division} - ${gam?.label}`,
    value: gam?.value,
  }));


  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((el) => el.debtorId === data.debtorId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((el) => el.debtorId === data.debtorId)) {
          setSelected([]);
        } else {
          setSelected([data]);
        }
      },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'debtorName',
      label: 'Client Name',
    },
    {
      key: 'staffName',
      label: 'Nama RM',
    },
    {
      key: 'debtorName',
      label: 'Divisi',
    },
    {
      key: 'gamName',
      label: 'General Account Manager',
    },
    {
      key: 'customerId',
      label: 'Customer ID',
    },
    {
      key: 'cif',
      label: 'No CIF',
    },
    {
      key: 'issuer',
      label: 'Issuer',
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
      key: 'division',
      label: 'Divisi',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      options: gamList,
      type: 'multiple-autocomplete',
    },
  ];


  return {
    filter,
    filterContentList,
    filterDropdownList,
    hasSearched,
    isLoading,
    listMasterDebtor,
    page,
    pageSize,
    selected,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};
