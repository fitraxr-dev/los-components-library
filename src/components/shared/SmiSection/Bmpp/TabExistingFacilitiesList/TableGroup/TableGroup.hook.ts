import { useEffect, useMemo, useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatCurrency } from '@/helpers/formatCurrency';
import useGetDebtorGroupProposalList from '@/hooks/services/useGetDebtorGroupProposalList';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetGroupExistingLists from '../hooks/useGetGroupExistingLists';

import type { TableGroupProps } from './TableGroup.types';


const useTableGroup = (props: TableGroupProps) => {
  const {
    tableDataGroup,
    isAllProduct,
    debtorId,
    bmppDetailData,
    isMipBmpp,
    data,
    groupDataFallback } = props;

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const groupDataToUse = groupDataFallback || data;

  const [dataPages, setDataPages] = useState(new Array(groupDataToUse?.length || 0).fill(1));
  const [filter, setFilter] = useSessionStorage('filter-existing-facility-list', null);

  const [tableDataGroupExisting, setTableDataGroupExisting] = useState(null);

  const results = useGetGroupExistingLists({
    allProduct: isAllProduct,
    group: groupDataToUse,
    itemPerPage: itemPerPage,
    pages: dataPages,
    payload: {
      filter: {
        allProduct: isAllProduct?.length ? true : false,
        debtorId,
        groupId: bmppDetailData?.groupId,
        ownership: 'GROUP',
      },
      searchDetail: filter?.searchDetail ?? { key: '', value: '' },
      sortList: filter?.sortList ?? undefined,
    },
  }, { enabled: !isMipBmpp, refetchOnWindowFocus: false, staleTime: 0 });

  useEffect(() => {
    if (results && !arrayEquals(results, tableDataGroupExisting)) {
      setTableDataGroupExisting(results);
    }
  }, [isAllProduct?.length, results]);


  const arrayEquals = (arr1, arr2) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  const {
    data: groupDataExistingAll,
    isLoading: isGroupExistingLoading,
  } = useGetDebtorGroupProposalList({
    bucketProcessId: debtorId,
    debtorId: debtorId,
    excludeDebtor: true,
    isExisting: false,
    module: TypeModule.BMPP,
    process: TypeProcess.BMPP,
  }, !!isAllProduct?.length && isMipBmpp);

  const tableDataGroupExistingMip = (!!isAllProduct?.length) ? groupDataExistingAll : tableDataGroup;

  const hasEditableGroup = Boolean(tableDataGroupExistingMip?.find((item) => item?.isEditable === true));

  const convertCurrencyStrToNumber = (value: string) => parseFloat(value?.replace(/,/g, ''));

  const generateTotalNominalInIdr = () => {
    let totalNominal = 0;
    tableDataGroupExistingMip?.forEach((item) => totalNominal += convertCurrencyStrToNumber(item?.nominalInIdr));

    return !isNaN(totalNominal) ? String(BigInt(totalNominal)) : '0';
  };

  const totalNominalIdr = useMemo(() => formatCurrency(generateTotalNominalInIdr()), [tableDataGroupExistingMip]);
  const withConditional = true;

  return {
    dataPages,
    filter,
    generateTotalNominalInIdr,
    hasEditableGroup,
    isGroupExistingLoading,
    itemPerPage,
    noPage,
    setDataPages,
    setItemPerPage,
    tableDataGroupExisting,
    tableDataGroupExistingMip,
    totalNominalIdr,
    withConditional,
  };
};

export default useTableGroup;
