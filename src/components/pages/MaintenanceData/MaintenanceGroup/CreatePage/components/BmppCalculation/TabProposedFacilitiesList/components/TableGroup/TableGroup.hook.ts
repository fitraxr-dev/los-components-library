import { useEffect, useState } from 'react';

import useSessionStorage from '@/hooks/useSessionStorage';

import useGetGroupProposedLists from '../../hooks/useGetGroupProposedLists';

import type { TableGroupProps } from './TableGroup.types';


const useTableGroup = (props: TableGroupProps) => {
  const {
    isAllProduct,
    debtorId,
    calculationId,
    data } = props;

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [dataPages, setDataPages] = useState(new Array(data.length).fill(1));
  const [filter, setFilter] = useSessionStorage('filter-ff-proposed-monitoring', null);

  const [tableDataGroupProposed, setTableDataGroupProposed] = useState(null);

  const results = useGetGroupProposedLists({
    allProduct: isAllProduct,
    group: data,
    itemPerPage: itemPerPage,
    pages: dataPages,
    payload: {
      filter: {
        allProduct: !!isAllProduct?.length,
        bucketProcessId: calculationId,
        debtorId,
        groupId: null,
        ownership: 'GROUP_MONITORING',
      },
      searchDetail: filter?.searchDetail ?? { key: '', value: '' },
      sortList: filter?.sortList ?? undefined,
    },
  }, { refetchOnWindowFocus: false, staleTime: 0 });

  useEffect(() => {
    if (results && !arrayEquals(results, tableDataGroupProposed)) {
      setTableDataGroupProposed(results);
    }
  }, [isAllProduct?.length, results]);

  const arrayEquals = (arr1, arr2) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  const withConditional = true;

  return {
    dataPages,
    filter,
    itemPerPage,
    noPage,
    setDataPages,
    setItemPerPage,
    tableDataGroupProposed,
    withConditional,
  };
};

export default useTableGroup;
