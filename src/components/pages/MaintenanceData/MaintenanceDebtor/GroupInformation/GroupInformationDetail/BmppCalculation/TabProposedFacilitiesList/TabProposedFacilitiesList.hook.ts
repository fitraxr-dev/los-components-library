import { useEffect, useMemo, useState } from 'react';


import { formatDateToUtc } from '@/helpers/date';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetBmppDetailMaster from '../TabBmppCalculation/hooks/useGetBmppDetailMaster';

import useGetDebtorProposedLists from './hooks/useGetDebtorProposedList';

import type { TabProposedFacilitiesListProps } from './TabProposedFacilitiesList.types';


const useTabProposedFacilitiesList = (props: TabProposedFacilitiesListProps) => {
  const {
    module,
    process,
    id,
    processId,
    handleNext,
    groupOptionsList,
    calculationId,
    isIndividual,
  } = props;

  const [isAllProduct, setIsAllProduct] = useState([]);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-ff-proposed-monitoring', null);
  const getSelectedCust = JSON.parse(sessionStorage.getItem('bmppCustomerData'));
  const getSelectedGroup = JSON.parse(sessionStorage.getItem('bmppGroupData'));

  const [tableDebtorExistingData, setTableDebtorExistingData] = useState(null);

  const { data: bmppCalculationDetailData } = useGetBmppDetailMaster({
    bucketProcessId: processId,
    module,
    process,
  });
  const bmppDetailData = bmppCalculationDetailData;

  const { data: proposedFalicityDebtorData, isFetching: isDebtorproposedLoading } = useGetDebtorProposedLists({
    filter: {
      allProduct: !!isAllProduct?.length,
      bucketProcessId: calculationId,
      debtorId: isIndividual ? id : getSelectedCust ? getSelectedCust : null,
      groupId: !isIndividual ? id : getSelectedGroup ? getSelectedGroup : null,
      ownership: isIndividual ? 'DEBTOR' : 'GROUP',
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  useEffect(() => {
    if (proposedFalicityDebtorData) {
      setTableDebtorExistingData(proposedFalicityDebtorData?.contents);
    }
  }, [isAllProduct?.length, proposedFalicityDebtorData]);

  const handleSaveAndNext = () => {
    handleNext();
  };

  const tableDataDebtorProposed = tableDebtorExistingData?.map((item) => ({
    ...item,
    division: item.division ?? '-',
    facilityId: item.facilityId,
    governmentMandate: item.guaranty ?? '-',
    orderType: item.orderType ?? '-',
    product: item.product ?? '-',
    project: item.project ?? '-',
    timePeriod: item.loanTerm ?? '-',
  }));

  const hasTableGroupData = groupOptionsList?.length > 0;

  const totalPageDebtor = proposedFalicityDebtorData?.page;
  const additionalDataDebtor = proposedFalicityDebtorData?.additionalData;

  const hasAddButton = additionalDataDebtor?.hasPlan;
  const dataAsOfDate = useMemo(() => {
    return additionalDataDebtor?.lastUpdate ?
      `${formatDateToUtc(new Date(additionalDataDebtor?.lastUpdate), 'DD MMM YYYY, [Pukul] HH:mm:ss')}` : '-';
  }, [additionalDataDebtor]);

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  return {
    additionalDataDebtor,
    bmppDetailData,
    dataAsOfDate,
    handleSaveAndNext,
    hasAddButton,
    hasTableGroupData,
    isAllProduct,
    isDebtorproposedLoading,
    noPage,
    proposedFalicityDebtorData,
    setIsAllProduct,
    setItemPerPage,
    setNoPage,
    tableDataDebtorProposed,
    totalPageDebtor,
  };
};

export default useTabProposedFacilitiesList;
