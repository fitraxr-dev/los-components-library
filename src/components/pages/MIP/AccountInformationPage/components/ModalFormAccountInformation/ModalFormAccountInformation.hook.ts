import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber } from '@/helpers/utils';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetParameterListByValue from '@/hooks/services/useGetParameterListByValue';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import { modal } from '../../AccountInformation.constants';
import useGetDetailAccountInfo from '../../hooks/useGetDetailAccountInfo';
import useSaveAccountInformation from '../../hooks/useSaveAccountInformation';

import { modalAccountInformationSchema } from './ModalFormAccountInformation.constants';


export const useModalFormAccountInformation = ({ id }) => {
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
      debtorName: null,
      exchangeRate: null,
      nominal: null,
      nominalIdr: null,
      product: '',
      rates: '',
      reference: '',
      remark: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(modalAccountInformationSchema),
  });

  const { data: debtorInfo, isSuccess: isDetailBucketSuccess } = useGetDetailBucketDebtor({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess });

  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });
  const { data: bankTypeDropdownList } = useGetParameterList(
    Modules.BANK_TYPE,
    {
      label: 'value1',
      module: 'value2',
      value: 'key',
    }
  );

  const { data: bankNameData } = useGetParameterListByValue(
    { module: bankNameModule, value: bankNameKeyword },
    {
      label: 'value1',
      value: 'key',
    }, {
      enabled: !!formMethods.watch('bankType.label'),
    });

  const bankNameDropdownList = bankNameData?.filter((item) => !selectedBankValue.includes(item.value) && item);

  const {
    data: accountDetail,
    isSuccess: isSuccessAccountDetail,
  } = useGetDetailAccountInfo({ id }, { enabled: !!id });

  const handleChangeBankType = (value) => {
    const bankNameModule = bankTypeDropdownList.find((item) => item.value === value.value)?.module;
    setBankNameModule(bankNameModule);
  };

  useEffect(() => {
    if (isSuccessAccountDetail && accountDetail) {
      const newDetail = structuredClone(accountDetail);
      const amount = newDetail.nominal * newDetail.excRate;

      const initialValues = {
        bank: {
          id: newDetail.bankCode,
          label: newDetail.bankLabel,
        },
        bankType: {
          id: newDetail.bankType,
          label: newDetail.bankType,
        },
        debtorName: debtorInfo?.debtorName,
        exchangeRate: {
          currency: newDetail.excCurrency || 'IDR',
          value: newDetail.excRate,
        },
        nominal: {
          currency: newDetail.nominalCurrency,
          value: newDetail.nominal,
        },
        nominalIdr: {
          currency: 'IDR',
          value: amount,
        },
        product: newDetail.product,
        rates: newDetail.rate,
        reference: newDetail.reference,
        remark: newDetail.description,
      };
      const bankNameModule = bankTypeDropdownList.find((item) => item.value === newDetail.bankType)?.module;
      setBankNameModule(bankNameModule);

      formMethods.reset(initialValues as any);
    }
  }, [accountDetail, isSuccessAccountDetail]);

  useEffect(() => {
    if (!id && isDetailBucketSuccess) {
      formMethods.setValue('debtorName', debtorInfo?.debtorName ?? '');
    }
  }, [debtorInfo?.debtorName, formMethods, id, isDetailBucketSuccess]);

  useEffect(() => {
    const nominal = Number(formMethods.watch('nominal.value'));
    const exchangeRate = Number(formMethods.watch('exchangeRate.value'));
    const plafondValue = String(nominal * exchangeRate);
    formMethods.setValue('nominalIdr.value', plafondValue);

  }, [formMethods.watch('nominal'), formMethods.watch('exchangeRate')]);

  useEffect(() => {
    const nominal = Number(formMethods.watch('nominal.value'));
    if (formMethods.watch('nominal.currency') === 'IDR' && nominal) {
      formMethods.setValue('nominalIdr.value', String(nominal));
    }

  }, [formMethods.watch('nominal')]);

  // Auto-fill exchange rate when currency changes
  useEffect(() => {
    const selectedCurrency = formMethods.watch('nominal.currency');

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
      formMethods.setValue('exchangeRate', null);
    }
  }, [formMethods.watch('nominal.currency'), currencyDropdownList]);

  const { mutate: saveAccountBank } = useSaveAccountInformation({
    onSuccess: () => {
      closeNiceModal(modal.FORM_ACCOUNT_INFORMATION);
      showNiceModalV2({ type: 'success' });
    },
  });

  const handleOnSave = (data) => {
    const payload = {
      bankCode: data.bank?.id,
      bankLabel: data.bank?.label,
      bankType: data.bankType?.id,
      bucketProcessId: processId,
      debtorCode: debtorInfo?.debtorId,
      debtorName: data.debtorName,
      description: data.remark,
      excCurrency: data.exchangeRate?.currency,
      excRate: data.exchangeRate?.value ? formatNumber(data.exchangeRate?.value) : '',
      id,
      module: state.pages.mipModule,
      nominal: data.nominal?.value ? Number(data.nominal.value) : undefined,
      nominalCurrency: data.nominal?.currency,
      process: state.pages.mipProcess,
      product: data?.product,
      rate: data?.rates,
      reference: data.reference,
    };

    saveAccountBank(payload as any);
  };

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

  const isSaveDisabled = !formMethods.formState.isValid;

  return {
    bankNameDropdownList,
    bankTypeDropdownList,
    currencyDropdownList,
    formMethods,
    handleChangeBankType,
    handleOnSave,
    handleSelectedBankValue,
    isSaveDisabled,
    selectedBankValue,
    setBankNameKeyword,
    setSelectedBankValue,
  };
};
