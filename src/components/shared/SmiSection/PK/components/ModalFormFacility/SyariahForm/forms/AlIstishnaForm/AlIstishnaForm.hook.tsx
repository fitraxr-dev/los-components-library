import { useEffect, useMemo, useState } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { validation } from '../../SyariahForm.constant';
import useSyariahForm from '../../SyariahForm.hook';

import { AlIstishnaData } from './AlIstishna.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlIstishna = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, module, process, existing } = props;
  const { facilityId, processId } = useIdentity();
  const { calculateTotalSyirkah } = useSyariahForm();

  const [originalPurchasePrice, setOriginalPurchasePrice] = useState<string>('');
  const [originalCurrencyPurchasePrice, setOriginalCurrencyPurchasePrice] = useState<string>('');
  const [isPurchasePriceUnchanged, setIsPurchasePriceUnchanged] = useState<boolean>(true);

  const {
    masintonForm,
    masintonChange,
    masintonReplace,
    masintonReset,
    masintonMagic,
    masintonMultiChange,
  } = useMasintonForm(AlIstishnaData, validation);

  const {
    currency_purchase_price,
    purchase_price,
    exchange_rate_purchase_price,
    purchase_price_idr,
    currency_down_payment,
    down_payment,
    down_payment_idr,
    exchange_rate_down_payment,
    discount,
    istishna_margin_idr,
    currency_istishna_margin,
    istishna_installment,
    currency_istishna_installment,
    exchange_rate_istishna_installment,
    istishna_installment_idr,
    istishna_margin,
    exchange_rate_istishna_margin,
  } = masintonForm;

  const { data: debtorDetail, isSuccess: isDebtorSuccess } = useGetBucketById({
    bucketProcessId: processId,
    module: module,
    process: process,
  }, { enabled: true });

  const { data: Dselling_price_payment_method } = useGetParameterList('sellingPricePaymentMethod');
  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  useEffect(() => {
    if (debtorDetail?.debtorName &&
      (!masintonForm.debtorName.value ||
        masintonForm.debtorName.value !== debtorDetail.debtorName
      ) && isDebtorSuccess) {
      masintonChange('debtorName', debtorDetail.debtorName);
    }
  }, [debtorDetail?.debtorName, masintonForm.debtorName.value, masintonChange]);

  useEffect(() => {
    if (financingFacilityData && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);
      masintonMagic(newFinancingData);

      const existingPurchasePrice = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'purchase_price')?.attributeValue;
      const existingCurrencyPurchasePrice = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_purchase_price')?.attributeValue;

      if (existingPurchasePrice) {
        setOriginalPurchasePrice(existingPurchasePrice.toString());
      }
      if (existingCurrencyPurchasePrice) {
        setOriginalCurrencyPurchasePrice(existingCurrencyPurchasePrice);
      } else if (existingPurchasePrice) {
        setOriginalCurrencyPurchasePrice('IDR');
      }

      setIsPurchasePriceUnchanged(true);
    }
  }, [financingFacilityData]);

  useEffect(() => {
    onChangeSyariahForm(
      {
        masintonChange: masintonChange,
        masintonForm: masintonForm,
        masintonReplace: masintonReplace,
      });
  }, [masintonForm]);

  // UseEffect untuk inisialisasi exchange rate saat pertama kali modal dibuka
  useEffect(() => {
    if (currencyDropdownList && financingFacilityData && !exchange_rate_purchase_price.value) {
      const exchangeRateFromApi = financingFacilityData?.exchangeRate;
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      const finalRate = exchangeRateFromApi || fallbackRate;

      if (finalRate) {
        masintonChange('exchange_rate_purchase_price', finalRate);
      }
    }
  }, [currencyDropdownList, financingFacilityData, exchange_rate_purchase_price.value]);

  // UseEffect khusus untuk kalkulasi purchase_price_idr saat exchange rate sudah tersedia
  useEffect(() => {
    if (currency_purchase_price.value === 'USD' && purchase_price.value && exchange_rate_purchase_price.value) {
      const currentExchangeRate = parseFloat(exchange_rate_purchase_price.value.toString());
      if (currentExchangeRate > 0) {
        const valueAfterPurchasePrice = multiplyNominalValues(purchase_price.value, currentExchangeRate.toString());
        const cleanValue = valueAfterPurchasePrice.replaceAll(',', '');
        if (purchase_price_idr.value !== cleanValue) {
          masintonChange('purchase_price_idr', cleanValue);
        }
      }
    }
  }, [
    purchase_price.value,
    exchange_rate_purchase_price.value,
    currency_purchase_price.value,
    purchase_price_idr.value
  ]);

  // 1. UseEffect untuk handle kalkulasi field lainnya (bukan purchase_price_idr)
  useEffect(() => {
    // Dapatkan exchange rate yang akan digunakan - gunakan fallback jika belum ada
    let currentExchangeRate = 1;
    if (exchange_rate_purchase_price.value) {
      currentExchangeRate = parseFloat(exchange_rate_purchase_price.value.toString());
    } else if (currencyDropdownList) {
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      if (fallbackRate) {
        currentExchangeRate = parseFloat(fallbackRate.toString());
      }
    }

    // Reset purchase_price_idr jika currency bukan USD
    if (currency_purchase_price.value === 'IDR' && purchase_price_idr.value !== '') {
      masintonChange('purchase_price_idr', '');
    }
  }, [
    currency_purchase_price.value,
    exchange_rate_purchase_price.value,
    currencyDropdownList,
    purchase_price_idr.value,
  ]);


  useEffect(() => {
    // Dapatkan exchange rate yang akan digunakan - gunakan fallback jika belum ada
    let currentExchangeRate = 1;
    if (exchange_rate_purchase_price.value) {
      currentExchangeRate = parseFloat(exchange_rate_purchase_price.value.toString());
    } else if (currencyDropdownList) {
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      if (fallbackRate) {
        currentExchangeRate = parseFloat(fallbackRate.toString());
      }
    }

    // Kalkulasi down_payment_idr
    if (currency_down_payment.value === 'USD' && down_payment.value && currentExchangeRate > 0) {
      const valueAfterDownPayment = multiplyNominalValues(down_payment.value, currentExchangeRate.toString());
      const cleanValue = valueAfterDownPayment.replaceAll(',', '');
      if (down_payment_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('down_payment_idr', cleanValue);
        }, 50);
      }
    } else if (currency_down_payment.value === 'IDR' && down_payment_idr.value !== '') {
      masintonChange('down_payment_idr', '');
    }
  }, [
    down_payment.value,
    exchange_rate_purchase_price.value,
    currency_down_payment.value,
    down_payment_idr.value,
    currencyDropdownList
  ]);

  useEffect(() => {
    // Dapatkan exchange rate yang akan digunakan - gunakan fallback jika belum ada
    let currentExchangeRate = 1;
    if (exchange_rate_purchase_price.value) {
      currentExchangeRate = parseFloat(exchange_rate_purchase_price.value.toString());
    } else if (currencyDropdownList) {
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      if (fallbackRate) {
        currentExchangeRate = parseFloat(fallbackRate.toString());
      }
    }

    // Kalkulasi istishna_margin_idr
    if (currency_istishna_margin.value === 'USD' && istishna_margin.value && currentExchangeRate > 0) {
      const valueAfterMargin = multiplyNominalValues(istishna_margin.value, currentExchangeRate.toString());
      const cleanValue = valueAfterMargin.replaceAll(',', '');
      if (istishna_margin_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('istishna_margin_idr', cleanValue);
        }, 50);
      }
    } else if (currency_istishna_margin.value === 'IDR' && istishna_margin_idr.value !== '') {
      masintonChange('istishna_margin_idr', '');
    }
  }, [istishna_margin.value,
    exchange_rate_purchase_price.value,
    currency_istishna_margin.value,
    istishna_margin_idr.value,
    currencyDropdownList]);

  useEffect(() => {
    // Dapatkan exchange rate yang akan digunakan - gunakan fallback jika belum ada
    let currentExchangeRate = 1;
    if (exchange_rate_purchase_price.value) {
      currentExchangeRate = parseFloat(exchange_rate_purchase_price.value.toString());
    } else if (currencyDropdownList) {
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      if (fallbackRate) {
        currentExchangeRate = parseFloat(fallbackRate.toString());
      }
    }

    // Kalkulasi istishna_installment_idr
    if (currency_istishna_installment.value === 'USD' && istishna_installment.value && currentExchangeRate > 0) {
      const valueAfterInstallment = multiplyNominalValues(istishna_installment.value, currentExchangeRate.toString());
      const cleanValue = valueAfterInstallment.replaceAll(',', '');
      if (istishna_installment_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('istishna_installment_idr', cleanValue);
        }, 50);
      }
    } else if (currency_istishna_installment.value === 'IDR' && istishna_installment_idr.value !== '') {
      masintonChange('istishna_installment_idr', '');
    }
  }, [
    istishna_installment.value,
    exchange_rate_purchase_price.value,
    currency_istishna_installment.value,
    istishna_installment_idr.value,
    currencyDropdownList
  ]);

  useMemo(() => {
    const isIdrCurrency = currency_purchase_price.value === 'IDR' && currency_down_payment.value === 'IDR';
    const discountAmountIdr = (discount.value / 100) * purchase_price_idr.value;
    const discountAmount = (discount.value / 100) * purchase_price.value;
    const valueAfterExchangeRate = calculateTotalSyirkah({
      currency: isIdrCurrency ? 'IDR' : 'USD',
      idr: (+purchase_price_idr.value - +discountAmountIdr - +down_payment_idr.value).toString(),
      value: (+purchase_price.value - +discountAmount - +down_payment.value).toString(),
    },
    {
      currency: currency_istishna_margin.value,
      idr: istishna_margin_idr.value,
      value: istishna_margin.value,
    });

    masintonMultiChange({
      currency_selling_price: valueAfterExchangeRate.currency_total_partnership,
      selling_price: valueAfterExchangeRate.total_partnership,
      selling_price_idr: valueAfterExchangeRate.total_partnership_idr,
    });

  }, [
    purchase_price_idr.value,
    discount.value,
    down_payment.value,
    down_payment_idr.value,
    purchase_price.value,
    istishna_margin_idr.value,
    istishna_margin.value,
  ]);

  useEffect(() => {
    if (originalPurchasePrice !== '') {
      const normalizeValue = (value: string) => {
        if (!value) return '0';
        const numValue = parseFloat(value.replace(/,/g, ''));
        return isNaN(numValue) ? '0' : numValue.toString();
      };

      const normalizedOriginal = normalizeValue(originalPurchasePrice);
      const normalizedCurrent = normalizeValue(purchase_price.value || '');
      const isValueUnchanged = normalizedCurrent === normalizedOriginal;
      const isCurrencyUnchanged = currency_purchase_price.value === (originalCurrencyPurchasePrice || 'IDR');

      // For edit mode: check if existing_purchase_price is different from purchase_price
      if (facilityId && !existing) {
        // Edit mode: compare existing_purchase_price with current purchase_price
        const existingPurchasePrice = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_purchase_price')?.attributeValue;
        const existingCurrencyPurchasePrice = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_currency_purchase_price')?.attributeValue;

        const existingValue = existingPurchasePrice ? parseFloat(existingPurchasePrice.toString().replace(/,/g, '')) : 0;
        const currentValue = parseFloat(purchase_price.value?.toString().replace(/,/g, '') || '0');
        const existingCurrency = existingCurrencyPurchasePrice || 'IDR';
        const currentCurrency = currency_purchase_price.value || 'IDR';

        // Check if values or currencies are different (checkbox should be unchecked if different)
        const isValueDifferent = existingValue !== currentValue;
        const isCurrencyDifferent = existingCurrency !== currentCurrency;
        const isUnchanged = !isValueDifferent && !isCurrencyDifferent;
        setIsPurchasePriceUnchanged(isUnchanged);
      } else {
        // For add existing mode: normal logic
        setIsPurchasePriceUnchanged(isValueUnchanged && isCurrencyUnchanged);
      }
    } else if (financingFacilityData) {
      setIsPurchasePriceUnchanged(true);
    }
  }, [
    purchase_price.value,
    currency_purchase_price.value,
    originalPurchasePrice,
    originalCurrencyPurchasePrice,
    financingFacilityData,
    facilityId,
    existing,
  ]);

  useEffect(() => {
    return () => masintonReset();
  }, []);

  return {
    Dselling_price_payment_method,
    currencyDropdownList,
    governmentMandateList,
    isPurchasePriceUnchanged,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    masintonReplace,
    masintonReset,
  };
};

export default useAlIstishna;
