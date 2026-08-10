import { useEffect, useMemo, useState } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { validation } from '../../SyariahForm.constant';

import { ImfzFormData } from './ImfzForm.form';

import type { SyariahFormsProps } from '../forms.type';


const useImfz = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, existing, facilityId } = props;
  // const { facilityId, processId } = useIdentity();

  const [originalFacilityValue, setOriginalFacilityValue] = useState<string>('');
  const [originalCurrencyFacilityValue, setOriginalCurrencyFacilityValue] = useState<string>('');
  const [isFacilityValueUnchanged, setIsFacilityValueUnchanged] = useState<boolean>(true);

  const {
    masintonForm,
    masintonChange,
    masintonReplace,
    masintonReset,
    masintonMagic,
    masintonMultiChange,
  } = useMasintonForm(ImfzFormData, validation);

  const {
    facility_value,
    exchange_rate_facility_value,
    facility_value_idr,
    ujroh_value,
    exchange_rate_ujroh,
    ujroh_value_idr,
    currency_facility_value,
    currency_ujroh_value,
    financing_period,
  } = masintonForm;

  const { data: Dprofit_share_type } = useGetParameterList('typesProfitSharingRatio');
  const { data: Dprofit_share_review } = useGetParameterList('reviewProfitSharingRatio');
  const { data: Dujroh_review_type } = useGetParameterList('rentReview');
  const { data: Dujroh_review_period } = useGetParameterList('rentReviewPeriod');
  const { data: Dujroh_payment_period } = useGetParameterList('rentPaymentPeriod');
  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  useEffect(() => {
    if (financingFacilityData && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);
      masintonMagic(newFinancingData);

      const existingFacilityValue = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'facility_value')?.attributeValue;
      const existingCurrencyFacilityValue = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_facility_value')?.attributeValue;

      if (existingFacilityValue) {
        setOriginalFacilityValue(existingFacilityValue.toString());
      }
      if (existingCurrencyFacilityValue) {
        setOriginalCurrencyFacilityValue(existingCurrencyFacilityValue);
      } else if (existingFacilityValue) {
        setOriginalCurrencyFacilityValue('IDR');
      }

      setIsFacilityValueUnchanged(true);
    }
  }, [financingFacilityData]);

  useEffect(() => {
    if (financing_period?.value) {
      masintonChange('timePeriod', financing_period.value);
    }
  }, [financing_period?.value]);

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
    if (currencyDropdownList && financingFacilityData && !exchange_rate_facility_value.value) {
      const exchangeRateFromApi = financingFacilityData?.exchangeRate;
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      const finalRate = exchangeRateFromApi || fallbackRate;

      if (finalRate) {
        masintonChange('exchange_rate_facility_value', finalRate);
      }
    }
  }, [currencyDropdownList, financingFacilityData, exchange_rate_facility_value.value]);

  // UseEffect khusus untuk kalkulasi facility_value_idr saat exchange rate sudah tersedia
  useEffect(() => {
    if (currency_facility_value.value === 'USD' && facility_value.value && exchange_rate_facility_value.value) {
      const currentExchangeRate = parseFloat(exchange_rate_facility_value.value.toString());
      if (currentExchangeRate > 0) {
        const valueAfterFacilityValue = multiplyNominalValues(facility_value.value, currentExchangeRate.toString());
        const cleanValue = valueAfterFacilityValue.replaceAll(',', '');
        if (facility_value_idr.value !== cleanValue) {
          masintonChange('facility_value_idr', cleanValue);
        }
      }
    }
  }, [
    facility_value.value,
    exchange_rate_facility_value.value,
    currency_facility_value.value,
    facility_value_idr.value
  ]);

  // UseEffect untuk kalkulasi ujroh_value_idr
  useEffect(() => {
    // Dapatkan exchange rate yang akan digunakan - gunakan fallback jika belum ada
    let currentExchangeRate = 1;
    if (exchange_rate_ujroh.value) {
      currentExchangeRate = parseFloat(exchange_rate_ujroh.value.toString());
    } else if (currencyDropdownList) {
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      if (fallbackRate) {
        currentExchangeRate = parseFloat(fallbackRate.toString());
      }
    }

    if (currency_ujroh_value.value === 'USD' && ujroh_value.value && currentExchangeRate > 0) {
      const valueAfterUjroh = multiplyNominalValues(ujroh_value.value, currentExchangeRate.toString());
      const cleanValue = valueAfterUjroh.replaceAll(',', '');
      if (ujroh_value_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('ujroh_value_idr', cleanValue);
        }, 50);
      }
    } else if (currency_ujroh_value.value === 'IDR' && ujroh_value_idr.value !== '') {
      masintonChange('ujroh_value_idr', '');
    }
  }, [
    ujroh_value.value,
    exchange_rate_ujroh.value,
    currency_ujroh_value.value,
    ujroh_value_idr.value,
    currencyDropdownList
  ]);

  useEffect(() => {
    if (originalFacilityValue !== '') {
      const normalizeValue = (value: string) => {
        if (!value) return '0';
        const numValue = parseFloat(value.replace(/,/g, ''));
        return isNaN(numValue) ? '0' : numValue.toString();
      };

      const normalizedOriginal = normalizeValue(originalFacilityValue);
      const normalizedCurrent = normalizeValue(facility_value.value || '');
      const isValueUnchanged = normalizedCurrent === normalizedOriginal;
      const isCurrencyUnchanged = currency_facility_value.value === (originalCurrencyFacilityValue || 'IDR');

      // For edit mode: check if existing_core_facility_value is different from facility_value
      if (facilityId && !existing) {
        // Edit mode: compare existing_core_facility_value with current facility_value
        const existingFacilityValue = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_facility_value')?.attributeValue ||
          financingFacilityData?.attributes?.find((attr) =>
            attr.attributeKey === 'facility_value')?.attributeValue;
        const existingCurrencyFacilityValue = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_currency_facility_value')?.attributeValue ||
          financingFacilityData?.attributes?.find((attr) =>
            attr.attributeKey === 'currency_facility_value')?.attributeValue;

        const existingValue = existingFacilityValue ? parseFloat(existingFacilityValue.toString().replace(/,/g, '')) : 0;
        const currentValue = parseFloat(facility_value.value?.toString().replace(/,/g, '') || '0');
        const existingCurrency = existingCurrencyFacilityValue || 'IDR';
        const currentCurrency = currency_facility_value.value || 'IDR';

        // Check if values or currencies are different (checkbox should be unchecked if different)
        const isValueDifferent = existingValue !== currentValue;
        const isCurrencyDifferent = existingCurrency !== currentCurrency;
        const isUnchanged = !isValueDifferent && !isCurrencyDifferent;
        setIsFacilityValueUnchanged(isUnchanged);
      } else {
        // For add existing mode: normal logic
        setIsFacilityValueUnchanged(isValueUnchanged && isCurrencyUnchanged);
      }
    } else if (financingFacilityData) {
      setIsFacilityValueUnchanged(true);
    }
  }, [
    facility_value.value,
    currency_facility_value.value,
    originalFacilityValue,
    originalCurrencyFacilityValue,
    financingFacilityData,
    facilityId,
    existing,
  ]);


  useEffect(() => {
    return () => masintonReset();
  }, []);


  return {
    Dprofit_share_review,
    Dprofit_share_type,
    Dujroh_payment_period,
    Dujroh_review_period,
    Dujroh_review_type,
    currencyDropdownList,
    governmentMandateList,
    isFacilityValueUnchanged,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    masintonReplace,
    masintonReset,
  };
};

export default useImfz;
