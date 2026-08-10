'use client';
import { useEffect, useState } from 'react';

import useGetParameterList from '@/hooks/services/useGetParameterList'; // Sesuaikan path
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetApprovalStatusList from '../../hooks/useGetApprovalStatusList';
import useGetlHistoryModalList from '../../hooks/useGetHistoryModalList';

import { MODAL, TABLE_HEADER } from './HistoryModal.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useHistoryModal = () => {
  const router = useCustomRouter();
  const modalId = MODAL.HISTORY_MODAL;

  const [filter, setFilter] = useSessionStorage('filter-history-modal', {
    filter: {
      capitalPositionDateEnd: '',
      capitalPositionDateStart: '',
      modifiedDateEnd: '',
      modifiedDateStart: '',
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
    sortList: {
      columnName: 'nominal',
      sortType: 'ASC',
    },
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [contentList, setContentList] = useState([]);

  // ====================== API Calls =======================

  // Fetch data utama list
  const { data: historyList, isFetching: isLoading } = useGetlHistoryModalList({
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    sortList: {
      ...filter?.sortList,
    },
  });

  const historyPage = historyList?.page;
  const historyListData = historyList?.contents?.map((item) => ({
    ...item,
    bucketProcessId: item.bucketProcessId ?? '-',
  }));

  useEffect(() => {
    setContentList(historyListData || []);
  }, [historyList]);

  // =================== Parameter Lists (Dropdowns) ===================

  const { data: sortByApprovalHistory = []} = useGetParameterList('sortByApprovalHistory');

  const tableHeader: TableHeader[] = [...TABLE_HEADER];


  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByApprovalHistory,
      type: 'sort',
    },
    {
      endKey: 'capitalPositionDateEnd',
      label: 'Periode Capital Position',
      startKey: 'capitalPositionDateStart',
      type: 'period',
    },
    {
      endKey: 'modifiedDateEnd',
      label: 'Periode Last Modified',
      startKey: 'modifiedDateStart',
      type: 'period',
    },
  ];

  return {
    contentList,
    filter,
    filterContentList,
    historyPage,
    isLoading,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useHistoryModal;
