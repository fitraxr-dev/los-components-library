import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber, multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterListByValue from '@/hooks/services/useGetParameterListByValue';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import { modal } from '../../FinancingFacility.constants';
import useGetFinancingFacilityOtherBankById from '../../hooks/useGetFinancingFacilityOtherBankById';
import useSaveFinancingFacilityOtherBank from '../../hooks/useSaveFinancingFacilityOtherBank';

import { modalFacilityOtherBankSchema } from './ModalFinancingFacilityOtherBank.constants';


export const useModalFormFinancingFacilityOtherBank = ({ id }) => {
  const { processId } = useIdentity();
  const [state, _] = useApp();

  const [bankNameKeyword, setBankNameKeyword] = useState('');
  const [bankNameModule, setBankNameModule] = useState(null);
  const [selectedBankValue, setSelectedBankValue] = useState([]);

  const formMethods = useForm({
    context: {
      selectedBankValue,
      setSelectedBankValue: (val: Array<string>) => setSelectedBankValue(val),
    },
    defaultValues: {
      bank: null,
      bankType: null,
      callType: null,
      collectability: null,
      debtorName: '',
      exchangeRate: {
        currency: 'IDR',
        value: null,
      },
      isSyndication: false,
      otherBank: [],
      outstanding: {
        currency: 'IDR',
        value: null,
      },
      outstandingIdr: null,
      plafond: {
        currency: 'IDR',
        value: null,
      },
      plafondIdr: null,
      product: '',
      rates: '',
      remark: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(modalFacilityOtherBankSchema),
  });

  const { data: debtorInfo } = useGetDetailBucketDebtor({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess });

  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });
  const { data: bankTypeDropdownList, isLoading: isLoadingBankType } = useGetParameterList(
    Modules.BANK_TYPE,
    {
      label: 'value1',
      module: 'value2',
      value: 'key',
    }
  );

  const { data: collectabilityDropdownList } = useGetParameterList(Modules.COLLECTIBILITY);
  const { data: bankNameData, isLoading: isLoadingBankName } = useGetParameterListByValue(
    { module: bankNameModule, value: bankNameKeyword },
    {
      label: 'value1',
      value: 'key',
    }, {
      enabled: !!formMethods.watch('bankType.label'),
    });

  const bankNameDropdownList = bankNameData.filter((item) => !selectedBankValue.includes(item.value) && item);

  const {
    data: facilityDetail,
    isSuccess: isFetchFacilityDetailSuccess,
  } = useGetFinancingFacilityOtherBankById({ id }, { enabled: !!id });

  const handleChangeBankType = (value) => {
    const bankNameModule = bankTypeDropdownList.find((item) => item.value === value.value)?.module;
    setBankNameModule(bankNameModule);
  };

  useEffect(() => {
    if (debtorInfo) {
      formMethods.setValue('debtorName', debtorInfo.debtorName);
    }
  }, [debtorInfo]);

  useEffect(() => {
    if (facilityDetail && isFetchFacilityDetailSuccess) {
      const newFacilityDetail = structuredClone(facilityDetail);

      const initialValues = {
        bank: {
          id: newFacilityDetail.bank,
          label: newFacilityDetail.bankLabel,
        },
        bankType: {
          id: newFacilityDetail.bankType,
          label: newFacilityDetail.bankTypeLabel,
        },
        callType: newFacilityDetail.callType,
        collectability: newFacilityDetail.collectability,
        debtorName: newFacilityDetail.debtorName,
        exchangeRate: {
          currency: newFacilityDetail.currencyExchangeRate,
          value: newFacilityDetail.exchangeRate,
        },
        isSyndication: newFacilityDetail.isSyndication,
        otherBank: newFacilityDetail.otherBankList.map((item) => ({
          bank: {
            id: item.bank,
            label: item.bankLabel,
          },
          bankType: {
            id: item.bankType,
            label: item.bankTypeLabel,
          },
        })),
        outstanding: {
          currency: newFacilityDetail.currencyOutstanding,
          value: newFacilityDetail.outstanding,
        },
        outstandingIdr: {
          currency: 'IDR',
          value: newFacilityDetail.outstandingIdr,
        },
        plafond: {
          currency: newFacilityDetail.currencyPlafond,
          value: newFacilityDetail.plafond,
        },
        plafondIdr: {
          currency: 'IDR',
          value: newFacilityDetail.plafondIdr,
        },
        product: newFacilityDetail.product,
        rates: newFacilityDetail.rates,
        remark: newFacilityDetail.remark,
      };

      const bankNameModule = bankTypeDropdownList.find((item) => item.value === newFacilityDetail.bankType)?.module;
      setBankNameModule(bankNameModule);

      setSelectedBankValue((prev) => {
        if (initialValues.bank.id) {
          return [
            ...prev,
            ...initialValues.otherBank.map((item) => item.bank.id),
            initialValues.bank.id
          ];
        } else {
          return [];
        }
      });

      formMethods.reset(initialValues);
    }
  }, [facilityDetail, isFetchFacilityDetailSuccess]);

  const watchedPlafond = useWatch({
    control: formMethods.control,
    name: 'plafond',
  });
  const watchedOutstanding = useWatch({
    control: formMethods.control,
    name: 'outstanding',
  });
  const watchedExchangeRate = useWatch({
    control: formMethods.control,
    name: 'exchangeRate',
  });

  const plafondCurrency = watchedPlafond?.currency;
  const plafondValue = watchedPlafond?.value;
  const outstandingValue = watchedOutstanding?.value;
  const exchangeRateValue = watchedExchangeRate?.value;

  useEffect(() => {
    if (!plafondCurrency || plafondCurrency === 'IDR') {
      formMethods.setValue('plafondIdr.value', '');
      formMethods.setValue('outstandingIdr.value', '');
      return;
    }

    if (!exchangeRateValue) {
      formMethods.setValue('plafondIdr.value', '');
      formMethods.setValue('outstandingIdr.value', '');
      return;
    }

    const plafondNominal = multiplyNominalValues(plafondValue, exchangeRateValue);
    const outstandingNominal = multiplyNominalValues(outstandingValue, exchangeRateValue);

    formMethods.setValue('plafondIdr.value', plafondNominal || '');
    formMethods.setValue('outstandingIdr.value', outstandingNominal || '');
  }, [
    exchangeRateValue,
    formMethods,
    plafondCurrency,
    plafondValue,
    outstandingValue,
  ]);

  useEffect(() => {
    const hasEmptyOtherBankInputs = formMethods.watch('otherBank').some((item) => !item?.bank?.id);
    if (hasEmptyOtherBankInputs) {
      formMethods.setError('otherBank', { message: 'Other bank cannot be empty' });
    } else {
      formMethods.clearErrors('otherBank');
    }
  }, [formMethods.watch('otherBank')]);

  // Auto-fill exchange rate when plafond currency changes
  useEffect(() => {
    const selectedCurrency = formMethods.watch('plafond.currency');

    if (selectedCurrency && selectedCurrency !== 'IDR') {
      const currencyData = currencyDropdownList?.find(
        (curr) => curr.value === selectedCurrency
      );

      if (currencyData?.rate) {
        formMethods.setValue('exchangeRate', {
          currency: 'IDR',
          value: currencyData.rate,
        });
      }
    } else if (selectedCurrency === 'IDR') {
      formMethods.setValue('exchangeRate', {
        currency: 'IDR',
        value: null,
      });
    }
  }, [formMethods.watch('plafond.currency'), currencyDropdownList]);

  const { mutate: saveFinancingFacility } = useSaveFinancingFacilityOtherBank({
    onSuccess: () => {
      closeNiceModal(modal.FORM_FACILITY_OTHER_BANK);
      showNiceModalV2({ type: 'success' });
    },
  });

  const normalizedOtherBankPayload = (values: Array<{
    bankType: {id: string; label: string };
    bank: {id: string; label: string };
  }>
  ) => {
    if (values.length > 0) {
      const result = values.map((item) => ({
        bank: item?.bank?.id,
        bankLabel: item?.bank?.label,
        bankType: item?.bankType?.id,
        bankTypeLabel: item?.bankType?.label,
      }));
      return result;
    }
    return [];
  };

  const handleOnSave = (data) => {
    const payload = {
      bank: data.bank?.id,
      bankType: data.bankType?.id,
      bucketProcessId: processId,
      callType: data.callType,
      collectability: data.collectability,
      currencyExchangeRate: data.exchangeRate?.currency,
      currencyOutstanding: data.outstanding?.currency ?? 'IDR',
      currencyPlafond: data.plafond?.currency ?? 'IDR',
      debtorName: debtorInfo?.debtorName,
      exchangeRate: formatNumber(data.exchangeRate?.value),
      id,
      isSyndication: data.isSyndication,
      module: state.pages.mipModule,
      otherBank: data.otherBank.length > 0 ? JSON.stringify(normalizedOtherBankPayload(data.otherBank)) : undefined,
      outstanding: formatNumber(data.outstanding?.value),
      outstandingIdr: formatNumber(data.outstandingIdr?.value),
      plafond: formatNumber(data.plafond?.value),
      plafondIdr: formatNumber(data.plafondIdr?.value),
      process: state.pages.mipProcess,
      product: data.product,
      rates: data.rates,
      remark: data.remark,
    };

    saveFinancingFacility(payload);
  };

  useEffect(() => {
    const selectedFromBank = formMethods.watch('bank.id');
    const selectedFromOtherBank = formMethods.watch('otherBank').filter((item) => item?.bank?.id).map((item) => item?.bank?.id);

    if (selectedFromBank) {
      return setSelectedBankValue([selectedFromBank, ...selectedFromOtherBank]);
    } else {
      return setSelectedBankValue(selectedFromOtherBank);
    }

  }, [formMethods.watch('bank'), formMethods.watch('otherBank')]);

  const handleSelectedBankValue = (initialValue: string, currentValue: string) => {
    setSelectedBankValue((prev) => {
      if (currentValue) {
        return [
          ...prev,
          currentValue,
        ];
      } else {
        return [
          ...prev.filter((item) => item !== initialValue)
        ];
      }
    });
  };

  const isSyndication = formMethods.watch('isSyndication');

  return {
    bankNameDropdownList,
    bankTypeDropdownList,
    collectabilityDropdownList,
    currencyDropdownList,
    formMethods,
    handleChangeBankType,
    handleOnSave,
    handleSelectedBankValue,
    isLoadingBankName,
    isLoadingBankType,
    isSyndication,
    selectedBankValue,
    setBankNameKeyword,
    setSelectedBankValue,
  };
};
