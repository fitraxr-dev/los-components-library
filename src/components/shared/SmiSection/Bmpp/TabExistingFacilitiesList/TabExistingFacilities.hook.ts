import { useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

import Modules from '@/enums/Modules';
import { formatDateToUtc } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBmppGroup from '@/hooks/services/master/group/useGetBmppGroup';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useSessionStorage from '@/hooks/useSessionStorage';


import useGetExchangeRateExisting
  from '@/components/shared/SmiSection/Bmpp/TabExistingFacilitiesList/hooks/useGetExchangeRateExisting';

import useGetBmppDetail from '../TabBmppCalculation/hooks/useGetBmppDetail';
import useGetBmppDetailMaster from '../TabBmppCalculation/hooks/useGetBmppDetailMaster';
import useSaveBmppCalculation from '../TabBmppCalculation/hooks/useSaveBmppCalculation';
import useSaveExistingExchangeRate from '../TabProposedFacilitiesList/hooks/useSaveExistingExchangeRate';

import { mockGroupData } from './__mock_data__';
import useGetDebtorExistingLists from './hooks/useGetDebtorExistingLists';
import { validationSchema } from './TabExistingFacilities.constants';

import type { TabExistingFacilitiesProps } from './TabExistingFacilitiesList.types';
import type { BmppDetailRequestDtoBmppTypeEnum } from '@/services/openapi/mip-service';


const useTabExistingFacilitiesList = (props: TabExistingFacilitiesProps) => {
  const {
    module,
    process,
    processId,
    debtorId,
    bmppType,
    handleNext,
    viewOnly,
    isMipBmpp,
    groupOptionsList } = props;
  const [isAllProduct, setIsAllProduct] = useState([]);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [dataPages, setDataPages] = useState(new Array(groupOptionsList?.length).fill(1));
  const [filter, setFilter] = useSessionStorage('filter-existing-facility-list', null);

  const [tableDebtorExistingData, setTableDebtorExistingData] = useState(null);
  const queryClient = useQueryClient();

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

  const { data: existingFalicityDebtorData, isFetching: isDebtorExistingLoading } = useGetDebtorExistingLists({
    filter: {
      allProduct: !!isAllProduct?.length,
      debtorId,
      groupId: bmppDetailData?.groupId ?? null,
      ownership: 'DEBTOR',
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

  const { mutate: saveExistingFacilityCurr } = useSaveBmppCalculation({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bmpp-calculation-detail',
        { bucketProcessId: processId, module, process }]});
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: saveExistingFacilityEx } = useSaveExistingExchangeRate({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-bmpp-calculation-detail',
        { bucketProcessId: processId, module, process }]});
      queryClient.invalidateQueries({ queryKey: ['existing-exchange-rate',
        { id: debtorId }]});
      queryClient.invalidateQueries({ queryKey: ['existing-debtor-financing-facility']});
      queryClient.invalidateQueries({ queryKey: ['existing-group-financing-facility']});
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnSave = () => {
    if (viewOnly) {
      return handleNext();
    }

    if (isMipBmpp) {
      saveExistingFacilityCurr({
        bmppType: bmppType as BmppDetailRequestDtoBmppTypeEnum,
        bucketProcessId: processId,
        currency: watch('currencyValue.currency'),
        debtorId,
        debtorRating: bmppDetailData?.debtorRating ?? null,
        debtorType: bmppDetailData?.debtorType ?? null,
        exchangeRate: watch('currencyValue.value'),
        isRelation: bmppDetailData?.isRelation ?? null,
        module,
        process,
      });
    } else {
      saveExistingFacilityEx({
        currency: watch('currencyValue.currency'),
        debtorId,
        exchangeRate: watch('currencyValue.value'),
      });
    }
  };

  useEffect(() => {
    setValue('currencyValue', { currency: bmppDetailData?.currency, value: bmppDetailData?.exchangeRate });
  }, [bmppDetailData]);

  const lastUpdateDate = isMipBmpp
    ? bmppDetailData?.modificationDate
    : additionalDataDebtor?.lastUpdate;
  const dataAsOfDate = useMemo(() => {
    return lastUpdateDate ? dayjs(lastUpdateDate).format('DD MMM YYYY, [Pukul] HH:mm:ss') : '-';
  }, [lastUpdateDate]);

  const exchangeRateExisting = useGetExchangeRateExisting({ id: debtorId });
  const { data: currencyList } = useGetParameterList(Modules.CURRENCY, {
    label: 'value1',
    rate: 'value2',
    value: 'key',
  });

  const exchangeRateFromCurrency = useMemo(() => {
    if (currencyList && currencyList.length > 0) {
      const usdCurrency = currencyList.find((item: any) => item.value === 'USD');
      return usdCurrency?.rate ? usdCurrency.rate.replaceAll('.00', '') : null;
    }
    return null;
  }, [currencyList]);

  return {
    additionalDataDebtor,
    bmppDetailData,
    control,
    dataAsOfDate,
    dataPages,
    exchangeRateExisting,
    exchangeRateFromCurrency,
    groupData,
    handleOnSave,
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
