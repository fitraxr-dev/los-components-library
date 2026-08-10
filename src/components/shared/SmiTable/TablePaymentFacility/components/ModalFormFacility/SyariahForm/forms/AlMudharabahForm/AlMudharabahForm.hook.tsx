import { useEffect, useMemo, useState } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { validation } from '../../SyariahForm.constant';

import { AlMudharabahFormData } from './AlMudharabah.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlMudharabah = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, module, process, existing } = props;
  const { facilityId, processId } = useIdentity();

  const [originalMudharabahFund, setOriginalMudharabahFund] = useState<string>('');
  const [originalCurrencyMudharabahFund, setOriginalCurrencyMudharabahFund] = useState<string>('');
  const [isMudharabahFundUnchanged, setIsMudharabahFundUnchanged] = useState<boolean>(true);

  const {
    masintonForm,
    masintonChange,
    masintonReplace,
    masintonMultiChange,
    masintonReset,
    masintonMagic,
  } = useMasintonForm(AlMudharabahFormData, validation);

  const {
    exchange_rate_mudharabah_fund,
    mudharabah_fund,
    mudharabah_fund_idr,
    currency_mudharabah_fund,
  } = masintonForm;

  const { data: debtorDetail, isSuccess: isDebtorSuccess } = useGetBucketById({
    bucketProcessId: processId,
    module: module,
    process: process,
  }, { enabled: true });

  const { data: Dmudharabah_fund_usage_purpose } = useGetParameterList('purposeUsingMusyarakahFunds');
  const { data: Dprofit_share_type } = useGetParameterList('typesProfitSharingRatio');
  const { data: Dprofit_share_review } = useGetParameterList('reviewProfitSharingRatio');
  const { data: Dfund_usage_purpose } = useGetParameterList('purposeUsingMusyarakahFunds');
  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
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

      const existingMudharabahFund = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'mudharabah_fund')?.attributeValue;
      const existingCurrencyMudharabahFund = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_mudharabah_fund')?.attributeValue;

      if (existingMudharabahFund) {
        setOriginalMudharabahFund(existingMudharabahFund.toString());
      }
      if (existingCurrencyMudharabahFund) {
        setOriginalCurrencyMudharabahFund(existingCurrencyMudharabahFund);
      } else if (existingMudharabahFund) {
        setOriginalCurrencyMudharabahFund('IDR');
      }

      setIsMudharabahFundUnchanged(true);

      return () => clearTimeout(timer);
    }
  }, [financingFacilityData, facilityId]);

  useEffect(() => {
    if (originalMudharabahFund !== '') {
      const normalizeValue = (value: string) => {
        if (!value) return '0';
        const numValue = parseFloat(value.replace(/,/g, ''));
        return isNaN(numValue) ? '0' : numValue.toString();
      };

      const normalizedOriginal = normalizeValue(originalMudharabahFund);
      const normalizedCurrent = normalizeValue(mudharabah_fund.value || '');
      const isValueUnchanged = normalizedCurrent === normalizedOriginal;
      const isCurrencyUnchanged = currency_mudharabah_fund.value === (originalCurrencyMudharabahFund || 'IDR');

      // For edit mode: check if existing_core_mudharabah_fund is different from mudharabah_fund
      if (facilityId && !existing) {
        // Edit mode: compare existing_core_mudharabah_fund with current mudharabah_fund
        const existingMudharabahFund = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_mudharabah_fund')?.attributeValue ||
          financingFacilityData?.attributes?.find((attr) =>
            attr.attributeKey === 'mudharabah_fund')?.attributeValue;
        const existingCurrencyMudharabahFund = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_currency_mudharabah_fund')?.attributeValue ||
          financingFacilityData?.attributes?.find((attr) =>
            attr.attributeKey === 'currency_mudharabah_fund')?.attributeValue;

        const existingValue = existingMudharabahFund ? parseFloat(existingMudharabahFund.toString().replace(/,/g, '')) : 0;
        const currentValue = parseFloat(mudharabah_fund.value?.toString().replace(/,/g, '') || '0');
        const existingCurrency = existingCurrencyMudharabahFund || 'IDR';
        const currentCurrency = currency_mudharabah_fund.value || 'IDR';

        // Check if values or currencies are different (checkbox should be unchecked if different)
        const isValueDifferent = existingValue !== currentValue;
        const isCurrencyDifferent = existingCurrency !== currentCurrency;
        const isUnchanged = !isValueDifferent && !isCurrencyDifferent;
        setIsMudharabahFundUnchanged(isUnchanged);
      } else {
        // For add existing mode: normal logic
        setIsMudharabahFundUnchanged(isValueUnchanged && isCurrencyUnchanged);
      }
    } else if (financingFacilityData) {
      setIsMudharabahFundUnchanged(true);
    }
  }, [
    mudharabah_fund.value,
    currency_mudharabah_fund.value,
    originalMudharabahFund,
    originalCurrencyMudharabahFund,
    financingFacilityData,
    facilityId,
    existing,
  ]);

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
    if (currencyDropdownList && financingFacilityData) {
      const currentCurrency = currency_mudharabah_fund.value || 'IDR';
      const isIdr = currentCurrency === 'IDR';
      const isRateEmptyOrOne = !exchange_rate_mudharabah_fund.value || exchange_rate_mudharabah_fund.value === '1';

      if (isIdr) {
        if (exchange_rate_mudharabah_fund.value !== '1') {
          masintonChange('exchange_rate_mudharabah_fund', '1');
        }
      } else if (isRateEmptyOrOne) {
        const exchangeRateFromApi = financingFacilityData?.exchangeRate;
        const fallbackRate = currencyDropdownList.find((item) => item.value === currentCurrency)?.rate;
        const finalRate = exchangeRateFromApi || fallbackRate;

        if (finalRate && finalRate !== exchange_rate_mudharabah_fund.value) {
          masintonChange('exchange_rate_mudharabah_fund', finalRate);
        }
      }
    }
  }, [currencyDropdownList,
    financingFacilityData,
    exchange_rate_mudharabah_fund.value,
    currency_mudharabah_fund.value]);

  // UseEffect khusus untuk kalkulasi mudharabah_fund_idr saat exchange rate sudah tersedia
  useEffect(() => {
    if (currency_mudharabah_fund.value === 'USD' && mudharabah_fund.value && exchange_rate_mudharabah_fund.value) {
      const currentExchangeRate = parseFloat(exchange_rate_mudharabah_fund.value.toString());
      if (currentExchangeRate > 0) {
        const valueAfterMudharabahFund = multiplyNominalValues(
          mudharabah_fund.value,
          currentExchangeRate.toString()
        );
        const cleanValue = valueAfterMudharabahFund.replaceAll(',', '');
        if (mudharabah_fund_idr.value !== cleanValue) {
          masintonChange('mudharabah_fund_idr', cleanValue);
        }
      }
    }
  }, [
    mudharabah_fund.value,
    exchange_rate_mudharabah_fund.value,
    currency_mudharabah_fund.value,
    mudharabah_fund_idr.value
  ]);

  useEffect(() => {
    if (debtorDetail?.debtorName &&
      (!masintonForm.debtorName.value ||
        masintonForm.debtorName.value !== debtorDetail.debtorName
      ) && isDebtorSuccess) {
      masintonChange('debtorName', debtorDetail.debtorName);
    }
  }, [debtorDetail?.debtorName, masintonForm.debtorName.value, masintonChange]);


  useEffect(() => {
    return () => masintonReset();
  }, []);

  return {
    Dfund_usage_purpose,
    Dmudharabah_fund_usage_purpose,
    Dprofit_share_review,
    Dprofit_share_type,
    currencyDropdownList,
    governmentMandateList,
    isMudharabahFundUnchanged,
    masintonChange,
    masintonForm,
    masintonMagic,
    masintonMultiChange,
    masintonReplace,
    masintonReset,
  };
};

export default useAlMudharabah;
