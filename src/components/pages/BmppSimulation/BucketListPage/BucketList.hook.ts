import { useEffect, useState } from 'react';

import { bmppSimulation } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useGetAllDebtor from '@/hooks/services/useGetAllDebtor';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSessionStorage from '@/hooks/useSessionStorage';

import { tableHeaderList } from './BucketList.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useBucketListPage = () => {
  const [filter, setFilter] = useSessionStorage('filter-bmpp-bucket-list', null);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedDebtor, setSelectedDebtor] = useState<{[key: PropertyKey]: string}>({});

  const detailPagePath = replacePath(bmppSimulation.DEBTOR_DETAIL_PAGE, { debtorId: selectedDebtor.debtorId });

  const { data: searchByOptions } = useGetParameterList('searchByDebtor', {
    label: 'value1',
    value: 'value2',
  });

  const { data: sortByOptions } = useGetParameterList('sortByDebtor', {
    label: 'value1',
    value: 'value2',
  });

  const { data: divisionOptions } = useGetParameterList('division', {
    label: 'value1',
    value: 'value2',
  });

  const { data: gamOptions } = useGetAllGam(
    { value: '' },
    { division: 'divisionShort', label: 'fullName', value: 'userId' });

  const gamListData = gamOptions?.map((gam) => ({
    label: `${gam?.division ? gam?.division : ''} - ${gam?.label}`,
    value: gam?.value,
  }));

  // Get all debtor data
  const { data: debtorListData, isLoading } = useGetAllDebtor({
    filter: {
      ...filter?.filter,
      status: ['APPROVED'],
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableData = debtorListData?.data?.contents?.map((item) => ({
    ...item,
    cif: item.cif ?? '-',
    division: item.divisionName ?? '-',
    gamName: item.gamName ?? '-',
    npwp: item.npwp ?? '-',
    rmName: item.staffName ?? '-',
  }));

  const tablePage = debtorListData?.data?.page;

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  const searchByDropdownlist = searchByOptions;
  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'division',
      label: 'Division',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      options: gamListData,
      type: 'multiple-autocomplete',
    },
  ];

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selectedDebtor?.debtorId === data.debtorId,
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selectedDebtor?.debtorId === data.debtorId) {
          setSelectedDebtor({});
        } else {
          setSelectedDebtor(data);
        }
      },
      sx: {
        minWidth: '10px',
      },
      type: 'checkbox',
    },
    ...tableHeaderList,
  ];

  const isNoSelected = Object.keys(selectedDebtor).length === 0;

  return {
    detailPagePath,
    filter,
    filterContentList,
    isLoading,
    isNoSelected,
    itemPerPage,
    noPage,
    searchByDropdownlist,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};

export default useBucketListPage;
