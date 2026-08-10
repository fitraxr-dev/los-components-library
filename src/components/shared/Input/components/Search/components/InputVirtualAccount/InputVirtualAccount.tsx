'use client';

import { useState, useMemo, useEffect } from 'react';


import useGetBankList from '@/components/pages/VirtualAccount/hooks/useGetBankList';
import useGetVaPramList from '@/components/pages/VirtualAccount/hooks/useGetVaPramList';
import ColumnWrapper from '@/components/shared/ColumnWrapper';

import InputAutocompleteV2 from '../InputAutocompleteV2';


const InputVirtualAccount = ({
  bank,
  currency,
  vaType,
  customerType,
  onChange,
}) => {
  const [filter, setFilter] = useState({
    bank: bank,
    currency: currency,
    customerType: customerType,
    vaType: vaType,
  });

  const { data: bankOptions, isLoading: isLoadingBank } = useGetBankList();

  const selectedBankKey = useMemo(() => {
    const val = filter?.bank?.value;
    return val || null;
  }, [filter?.bank?.value]);

  const { data: currencyOptions = [], isLoading: isLoadingCurrency } = useGetVaPramList({
    key: 'currency',
    module: selectedBankKey ?? '',
  });

  const { data: vaTypeOptions = [], isLoading: isLoadingVaType } = useGetVaPramList({
    key: 'vaType',
    module: selectedBankKey ?? '',
  });

  const { data: customerTypeOptions = [], isLoading: isLoadingCustomerType } = useGetVaPramList({
    key: 'customerType',
    module: selectedBankKey ?? '',
  });

  // for reset
  useEffect(() => {
    const currentFilter = filter ?? {} as any;
    if (!currentFilter.bank) {
      if (currentFilter.currency || currentFilter.vaType || currentFilter.customerType) {
        setFilter((prev) => {
          const newFilter = { ...prev };
          delete newFilter.currency;
          delete newFilter.vaType;
          delete newFilter.customerType;
          return newFilter;
        });
      }
    }
    onChange(filter);
  }, [filter]);

  // Sinkronisasi props with internal state
  useEffect(() => {
    setFilter({
      bank: bank,
      currency: currency,
      customerType: customerType,
      vaType: vaType,
    });
  }, [bank, currency, vaType, customerType]);

  const BankOptionsMapped = useMemo(() => {
    return bankOptions?.map((item) => ({
      label: item.label,
      value: item.value,
    })) ?? [];
  }, [bankOptions]);

  const currencyOptionsMapped = useMemo(() => {
    return currencyOptions?.map((item) => ({ label: item.label, value: item.value })) ?? [];
  }, [currencyOptions]);

  const vaTypeOptionsMapped = useMemo(() => {
    return vaTypeOptions?.map((item) => ({ label: item.label, value: item.value })) ?? [];
  }, [vaTypeOptions]);

  const customerTypeOptionsMapped = useMemo(() => {
    return customerTypeOptions?.map((item) => ({ label: item.label, value: item.value })) ?? [];
  }, [customerTypeOptions]);

  return (
    <ColumnWrapper sx={{ gap: 2 }}>
      <InputAutocompleteV2
        label="Bank"
        isLoading={isLoadingBank}
        dropdownList={BankOptionsMapped}
        onChange={(value) => {
          const isEmpty = !value || (value.id === '' && value.label === '');
          setFilter((prev) => {
            const updated = { ...prev };
            if (isEmpty) {
              delete updated.bank;
            } else {
              updated.bank = value;
            }
            return updated;
          });
        }}
        value={filter?.bank}
      />
      <InputAutocompleteV2
        label="Currency"
        disabled={!selectedBankKey}
        isLoading={isLoadingCurrency}
        dropdownList={currencyOptionsMapped}
        onChange={(value) => {
          const isEmpty = !value || (value.id === '' && value.label === '');
          setFilter((prev) => {
            const updated = { ...prev };
            if (isEmpty) {
              delete updated.currency;
            } else {
              updated.currency = value;
            }
            return updated;
          });
        }}
        value={filter?.currency}
      />
      <InputAutocompleteV2
        label="VA Type"
        disabled={!selectedBankKey}
        isLoading={isLoadingVaType}
        dropdownList={vaTypeOptionsMapped}
        onChange={(value) => {
          const isEmpty = !value || (value.id === '' && value.label === '');
          setFilter((prev) => {
            const updated = { ...prev };
            if (isEmpty) {
              delete updated.vaType;
            } else {
              updated.vaType = value;
            }
            return updated;
          });
        }}
        value={filter?.vaType}
      />
      <InputAutocompleteV2
        label="Customer Type"
        disabled={!selectedBankKey}
        isLoading={isLoadingCustomerType}
        dropdownList={customerTypeOptionsMapped}
        onChange={(value) => {
          const isEmpty = !value || (value.id === '' && value.label === '');
          setFilter((prev) => {
            const updated = { ...prev };
            if (isEmpty) {
              delete updated.customerType;
            } else {
              updated.customerType = value;
            }
            return updated;
          });
        }}
        value={filter?.customerType}
      />
    </ColumnWrapper>
  );
};

export default InputVirtualAccount;
