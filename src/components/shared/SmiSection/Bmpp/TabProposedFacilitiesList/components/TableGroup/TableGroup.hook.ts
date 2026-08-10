import { useEffect, useMemo, useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatCurrency } from '@/helpers/formatCurrency';
import useGetDebtorGroupProposalList from '@/hooks/services/useGetDebtorGroupProposalList';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetGroupProposedLists from '../../hooks/useGetGroupProposedLists';

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
  const [filter, setFilter] = useSessionStorage('filter-proposed-facility-list', null);

  const [tableDataGroupProposed, setTableDataGroupProposed] = useState(null);

  const results = useGetGroupProposedLists({
    allProduct: isAllProduct,
    group: groupDataToUse,
    itemPerPage: itemPerPage,
    pages: dataPages,

    payload: {
      filter: {
        allProduct: isAllProduct?.length ? true : false,
        bucketProcessId: bmppDetailData?.bucketProcessId,
        debtorId,
        groupId: bmppDetailData?.groupId,
        ownership: 'GROUP',
        withPlan: true,
      },
      searchDetail: filter?.searchDetail ?? { key: '', value: '' },
      sortList: filter?.sortList ?? undefined,
    },
  }, { enabled: true, refetchOnWindowFocus: false, staleTime: 0 });

  useEffect(() => {
    if (results && !arrayEquals(results, tableDataGroupProposed)) {
      setTableDataGroupProposed(results);
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

  const tableDataGroupProposedMipRaw = (!!isAllProduct?.length) ? groupDataExistingAll : tableDataGroup;
  const tableDataGroupProposedMip = Array.isArray(tableDataGroupProposedMipRaw) ? tableDataGroupProposedMipRaw : [];

  const hasEditableGroup = tableDataGroupProposedMip.some((item) => item?.isEditable === true);

  const convertCurrencyStrToNumber = (value: string) => parseFloat(value?.replace(/,/g, ''));

  const generateTotalNominalInIdr = () => {
    let totalNominal = 0;
    tableDataGroupProposedMip?.forEach((item) => {
      totalNominal += convertCurrencyStrToNumber(item?.nominalInIdr);
    });

    return !isNaN(totalNominal) ? String(BigInt(totalNominal)) : '0';
  };

  const totalNominalIdr = useMemo(() => formatCurrency(generateTotalNominalInIdr()), [tableDataGroupProposedMip]);
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
    tableDataGroupProposed,
    tableDataGroupProposedMip,
    totalNominalIdr,
    withConditional,
  };
};

export default useTableGroup;
