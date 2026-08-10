'use client';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import Currency from '@/components/shared/Currency';

import type { TCurrencyProps } from './CurrencyForm.types';


const CurrencyForm = ({ initialProps, kursProps, idrProps }: TCurrencyProps) => {
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, {
    label: 'value1',
    rate: 'value2',
    value: 'key',
  });

  return (
    <>
      {/* Main Currency Input */}
      <Currency
        isMandatory={initialProps.isMandatory ?? false}
        currencyList={currencyDropdownList}
        label={initialProps.label}
        placeholder={initialProps.placeholder}
        containerSx={{ flex: 1 }}
        value={{ currency: initialProps.currency, value: initialProps.value }}
        onChange={initialProps.onChange}
        onCurrencyChange={initialProps.onCurrencyChange}
        error={initialProps.error ?? false}
        helperText={initialProps.errorMessage ?? ''}
        disabledCurrency={kursProps.disabled}
        disabled={kursProps.disabled}
      />

      {initialProps.currency !== 'IDR' && (
        <>
          {/* Exchange Rate Input */}
          <Currency
            isMandatory={(initialProps.isMandatory || kursProps.isMandatory) ?? false}
            currencyList={currencyDropdownList}
            label="Konversi Mata Uang"
            disabledCurrency
            placeholder="Kurs"
            containerSx={{ flex: 1 }}
            value={{ currency: 'IDR', value: kursProps.value }}
            onChange={kursProps.onChange}
            error={kursProps.error ?? false}
            helperText={kursProps.errorMessage ?? ''}
            disabled={kursProps.disabled}
          />

          {/* Converted IDR Value */}
          <Currency
            currencyList={currencyDropdownList}
            label={`${initialProps.label} (dalam Rp)`}
            placeholder={`${initialProps.label} (dalam Rp)`}
            containerSx={{ flex: 1 }}
            value={{ currency: 'IDR', value: idrProps.value }}
            disabled
            error={idrProps.error ?? false}
            helperText={idrProps.errorMessage ?? ''}
            disabledCurrency={kursProps.disabled}
          />
        </>
      )}
    </>
  );
};

export default CurrencyForm;
