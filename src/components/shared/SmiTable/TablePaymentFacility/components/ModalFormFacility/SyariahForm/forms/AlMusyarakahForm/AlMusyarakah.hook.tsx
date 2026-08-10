import { useEffect, useMemo, useState } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { validation } from '../../SyariahForm.constant';
import useSyariahForm from '../../SyariahForm.hook';

import { AlMusyarakahData } from './AlMusyarakah.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlMusyarakah = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, module, process, existing } = props;
  const { facilityId, processId } = useIdentity();

  const [originalPartnershipSmi, setOriginalPartnershipSmi] = useState<string>('');
  const [originalPartnershipCustomer, setOriginalPartnershipCustomer] = useState<string>('');
  const [originalCurrencyPartnershipSmi, setOriginalCurrencyPartnershipSmi] = useState<string>('');
  const [originalCurrencyPartnershipCustomer, setOriginalCurrencyPartnershipCustomer] = useState<string>('');
  const [isPartnershipSmiUnchanged, setIsPartnershipSmiUnchanged] = useState<boolean>(true);
  const [isPartnershipCustomerUnchanged, setIsPartnershipCustomerUnchanged] = useState<boolean>(true);

  const { calculateTotalSyirkah } = useSyariahForm();

  const { data: Dprofit_share_type } = useGetParameterList('typesProfitSharingRatio');
  const { data: Dprofit_share_review } = useGetParameterList('reviewProfitSharingRatio');
  const { data: Dfund_usage_purpose } = useGetParameterList('purposeUsingMusyarakahFunds');
  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');

  const {
    masintonForm,
    masintonChange,
    masintonReplace,
    masintonMultiChange,
    masintonReset,
    masintonMagic,
  } = useMasintonForm(AlMusyarakahData, validation);

  const { data: debtorDetail } = useGetBucketById({
    bucketProcessId: processId,
    module: module,
    process: process,
  }, { enabled: true });

  const {
    exchange_rate_partnership_customer,
    partnership_customer,
    exchange_rate_partnership_smi,
    partnership_smi,
    currency_partnership_customer,
    currency_partnership_smi,
    partnership_customer_idr,
    partnership_smi_idr,
    exchange_rate_global,
  } = masintonForm;

  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });
  useEffect(() => {
    if (financingFacilityData?.id && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);

      const masintonData = Object.assign(newFinancingData, {
        projectId: financingFacilityData.project?.id,
      });

      // Use timeout to avoid potential race condition
      const timer = setTimeout(() => {
        masintonMagic(masintonData);
      }, 300);

      const existingPartnershipSmi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'partnership_smi')?.attributeValue;
      const existingPartnershipCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'partnership_customer')?.attributeValue;
      const existingCurrencyPartnershipSmi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_partnership_smi')?.attributeValue;
      const existingCurrencyPartnershipCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_partnership_customer')?.attributeValue;

      if (existingPartnershipSmi) {
        setOriginalPartnershipSmi(existingPartnershipSmi.toString());
      }
      if (existingPartnershipCustomer) {
        setOriginalPartnershipCustomer(existingPartnershipCustomer.toString());
      }
      if (existingCurrencyPartnershipSmi) {
        setOriginalCurrencyPartnershipSmi(existingCurrencyPartnershipSmi);
      } else if (existingPartnershipSmi) {
        // If we have partnership_smi value but no currency, default to IDR
        setOriginalCurrencyPartnershipSmi('IDR');
      }
      if (existingCurrencyPartnershipCustomer) {
        setOriginalCurrencyPartnershipCustomer(existingCurrencyPartnershipCustomer);
      }

      setIsPartnershipSmiUnchanged(true);
      setIsPartnershipCustomerUnchanged(true);

      return () => clearTimeout(timer);
    }
  }, [financingFacilityData, facilityId]);

  useEffect(() => {
    if (debtorDetail?.debtorName &&
      (!masintonForm.debtorName.value ||
        masintonForm.debtorName.value !== debtorDetail.debtorName
      )) {
      masintonChange('debtorName', debtorDetail.debtorName);
    }
  }, [debtorDetail?.debtorName, masintonForm.debtorName.value, masintonChange]);

  useEffect(() => {
    onChangeSyariahForm(
      {
        masintonChange: masintonChange,
        masintonForm: masintonForm,
        masintonReplace: masintonReplace,
      });
  }, [masintonForm]);

  useEffect(() => {
    if (originalPartnershipSmi !== '') {
      const normalizeValue = (value: string) => {
        if (!value) return '0';
        const numValue = parseFloat(value.replace(/,/g, ''));
        return isNaN(numValue) ? '0' : numValue.toString();
      };

      const normalizedOriginalSmi = normalizeValue(originalPartnershipSmi);
      const normalizedCurrentSmi = normalizeValue(partnership_smi.value || '');
      const isValueUnchangedSmi = normalizedCurrentSmi === normalizedOriginalSmi;
      const isCurrencyUnchangedSmi = currency_partnership_smi.value === (originalCurrencyPartnershipSmi || 'IDR');

      // For edit mode: check if existing_partnership_smi is different from partnership_smi
      if (facilityId && !existing) {
        // Edit mode: compare existing_partnership_smi with current partnership_smi
        const existingPartnershipSmi = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_partnership_smi')?.attributeValue;
        const existingCurrencySmi = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_currency_partnership_smi')?.attributeValue;

        const existingValue = existingPartnershipSmi ? parseFloat(existingPartnershipSmi.toString().replace(/,/g, '')) : 0;
        const currentValue = parseFloat(partnership_smi.value?.toString().replace(/,/g, '') || '0');
        const existingCurrency = existingCurrencySmi || 'IDR';
        const currentCurrency = currency_partnership_smi.value || 'IDR';

        // Check if values or currencies are different (checkbox should be unchecked if different)
        const isValueDifferent = existingValue !== currentValue;
        const isCurrencyDifferent = existingCurrency !== currentCurrency;
        const isUnchanged = !isValueDifferent && !isCurrencyDifferent;
        setIsPartnershipSmiUnchanged(isUnchanged);
      } else {
        // For add existing mode: normal logic
        setIsPartnershipSmiUnchanged(isValueUnchangedSmi && isCurrencyUnchangedSmi);
      }
    } else if (financingFacilityData) {
      setIsPartnershipSmiUnchanged(true);
    } else {
    }
  }, [
    partnership_smi.value,
    originalPartnershipSmi,
    currency_partnership_smi.value,
    originalCurrencyPartnershipSmi,
    financingFacilityData,
    facilityId,
    existing,
  ]);

  useEffect(() => {
    if (originalPartnershipCustomer !== '') {
      const normalizeValue = (value: string) => {
        if (!value) return '0';
        const numValue = parseFloat(value.replace(/,/g, ''));
        return isNaN(numValue) ? '0' : numValue.toString();
      };

      const normalizedOriginalCustomer = normalizeValue(originalPartnershipCustomer);
      const normalizedCurrentCustomer = normalizeValue(partnership_customer.value || '');
      const isValueUnchangedCustomer = normalizedCurrentCustomer === normalizedOriginalCustomer;
      const isCurrencyUnchangedCustomer = currency_partnership_customer.value === originalCurrencyPartnershipCustomer;

      // For edit mode: check if existing_partnership_customer is different from partnership_customer
      if (facilityId && !existing) {
        // Edit mode: compare existing_partnership_customer with current partnership_customer
        const existingPartnershipCustomer = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_partnership_customer')?.attributeValue;
        const existingCurrencyCustomer = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_currency_partnership_customer')?.attributeValue;

        const existingValue = existingPartnershipCustomer ? parseFloat(existingPartnershipCustomer.toString().replace(/,/g, '')) : 0;
        const currentValue = parseFloat(partnership_customer.value?.toString().replace(/,/g, '') || '0');
        const existingCurrency = existingCurrencyCustomer || 'IDR';
        const currentCurrency = currency_partnership_customer.value || 'IDR';

        // Check if values or currencies are different (checkbox should be unchecked if different)
        const isValueDifferent = existingValue !== currentValue;
        const isCurrencyDifferent = existingCurrency !== currentCurrency;
        const isUnchanged = !isValueDifferent && !isCurrencyDifferent;
        setIsPartnershipCustomerUnchanged(isUnchanged);
      } else {
        // For add existing mode: normal logic
        setIsPartnershipCustomerUnchanged(isValueUnchangedCustomer && isCurrencyUnchangedCustomer);
      }
    } else if (financingFacilityData) {
      // If financing facility data exists but no original value, set as unchanged initially
      setIsPartnershipCustomerUnchanged(true);
    }
  }, [
    partnership_customer.value,
    originalPartnershipCustomer,
    currency_partnership_customer.value,
    originalCurrencyPartnershipCustomer,
    financingFacilityData,
    facilityId,
    existing,
  ]);

  // 1. UseEffect untuk handle semua kalkulasi IDR dan auto-fill
  useEffect(() => {
    let hasAutoFilled = false;

    // Auto-fill exchange rate jika belum ada nilai atau nilainya 1 (default IDR)
    if (currencyDropdownList &&
      (currency_partnership_smi.value === 'USD' || currency_partnership_customer.value === 'USD')) {

      const exchangeRateFromApi = financingFacilityData?.exchangeRate;
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      const finalRate = exchangeRateFromApi || fallbackRate;

      // Auto-fill jika exchange_rate_global kosong, 0, atau 1
      if (finalRate && (!exchange_rate_global.value || exchange_rate_global.value === '0' || exchange_rate_global.value === '1')) {
        if (finalRate !== exchange_rate_global.value) {
          masintonChange('exchange_rate_global', finalRate.toString());
          hasAutoFilled = true;
        }
      }
    } else if (currencyDropdownList && currency_partnership_smi.value === 'IDR' && currency_partnership_customer.value === 'IDR') {
      if (exchange_rate_global.value !== '1') {
        masintonChange('exchange_rate_global', '1');
        hasAutoFilled = true;
      }
    }

    // Jika baru auto-fill, skip kalkulasi kali ini (biarkan re-render dengan nilai baru)
    if (hasAutoFilled) {
      return;
    }

    // Dapatkan exchange rate yang akan digunakan
    const currentExchangeRate = exchange_rate_global.value ?
      parseFloat(exchange_rate_global.value.toString()) : 1;

    // Kalkulasi partnership_smi_idr
    if (currency_partnership_smi.value === 'USD' && partnership_smi.value && currentExchangeRate > 0) {
      const valueAfterPartnershipSmi = multiplyNominalValues(partnership_smi.value, currentExchangeRate.toString());

      // Update partnership_smi_idr
      const cleanValue = valueAfterPartnershipSmi.replaceAll(',', '');
      if (partnership_smi_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('partnership_smi_idr', cleanValue);
        }, 50);
      }
    } else if (currency_partnership_smi.value === 'IDR' && partnership_smi_idr.value !== '') {
      masintonChange('partnership_smi_idr', '');
    }

    // Kalkulasi partnership_customer_idr
    if (currency_partnership_customer.value === 'USD' && partnership_customer.value && currentExchangeRate > 0) {
      const valueAfterExchangeRateCustomer = multiplyNominalValues(
        partnership_customer.value,
        currentExchangeRate.toString()
      );

      // Update partnership_customer_idr
      const cleanValue = valueAfterExchangeRateCustomer.replaceAll(',', '');
      if (partnership_customer_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('partnership_customer_idr', cleanValue);
        }, 50);
      }
    } else if (currency_partnership_customer.value === 'IDR' && partnership_customer_idr.value !== '') {
      masintonChange('partnership_customer_idr', '');
    }
  }, [
    partnership_smi.value,
    partnership_customer.value,
    exchange_rate_global.value,
    currency_partnership_smi.value,
    currency_partnership_customer.value,
    currencyDropdownList,
    financingFacilityData?.exchangeRate,
    partnership_smi_idr.value, // Untuk mencegah infinite loop
    partnership_customer_idr.value, // Untuk mencegah infinite loop
  ]);

  // 2. UseEffect terpisah untuk sync exchange_rate_partnership_smi/customer
  useEffect(() => {
    if (exchange_rate_global.value) {
      const rate = exchange_rate_global.value;

      // Update exchange rates untuk smi dan customer
      if (exchange_rate_partnership_smi.value !== rate) {
        masintonChange('exchange_rate_partnership_smi', rate);
      }
      if (exchange_rate_partnership_customer.value !== rate) {
        masintonChange('exchange_rate_partnership_customer', rate);
      }
    }
  }, [exchange_rate_global.value]);

  useEffect(() => {
    if (partnership_smi.value || partnership_customer.value) {
      const valueAfterExchangeRate = calculateTotalSyirkah({
        currency: currency_partnership_smi.value,
        idr: partnership_smi_idr.value,
        value: partnership_smi.value,
      }, {
        currency: currency_partnership_customer.value,
        idr: partnership_customer_idr.value,
        value: partnership_customer.value,
      });
      masintonMultiChange({
        currency_total_partnership: valueAfterExchangeRate.currency_total_partnership,
        total_partnership: valueAfterExchangeRate.total_partnership,
        total_partnership_idr: valueAfterExchangeRate.total_partnership_idr,
      });
    }
  }, [
    partnership_smi_idr.value,
    partnership_smi.value,
    partnership_customer_idr.value,
    partnership_customer.value,
    currency_partnership_smi.value,
    currency_partnership_customer.value
  ]);

  return {
    Dfund_usage_purpose,
    Dprofit_share_review,
    Dprofit_share_type,
    currencyDropdownList,
    financingFacilityData,
    governmentMandateList,
    isPartnershipCustomerUnchanged,
    isPartnershipSmiUnchanged,
    masintonChange,
    masintonForm,
    masintonMagic,
    masintonMultiChange,
    masintonReplace,
    masintonReset,
  };
};

export default useAlMusyarakah;
