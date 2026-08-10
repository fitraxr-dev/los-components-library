import { useEffect, useState } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetAllDebtor from '@/hooks/services/useGetAllDebtor';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetMasterDebtor from '@/hooks/services/useGetMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { TABLE_HEADER_LIST_PAGE } from '../ListPage/List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalGroup = () => {
  const [selected, setSelected] = useState([]);
  const { recordActivity } = useRecordLog();
  const { processId } = useIdentity();

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hasSearched, setHasSearched] = useState(false);

  // const [gamList, setGamList] = useState([]);

  // --- PARAMETER ---
  // Get Customer search by options
  const { data: searchByOptions } = useGetParameterList('searchByBucketActive', { label: 'value1', value: 'value2' });

  // Get Division filter options
  const { data: divisionOptions } = useGetParameterList('division');
  // --- END OF PARAMETER ---

  // Get debtor data
  const { data, isFetching: isLoading } = useGetAllDebtor({
    filter: {
      ...filter?.filter,
      isGovernance: false,
      status: ['APPROVED'],
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail?.value?.length >= 3 ? filter?.searchDetail : null,
    sortList: filter?.sortList ?? null,
  }, { enabled: filter?.searchDetail?.value?.length >= 3 && filter?.searchDetail?.key?.length > 0 });

  // Record activity when debtor list is loaded in modal
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view debtor list in group modal',
      });
    }
  }, [data, page, pageSize, processId, recordActivity]);

  const listMasterDebtor = data?.data.contents.map((debtor) => ({
    ...debtor,
    cif: debtor.cif ?? '-',
    npwp: debtor.npwp ?? '-',
  }));

  const totalPage = data?.data.page.totalPage ?? 1;

  // Map debtor data
  useEffect(() => {
    // Check whether user has try to search something
    setHasSearched(filter?.searchDetail?.value.length > 2);

    // Reset page to 1
    setPage(1);
    // Reset selected
    setSelected([]);
  }, [filter]);

  // GET filter by options (GAM)
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
    ...TABLE_HEADER_LIST_PAGE
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: searchByOptions,
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
