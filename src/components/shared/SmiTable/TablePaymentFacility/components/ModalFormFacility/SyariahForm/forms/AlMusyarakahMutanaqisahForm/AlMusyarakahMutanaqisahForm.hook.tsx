import { useEffect, useMemo, useState } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { validation } from '../../SyariahForm.constant';
import useSyariahForm from '../../SyariahForm.hook';

import { AlMusyarakahMutanaqisahData } from './AlMusyarakahMutanaqisah.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlMusyarakahMutanaqisah = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, module, process, existing } = props;
  const { facilityId, processId } = useIdentity();
  const { calculateTotalSyirkah } = useSyariahForm();

  const [originalPartnershipSmiFacility, setOriginalPartnershipSmiFacility] = useState<string>('');
  const [originalCurrencyPartnershipSmiFacility, setOriginalCurrencyPartnershipSmiFacility] = useState<string>('');
  const [originalPartnershipCustomer, setOriginalPartnershipCustomer] = useState<string>('');
  const [originalCurrencyPartnershipCustomer, setOriginalCurrencyPartnershipCustomer] = useState<string>('');
  const [isPartnershipSmiFacilityUnchanged, setIsPartnershipSmiFacilityUnchanged] = useState<boolean>(true);
  const [isPartnershipCustomerUnchanged, setIsPartnershipCustomerUnchanged] = useState<boolean>(true);


  const { data: Dprofit_share_type } = useGetParameterList('typesProfitSharingRatio');
  const { data: Dprofit_share_review } = useGetParameterList('reviewProfitSharingRatio');
  const { data: Dujroh_review_type } = useGetParameterList('rentReview');
  const { data: Dujroh_review_period } = useGetParameterList('rentReviewPeriod');
  const { data: Dujroh_payment_period } = useGetParameterList('rentReviewPeriod');
  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');

  const {
    masintonForm,
    masintonChange,
    masintonReplace,
    masintonReset,
    masintonMultiChange,
    masintonMagic,
  } = useMasintonForm(AlMusyarakahMutanaqisahData, validation);

  const {
    currency_partnership_smi_facility,
    partnership_smi_facility_idr,
    partnership_smi_facility,
    exchange_rate_partnership_smi_facility,
    partnership_customer,
    currency_partnership_customer,
    partnership_customer_idr,
    exchange_rate_partnership_customer,
    hishshah_value,
    exchange_rate_hishshah,
    ujroh_value,
    exchange_rate_ujroh,
    exchange_rate_global,
  } = masintonForm;

  const { data: debtorDetail } = useGetBucketById({
    bucketProcessId: processId,
    module: module,
    process: process,
  }, { enabled: true });

  const { data: currencyDropdownList } = useGetParameterList(
    Modules.CURRENCY,
    {
      label: 'value1',
      rate: 'value2',
      value: 'key',
    });

  useEffect(() => {
    if (debtorDetail?.debtorName &&
      (!masintonForm.debtorName.value ||
        masintonForm.debtorName.value !== debtorDetail.debtorName
      )) {
      masintonChange('debtorName', debtorDetail.debtorName);
    }
  }, [debtorDetail?.debtorName, masintonForm.debtorName.value, masintonChange]);

  useEffect(() => {
    if (financingFacilityData?.id && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);

      // Use timeout to avoid potential race condition
      const timer = setTimeout(() => {
        masintonMagic(newFinancingData);
      }, 300);

      const existingPartnershipSmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'partnership_smi_facility')?.attributeValue;
      const existingCurrencyPartnershipSmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_partnership_smi_facility')?.attributeValue;
      const existingPartnershipCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'partnership_customer')?.attributeValue;
      const existingCurrencyPartnershipCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_partnership_customer')?.attributeValue;

      if (existingPartnershipSmiFacility) {
        setOriginalPartnershipSmiFacility(existingPartnershipSmiFacility.toString());
      }
      if (existingCurrencyPartnershipSmiFacility) {
        setOriginalCurrencyPartnershipSmiFacility(existingCurrencyPartnershipSmiFacility);
      } else if (existingPartnershipSmiFacility) {
        setOriginalCurrencyPartnershipSmiFacility('IDR');
      }

      if (existingPartnershipCustomer) {
        setOriginalPartnershipCustomer(existingPartnershipCustomer.toString());
      }
      if (existingCurrencyPartnershipCustomer) {
        setOriginalCurrencyPartnershipCustomer(existingCurrencyPartnershipCustomer);
      }

      setIsPartnershipSmiFacilityUnchanged(true);
      setIsPartnershipCustomerUnchanged(true);

      return () => clearTimeout(timer);
    }
  }, [financingFacilityData, facilityId]);

  useEffect(() => {
    onChangeSyariahForm(
      {
        masintonChange: masintonChange,
        masintonForm: masintonForm,
        masintonReplace: masintonReplace,
      });
  }, [masintonForm]);

  useEffect(() => {
    return () => masintonReset();
  }, []);

  // 1. UseEffect untuk handle semua kalkulasi IDR dan auto-fill
  useEffect(() => {
    let hasAutoFilled = false;

    if (currencyDropdownList) {
      // Exchange rate global dipake berdua oleh SMI Syirkah dan Nasabah Syirkah
      const isAnyUsd = currency_partnership_smi_facility.value === 'USD' ||
        currency_partnership_customer.value === 'USD';
      const isBothIdr = currency_partnership_smi_facility.value === 'IDR' &&
        currency_partnership_customer.value === 'IDR';

      if (isBothIdr) {
        if (exchange_rate_global.value !== '1') {
          masintonChange('exchange_rate_global', '1');
          hasAutoFilled = true;
        }
      } else if (isAnyUsd) {
        const isRateEmptyOrOne = !exchange_rate_global.value || exchange_rate_global.value === '1';
        if (isRateEmptyOrOne) {
          const exchangeRateFromApi = financingFacilityData?.attributes?.find((attr) =>
            attr.attributeKey === 'exchange_rate_global')?.attributeValue || financingFacilityData?.exchangeRate;
          const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
          const finalRate = exchangeRateFromApi || fallbackRate;
          if (finalRate && finalRate !== exchange_rate_global.value) {
            masintonChange('exchange_rate_global', finalRate.toString());
            hasAutoFilled = true;
          }
        }
      }

      // Hishshah & Ujroh have their own exchange rates
      const initRate = (field: string, currField: string, attrKey: string) => {
        const currentCurrency = masintonForm[currField].value || 'IDR';
        const isIdr = currentCurrency === 'IDR';
        const isRateEmptyOrOne = !masintonForm[field].value || masintonForm[field].value === '1';

        if (isIdr) {
          if (masintonForm[field].value !== '1') {
            masintonChange(field, '1');
            hasAutoFilled = true;
          }
        } else if (isRateEmptyOrOne) {
          const exchangeRateFromApi = financingFacilityData?.attributes?.find((attr) =>
            attr.attributeKey === attrKey)?.attributeValue;
          const fallbackRate = currencyDropdownList.find((item) => item.value === currentCurrency)?.rate;
          const finalRate = exchangeRateFromApi || fallbackRate;
          if (finalRate && finalRate !== masintonForm[field].value) {
            masintonChange(field, finalRate.toString());
            hasAutoFilled = true;
          }
        }
      };

      initRate('exchange_rate_hishshah', 'currency_hishshah_value', 'exchange_rate_hishshah');
      initRate('exchange_rate_ujroh', 'currency_ujroh_value', 'exchange_rate_ujroh');
    }

    // Dapatkan exchange rate yang akan digunakan
    // Hapus koma agar parseFloat tidak terpotong (misal '15,000' menjadi 15)
    const currentExchangeRateStr = exchange_rate_global.value ? exchange_rate_global.value.toString() : '1';
    const currentExchangeRate = parseFloat(currentExchangeRateStr.replace(/,/g, ''));

    // Kalkulasi partnership_smi_facility_idr
    if (currency_partnership_smi_facility.value === 'USD' && partnership_smi_facility.value && currentExchangeRate > 0) {
      const valueAfterPartnershipSmi = multiplyNominalValues(
        partnership_smi_facility.value,
        currentExchangeRateStr // Langsung oper string utuh ke multiplyNominalValues agar koma di-handle di sana
      );

      // Update partnership_smi_facility_idr
      const cleanValue = valueAfterPartnershipSmi.replace(/,/g, '');
      if (partnership_smi_facility_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('partnership_smi_facility_idr', cleanValue);
        }, 50);
      }
    } else if (currency_partnership_smi_facility.value === 'IDR' && partnership_smi_facility_idr.value !== '') {
      masintonChange('partnership_smi_facility_idr', '');
    }

    // Kalkulasi partnership_customer_idr
    if (currency_partnership_customer.value === 'USD' && partnership_customer.value && currentExchangeRate > 0) {
      const valueAfterExchangeRateCustomer = multiplyNominalValues(
        partnership_customer.value,
        currentExchangeRateStr // Langsung oper string utuh ke multiplyNominalValues agar koma di-handle di sana
      );

      // Update partnership_customer_idr
      const cleanValue = valueAfterExchangeRateCustomer.replace(/,/g, '');
      if (partnership_customer_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('partnership_customer_idr', cleanValue);
        }, 50);
      }
    } else if (currency_partnership_customer.value === 'IDR' && partnership_customer_idr.value !== '') {
      masintonChange('partnership_customer_idr', '');
    }
  }, [
    partnership_smi_facility.value,
    partnership_customer.value,
    exchange_rate_global.value,
    currency_partnership_smi_facility.value,
    currency_partnership_customer.value,
    currencyDropdownList,
    financingFacilityData?.exchangeRate,
    partnership_smi_facility_idr.value, // Untuk mencegah infinite loop
    partnership_customer_idr.value, // Untuk mencegah infinite loop
  ]);

  // 2. UseEffect terpisah untuk sync exchange_rate_partnership_smi_facility/customer
  useEffect(() => {
    if (exchange_rate_global.value) {
      const rate = exchange_rate_global.value;

      // Update exchange rates untuk smi_facility dan customer
      if (exchange_rate_partnership_smi_facility.value !== rate) {
        masintonChange('exchange_rate_partnership_smi_facility', rate);
      }
      if (exchange_rate_partnership_customer.value !== rate) {
        masintonChange('exchange_rate_partnership_customer', rate);
      }
    }
  }, [exchange_rate_global.value]);

  useEffect(() => {
    if (originalPartnershipSmiFacility !== '') {
      const normalizeValue = (value: string) => {
        if (!value) return '0';
        const numValue = parseFloat(value.replace(/,/g, ''));
        return isNaN(numValue) ? '0' : numValue.toString();
      };

      const normalizedOriginal = normalizeValue(originalPartnershipSmiFacility);
      const normalizedCurrent = normalizeValue(partnership_smi_facility.value || '');
      const isValueUnchanged = normalizedCurrent === normalizedOriginal;
      const isCurrencyUnchanged = currency_partnership_smi_facility.value === (originalCurrencyPartnershipSmiFacility || 'IDR');

      // For edit mode: check if existing_partnership_smi_facility is different from partnership_smi_facility
      if (facilityId && !existing) {
        // Edit mode: compare existing_partnership_smi_facility with current partnership_smi_facility
        const existingPartnershipSmiFacility = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_partnership_smi_facility')?.attributeValue;
        const existingCurrencySmiFacility = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_currency_partnership_smi_facility')?.attributeValue;

        const existingValue = existingPartnershipSmiFacility ? parseFloat(existingPartnershipSmiFacility.toString().replace(/,/g, '')) : 0;
        const currentValue = parseFloat(partnership_smi_facility.value?.toString().replace(/,/g, '') || '0');
        const existingCurrency = existingCurrencySmiFacility || 'IDR';
        const currentCurrency = currency_partnership_smi_facility.value || 'IDR';

        // Check if values or currencies are different (checkbox should be unchecked if different)
        const isValueDifferent = existingValue !== currentValue;
        const isCurrencyDifferent = existingCurrency !== currentCurrency;
        const isUnchanged = !isValueDifferent && !isCurrencyDifferent;
        setIsPartnershipSmiFacilityUnchanged(isUnchanged);
      } else {
        // For add existing mode: normal logic
        setIsPartnershipSmiFacilityUnchanged(isValueUnchanged && isCurrencyUnchanged);
      }
    } else if (financingFacilityData) {
      setIsPartnershipSmiFacilityUnchanged(true);
    }
  }, [
    partnership_smi_facility.value,
    currency_partnership_smi_facility.value,
    originalPartnershipSmiFacility,
    originalCurrencyPartnershipSmiFacility,
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

      const normalizedOriginal = normalizeValue(originalPartnershipCustomer);
      const normalizedCurrent = normalizeValue(partnership_customer.value || '');
      const isValueUnchanged = normalizedCurrent === normalizedOriginal;
      const isCurrencyUnchanged = currency_partnership_customer.value === originalCurrencyPartnershipCustomer;

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
        setIsPartnershipCustomerUnchanged(isValueUnchanged && isCurrencyUnchanged);
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

  useEffect(() => {
    if (!hishshah_value.value) return;

    const valueAfterExchangeRate = multiplyNominalValues(hishshah_value.value,
      (exchange_rate_hishshah.value || 1));
    masintonChange('hishshah_value_idr', valueAfterExchangeRate.replaceAll(',', ''));
  }, [hishshah_value.value, exchange_rate_hishshah.value]);

  useEffect(() => {
    if (!ujroh_value.value) return;
    const valueAfterExchangeRate = multiplyNominalValues(ujroh_value.value,
      (exchange_rate_ujroh.value || 1));
    masintonChange('ujroh_value_idr', valueAfterExchangeRate.replaceAll(',', ''));
  }, [ujroh_value.value, exchange_rate_ujroh.value]);

  useEffect(() => {
    if (partnership_smi_facility.value || partnership_customer.value) {
      const valueAfterExchangeRate = calculateTotalSyirkah({
        currency: currency_partnership_smi_facility.value,
        idr: partnership_smi_facility_idr.value,
        value: partnership_smi_facility.value,
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
    partnership_smi_facility_idr.value,
    partnership_smi_facility.value,
    partnership_customer_idr.value,
    partnership_customer.value,
    currency_partnership_smi_facility.value,
    currency_partnership_customer.value
  ]);


  return {
    Dprofit_share_review,
    Dprofit_share_type,
    Dujroh_payment_period,
    Dujroh_review_period,
    Dujroh_review_type,
    currencyDropdownList,
    governmentMandateList,
    isPartnershipCustomerUnchanged,
    isPartnershipSmiFacilityUnchanged,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    masintonReplace,
    masintonReset,
  };
};

export default useAlMusyarakahMutanaqisah;
