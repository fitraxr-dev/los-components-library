import { useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { formatDateToUtc } from '@/helpers/date';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetExchangeRateExisting
  from '@/components/shared/SmiSection/Bmpp/TabExistingFacilitiesList/hooks/useGetExchangeRateExisting';

import useGetBmppDetailMaster from '../TabBmppCalculation/hooks/useGetBmppDetailMaster';
import useGetBmppGroup from '../TabBmppCalculation/hooks/useGetBmppGroup';

import useGetDebtorExistingLists from './hooks/useGetDebtorExistingLists';
import { validationSchema } from './TabExistingFacilities.constants';

import type { TabExistingFacilitiesProps } from './TabExistingFacilitiesList.types';


const useTabExistingFacilitiesList = (props: TabExistingFacilitiesProps) => {
  const {
    module,
    process,
    processId,
    id,
    isIndividual,
    groupOptionsList,
    calculationId } = props;

  const [isAllProduct, setIsAllProduct] = useState([]);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [dataPages, setDataPages] = useState(new Array(groupOptionsList?.length).fill(1));
  const [filter, setFilter] = useSessionStorage('filter-existing-facility-list', null);
  const [tableDebtorExistingData, setTableDebtorExistingData] = useState(null);
  const getSelectedGroup = JSON.parse(sessionStorage.getItem('bmppGroupData'));
  const getSelectedCust = JSON.parse(sessionStorage.getItem('bmppCustomerData'));

  const { setValue, watch, control } = useForm({
    defaultValues: {
      currencyValue: {
        currency: 'IDR',
        value: 0,
      },
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const hasTableGroupData = groupOptionsList?.length > 0;

  const { data: bmppCalculationDetailData } = useGetBmppDetailMaster({
    bucketProcessId: processId,
    module,
    process,
  });
  const bmppDetailData = bmppCalculationDetailData;

  const debtorIdForGroup = isIndividual ? id : getSelectedCust ? getSelectedCust : null;
  const { data: groupData } = useGetBmppGroup({
    filter: {
      debtorId: debtorIdForGroup,
    },
    page: {
      itemPerPage: 25,
      noPage: 1,
    },
  });

  const { data: existingFalicityDebtorData, isFetching: isDebtorExistingLoading } = useGetDebtorExistingLists({
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

  const totalPageDebtor = existingFalicityDebtorData?.page?.totalPage;
  const additionalDataDebtor = existingFalicityDebtorData?.additionalData;

  useEffect(() => {
    if (existingFalicityDebtorData) {
      setTableDebtorExistingData(existingFalicityDebtorData?.contents);
    }
  }, [isAllProduct?.length, existingFalicityDebtorData]);

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  useEffect(() => {
    setValue('currencyValue', { currency: bmppDetailData?.currency, value: bmppDetailData?.exchangeRate });
  }, [bmppDetailData]);

  const dataAsOfDate = useMemo(() => {
    return additionalDataDebtor?.lastUpdate ?
      `${formatDateToUtc(new Date(additionalDataDebtor?.lastUpdate), 'DD MMM YYYY, [Pukul] HH:mm:ss')}` : '-';
  }, [additionalDataDebtor]);

  const exchangeRateExisting = useGetExchangeRateExisting({ id: id });

  return {
    additionalDataDebtor,
    bmppDetailData,
    control,
    dataAsOfDate,
    dataPages,
    exchangeRateExisting,
    groupData,
    hasTableGroupData,
    isAllProduct,
    isDebtorExistingLoading,
    noPage,
    setDataPages,
    setIsAllProduct,
    setItemPerPage,
    setNoPage,
    tableDebtorExistingData,
    totalPageDebtor,
    watch,
  };
};

export default useTabExistingFacilitiesList;
