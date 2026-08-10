import { useEffect, useMemo, useState } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { validation } from '../../SyariahForm.constant';
import useSyariahForm from '../../SyariahForm.hook';

import { AlMurabahahData } from './AlMurabahah.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlMurabahah = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, module, process, existing } = props;
  const { facilityId, processId } = useIdentity();

  const [originalPurchasePrice, setOriginalPurchasePrice] = useState<string>('');
  const [originalCurrencyPurchasePrice, setOriginalCurrencyPurchasePrice] = useState<string>('');
  const [isPurchasePriceUnchanged, setIsPurchasePriceUnchanged] = useState<boolean>(true);

  const {
    masintonForm,
    masintonChange,
    masintonReplace,
    masintonMultiChange,
    masintonReset,
    masintonMagic,
  } = useMasintonForm(AlMurabahahData, validation);

  const {
    calculateTotalSyirkah,
  } = useSyariahForm();

  const {
    currency_purchase_price,
    purchase_price,
    exchange_rate_purchase_price,
    purchase_price_idr,
    currency_down_payment,
    down_payment,
    down_payment_idr,
    exchange_rate_down_payment,
    currency_murabahah_margin,
    murabahah_margin,
    murabahah_margin_idr,
    exchange_rate_murabahah_margin,
    murabahah_installment,
    exchange_rate_murabahah_installment,
    discount,
  } = masintonForm;

  const { data: debtorDetail, isSuccess: isDebtorSuccess } = useGetBucketById({
    bucketProcessId: processId,
    module: module,
    process: process,
  }, { enabled: true });

  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  useEffect(() => {
    if (debtorDetail?.debtorName &&
      (!masintonForm.debtorName.value ||
        masintonForm.debtorName.value !== debtorDetail.debtorName
      ) && isDebtorSuccess) {
      masintonChange('debtorName', debtorDetail.debtorName);
    }
  }, [debtorDetail?.debtorName, masintonForm.debtorName.value, masintonChange, isDebtorSuccess]);

  useEffect(() => {
    if (financingFacilityData && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);
      masintonMagic(newFinancingData);

      const existingPurchasePrice = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'purchase_price')?.attributeValue;
      const existingCurrencyPurchasePrice = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_purchase_price')?.attributeValue;
      const existingExchangeRatePurchasePrice = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_purchase_price')?.attributeValue;

      if (existingPurchasePrice) {
        setOriginalPurchasePrice(existingPurchasePrice.toString());
      }
      if (existingCurrencyPurchasePrice) {
        setOriginalCurrencyPurchasePrice(existingCurrencyPurchasePrice);
      } else if (existingPurchasePrice) {
        setOriginalCurrencyPurchasePrice('IDR');
      }

      // Set the exchange rate from API attribute to ensure consistency
      if (existingExchangeRatePurchasePrice) {
        masintonChange('exchange_rate_purchase_price', existingExchangeRatePurchasePrice);
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

  // Comprehensive useEffect to handle all IDR calculations and auto-fill (similar to AlMusyarakah)
  useEffect(() => {
    let hasAutoFilled = false;

    // Auto-fill exchange rate HANYA jika belum ada nilai
    if (currencyDropdownList && currency_purchase_price.value === 'USD') {
      const exchangeRateFromApi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_purchase_price')?.attributeValue;
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      const finalRate = exchangeRateFromApi || fallbackRate;

      // Auto-fill hanya jika exchange_rate_purchase_price kosong atau 0
      if (finalRate && (!exchange_rate_purchase_price.value || exchange_rate_purchase_price.value === '0')) {
        masintonChange('exchange_rate_purchase_price', finalRate);
        hasAutoFilled = true;
      }
    }

    // Jika baru auto-fill, skip kalkulasi kali ini (biarkan re-render dengan nilai baru)
    if (hasAutoFilled) {
      return;
    }

    // Dapatkan exchange rate yang akan digunakan
    const currentExchangeRate = exchange_rate_purchase_price.value ?
      parseFloat(exchange_rate_purchase_price.value.toString()) : 1;

    // Kalkulasi purchase_price_idr
    if (currency_purchase_price.value === 'USD' && purchase_price.value && currentExchangeRate > 0) {
      const valueAfterExchangeRate = multiplyNominalValues(purchase_price.value, currentExchangeRate.toString());

      // Update purchase_price_idr
      const cleanValue = valueAfterExchangeRate.replaceAll(',', '');
      if (purchase_price_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('purchase_price_idr', cleanValue);
        }, 50);
      }
    } else if (currency_purchase_price.value === 'IDR' && purchase_price_idr.value !== '') {
      masintonChange('purchase_price_idr', '');
    }
  }, [
    purchase_price.value,
    exchange_rate_purchase_price.value,
    currency_purchase_price.value,
    currencyDropdownList,
    financingFacilityData?.attributes,
    purchase_price_idr.value, // Untuk mencegah infinite loop
  ]);

  useEffect(() => {
    if (!down_payment.value || !isDebtorSuccess) return;

    const valueAfterExchangeRate = multiplyNominalValues(down_payment.value, (
      exchange_rate_down_payment.value || '1'));
    masintonChange('down_payment_idr', valueAfterExchangeRate.replaceAll(',', ''));
  }, [down_payment.value, exchange_rate_down_payment.value]);

  useEffect(() => {
    if (!murabahah_margin.value || !isDebtorSuccess) return;

    const valueAfterExchangeRate = multiplyNominalValues(murabahah_margin.value, (
      exchange_rate_murabahah_margin.value || '1'));
    masintonChange('murabahah_margin_idr', valueAfterExchangeRate.replaceAll(',', ''));
  }, [murabahah_margin.value, exchange_rate_murabahah_margin.value]);

  useEffect(() => {
    if (!murabahah_installment.value) return;
    const valueAfterExchangeRate = multiplyNominalValues(murabahah_installment.value, (
      exchange_rate_murabahah_installment.value || '1'));
    masintonChange('murabahah_installment_idr', valueAfterExchangeRate.replaceAll(',', ''));
  }, [murabahah_installment.value, exchange_rate_murabahah_installment.value]);

  useMemo(() => {
    if (!purchase_price.value || !down_payment.value || !isDebtorSuccess) return;

    const valueAfterExchangeRate = calculateTotalSyirkah({
      currency: currency_purchase_price.value === 'IDR' && currency_down_payment.value === 'IDR' ? 'IDR' : 'USD',
      idr: (+purchase_price_idr.value - +((discount.value / 100) * purchase_price_idr.value) -
        +down_payment_idr.value).toString(),
      value: (+purchase_price.value - +((discount.value / 100) * purchase_price.value) -
        +down_payment.value).toString(),
    },
    {
      currency: currency_murabahah_margin.value,
      idr: murabahah_margin_idr.value,
      value: murabahah_margin.value,
    });

    masintonMultiChange({
      currency_selling_price: valueAfterExchangeRate.currency_total_partnership,
      selling_price: valueAfterExchangeRate.total_partnership,
      selling_price_idr: valueAfterExchangeRate.total_partnership_idr,
    });

  }, [
    purchase_price_idr.value,
    down_payment_idr.value,
    purchase_price.value,
    discount.value,
    down_payment.value,
    murabahah_margin_idr.value,
    murabahah_margin.value,
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

export default useAlMurabahah;
