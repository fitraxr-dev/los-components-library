import { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { useParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateToUtc } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';
import useGetBmppGroup from '@/hooks/services/master/group/useGetBmppGroup';
import useGetDebtorProposalList from '@/hooks/services/useGetDebtorProposalList';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetBmppDetail from '../TabBmppCalculation/hooks/useGetBmppDetail';
import useGetBmppDetailMaster from '../TabBmppCalculation/hooks/useGetBmppDetailMaster';

import useGetDebtorProposedLists from './hooks/useGetDebtorProposedList';

import type { TabProposedFacilitiesListProps } from './TabProposedFacilitiesList.types';


const useTabProposedFacilitiesList = (props: TabProposedFacilitiesListProps) => {
  const {
    module,
    process,
    debtorId,
    processId,
    handleNext,
    tableDataDebtor,
    isMipBmpp,
    isTableDataDebtorSuccess,
    groupOptionsList,
  } = props;

  const params = useParams();
  const debtorIdFromParams = String(params.debtorId);
  const [isAllProduct, setIsAllProduct] = useState([]);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-proposed-facility-list', null);

  const [tableDebtorExistingData, setTableDebtorExistingData] = useState(null);
  const hasTableGroupData = groupOptionsList?.length > 0;

  const { data } = useGetBmppDetail({
    bucketProcessId: processId,
    module,
    process,
  }, isMipBmpp);

  const { data: bmppCalculationDetailData } = useGetBmppDetailMaster({
    bucketProcessId: processId,
    module,
    process,
  }, !isMipBmpp);
  const bmppDetailData = isMipBmpp ? data : bmppCalculationDetailData;

  const { data: groupData } = useGetBmppGroup({
    filter: {
      debtorId,
    },
    page: {
      itemPerPage: 25,
      noPage: 1,
    },
  }, {
    enabled: !!debtorId,
  });

  const { data: proposedFalicityDebtorData, isFetching: isDebtorproposedLoading } = useGetDebtorProposedLists({
    filter: {
      allProduct: isAllProduct?.length ? true : false,
      bucketProcessId: processId,
      debtorId,
      groupId: bmppDetailData?.groupId ?? null,
      module,
      ownership: 'DEBTOR',
      withPlan: true,
    } as any,
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

  // start BMPP for MIP
  const {
    data: debtorDataExistingAll,
    isFetching: isDebtorExistingFacilitiesLoading,
    isSuccess: isDebtorExistingFacilitiesSuccess,
  } = useGetDebtorProposalList({
    bucketProcessId: debtorIdFromParams,
    debtorId: debtorIdFromParams,
    excludeDebtor: true,
    isExisting: false,
    module: TypeModule.BMPP,
    process: TypeProcess.BMPP,
  }, !!isAllProduct?.length && isMipBmpp);

  const dataDebtorProposedChecked = debtorDataExistingAll?.map((item: any) => ({
    ...item,
    division: item.divison ?? '-',
    facilityId: item.facilityId,
    governmentMandate: item.governmentMandateLabel ?? '-',
    nominalInIdr: item.orderValueAfterExchangeRate ?? '',
    orderType: item.orderTypeLabel ?? '-',
    plafondExisting: item.outstanding,
    product: item.productLabel ?? '-',
    project: item.project?.name ?? '-',
    timePeriod: item.timePeriod ?? '-',
  }));
  const convertCurrencyStrToNumber = (value: string) => parseFloat(value.replace(/,/g, ''));

  const generateTotalNominalInIdr = () => {
    let totalNominal = 0;
    if (isTableDataDebtorSuccess && isAllProduct?.length === 0) {
      tableDataDebtor?.forEach((item) => totalNominal += convertCurrencyStrToNumber(item.nominalInIdr));
    }

    if (isDebtorExistingFacilitiesSuccess && !!isAllProduct?.length) {
      dataDebtorProposedChecked?.forEach((item) => totalNominal += convertCurrencyStrToNumber(item?.nominalInIdr));
    }

    return String(BigInt(totalNominal));
  };

  const totalNominalInIdr = formatCurrency(generateTotalNominalInIdr());

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
  }));;

  const tableDataDebtorProposedMip = (!!isAllProduct?.length)
    ? dataDebtorProposedChecked
    : (tableDataDebtorProposed ?? tableDataDebtor);
  // end BMPP for MIP
  const totalPageDebtor = proposedFalicityDebtorData?.page;
  const additionalDataDebtor = proposedFalicityDebtorData?.additionalData;

  const hasAddButton = additionalDataDebtor?.hasPlan;
  const lastUpdateDate = isMipBmpp
    ? bmppDetailData?.modificationDate
    : additionalDataDebtor?.lastUpdate;
  const dataAsOfDate = useMemo(() => {
    return lastUpdateDate ? dayjs(lastUpdateDate).format('DD MMM YYYY, [Pukul] HH:mm:ss') : '-';
  }, [lastUpdateDate]);

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  return {
    additionalDataDebtor,
    bmppDetailData,
    dataAsOfDate,
    groupData,
    handleSaveAndNext,
    hasAddButton,
    hasTableGroupData,
    isAllProduct,
    isDebtorExistingFacilitiesLoading,
    isDebtorproposedLoading,
    noPage,
    setIsAllProduct,
    setItemPerPage,
    setNoPage,
    tableDataDebtorProposed,
    tableDataDebtorProposedMip,
    totalNominalInIdr,
    totalPageDebtor,
  };
};

export default useTabProposedFacilitiesList;
