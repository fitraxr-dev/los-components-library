import { useEffect, useMemo, useState } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { validation } from '../../SyariahForm.constant';

import { AlQardhData } from './AlQardh.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlQardh = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, module, process, existing } = props;
  const { facilityId, processId } = useIdentity();

  const [originalAlQardhLoanAmount, setOriginalAlQardhLoanAmount] = useState<string>('');
  const [originalCurrencyAlQardhLoanAmount, setOriginalCurrencyAlQardhLoanAmount] = useState<string>('');
  const [isAlQardhLoanAmountUnchanged, setIsAlQardhLoanAmountUnchanged] = useState<boolean>(true);
  const {
    masintonForm,
    masintonChange,
    masintonReplace,
    masintonReset,
    masintonMultiChange,
    masintonMagic,
  } = useMasintonForm(AlQardhData, validation);

  const {
    al_qardh_loan_amount,
    currency_al_qardh_loan_amount,
    exchange_rate_al_qardh_loan,
    al_qardh_loan_amount_idr,
    administration_fee,
    currency_administration_fee,
    exchange_rate_administration_fee,
    administration_fee_idr,
    installment_value,
    currency_installment_value,
    exchange_rate_installment,
    installment_value_idr,
  } = masintonForm;

  const { data: debtorDetail, isSuccess: isDebtorSuccess } = useGetBucketById({
    bucketProcessId: processId,
    module: module,
    process: process,
  }, { enabled: true });

  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');

  const { data: Dloan_payment_method } = useGetParameterList('howToPayLoan');

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

      const existingAlQardhLoanAmount = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'al_qardh_loan_amount')?.attributeValue;
      const existingCurrencyAlQardhLoanAmount = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_al_qardh_loan_amount')?.attributeValue;

      if (existingAlQardhLoanAmount) {
        setOriginalAlQardhLoanAmount(existingAlQardhLoanAmount.toString());
      }
      if (existingCurrencyAlQardhLoanAmount) {
        setOriginalCurrencyAlQardhLoanAmount(existingCurrencyAlQardhLoanAmount);
      } else if (existingAlQardhLoanAmount) {
        setOriginalCurrencyAlQardhLoanAmount('IDR');
      }

      setIsAlQardhLoanAmountUnchanged(true);

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

  // UseEffect untuk inisialisasi exchange rate saat pertama kali modal dibuka
  useEffect(() => {
    if (currencyDropdownList && financingFacilityData) {
      const initRate = (field: string, currField: string, attrKey: string) => {
        const currentCurrency = masintonForm[currField].value || 'IDR';
        const isIdr = currentCurrency === 'IDR';
        const isRateEmptyOrOne = !masintonForm[field].value || masintonForm[field].value === '1';

        if (isIdr) {
          if (masintonForm[field].value !== '1') {
            masintonChange(field, '1');
          }
        } else if (isRateEmptyOrOne) {
          const exchangeRateFromApi = financingFacilityData?.attributes?.find((attr) =>
            attr.attributeKey === attrKey)?.attributeValue || financingFacilityData?.exchangeRate;
          const fallbackRate = currencyDropdownList.find((item) => item.value === currentCurrency)?.rate;
          const finalRate = exchangeRateFromApi || fallbackRate;

          if (finalRate && finalRate !== masintonForm[field].value) {
            masintonChange(field, finalRate.toString());
          }
        }
      };

      initRate('exchange_rate_al_qardh_loan', 'currency_al_qardh_loan_amount', 'exchange_rate_al_qardh_loan');
      initRate('exchange_rate_administration_fee', 'currency_administration_fee', 'exchange_rate_administration_fee');
      initRate('exchange_rate_installment', 'currency_installment_value', 'exchange_rate_installment');
    }
  }, [
    currencyDropdownList,
    financingFacilityData,
    exchange_rate_al_qardh_loan.value,
    currency_al_qardh_loan_amount.value,
    exchange_rate_administration_fee.value,
    currency_administration_fee.value,
    exchange_rate_installment.value,
    currency_installment_value.value,
  ]);

  useEffect(() => {
    if (debtorDetail?.debtorName &&
      (!masintonForm.debtorName.value ||
        masintonForm.debtorName.value !== debtorDetail.debtorName
      ) && isDebtorSuccess) {
      masintonChange('debtorName', debtorDetail.debtorName);
    }
  }, [debtorDetail?.debtorName, masintonForm.debtorName.value, masintonChange]);

  // UseEffect khusus untuk kalkulasi al_qardh_loan_amount_idr saat exchange rate sudah tersedia
  useEffect(() => {
    if (currency_al_qardh_loan_amount.value === 'USD' && al_qardh_loan_amount.value && exchange_rate_al_qardh_loan.value) {
      const currentExchangeRate = parseFloat(exchange_rate_al_qardh_loan.value.toString());
      if (currentExchangeRate > 0) {
        const valueAfterLoanAmount = multiplyNominalValues(al_qardh_loan_amount.value, currentExchangeRate.toString());
        const cleanValue = valueAfterLoanAmount.replaceAll(',', '');
        if (al_qardh_loan_amount_idr.value !== cleanValue) {
          masintonChange('al_qardh_loan_amount_idr', cleanValue);
        }
      }
    }
  }, [
    al_qardh_loan_amount.value,
    exchange_rate_al_qardh_loan.value,
    currency_al_qardh_loan_amount.value,
    al_qardh_loan_amount_idr.value
  ]);

  // UseEffect untuk kalkulasi administration_fee_idr
  useEffect(() => {
    // Dapatkan exchange rate yang akan digunakan - gunakan fallback jika belum ada
    let currentExchangeRate = 1;
    if (exchange_rate_administration_fee.value) {
      currentExchangeRate = parseFloat(exchange_rate_administration_fee.value.toString());
    } else if (currencyDropdownList) {
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      if (fallbackRate) {
        currentExchangeRate = parseFloat(fallbackRate.toString());
      }
    }

    if (currency_administration_fee.value === 'USD' && administration_fee.value && currentExchangeRate > 0) {
      const valueAfterAdminFee = multiplyNominalValues(administration_fee.value, currentExchangeRate.toString());
      const cleanValue = valueAfterAdminFee.replaceAll(',', '');
      if (administration_fee_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('administration_fee_idr', cleanValue);
        }, 50);
      }
    } else if (currency_administration_fee.value === 'IDR' && administration_fee_idr.value !== '') {
      masintonChange('administration_fee_idr', '');
    }
  }, [
    administration_fee.value,
    exchange_rate_administration_fee.value,
    currency_administration_fee.value,
    administration_fee_idr.value,
    currencyDropdownList
  ]);

  // UseEffect untuk kalkulasi installment_value_idr
  useEffect(() => {
    // Dapatkan exchange rate yang akan digunakan - gunakan fallback jika belum ada
    let currentExchangeRate = 1;
    if (exchange_rate_installment.value) {
      currentExchangeRate = parseFloat(exchange_rate_installment.value.toString());
    } else if (currencyDropdownList) {
      const fallbackRate = currencyDropdownList.find((item) => item.value === 'USD')?.rate;
      if (fallbackRate) {
        currentExchangeRate = parseFloat(fallbackRate.toString());
      }
    }

    if (currency_installment_value.value === 'USD' && installment_value.value && currentExchangeRate > 0) {
      const valueAfterInstallment = multiplyNominalValues(installment_value.value, currentExchangeRate.toString());
      const cleanValue = valueAfterInstallment.replaceAll(',', '');
      if (installment_value_idr.value !== cleanValue) {
        setTimeout(() => {
          masintonChange('installment_value_idr', cleanValue);
        }, 50);
      }
    } else if (currency_installment_value.value === 'IDR' && installment_value_idr.value !== '') {
      masintonChange('installment_value_idr', '');
    }
  }, [
    installment_value.value,
    exchange_rate_installment.value,
    currency_installment_value.value,
    installment_value_idr.value,
    currencyDropdownList
  ]);

  useEffect(() => {
    if (originalAlQardhLoanAmount !== '') {
      const normalizeValue = (value: string) => {
        if (!value) return '0';
        const numValue = parseFloat(value.replace(/,/g, ''));
        return isNaN(numValue) ? '0' : numValue.toString();
      };

      const normalizedOriginal = normalizeValue(originalAlQardhLoanAmount);
      const normalizedCurrent = normalizeValue(al_qardh_loan_amount.value || '');
      const isValueUnchanged = normalizedCurrent === normalizedOriginal;
      const isCurrencyUnchanged = currency_al_qardh_loan_amount.value === (originalCurrencyAlQardhLoanAmount || 'IDR');

      // For edit mode: check if existing_core_al_qardh_loan_amount is different from al_qardh_loan_amount
      if (facilityId && !existing) {
        // Edit mode: compare existing_core_al_qardh_loan_amount with current al_qardh_loan_amount
        const existingAlQardhLoanAmount = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_al_qardh_loan_amount')?.attributeValue ||
          financingFacilityData?.attributes?.find((attr) =>
            attr.attributeKey === 'al_qardh_loan_amount')?.attributeValue;
        const existingCurrencyAlQardhLoanAmount = financingFacilityData?.attributes?.find((attr) =>
          attr.attributeKey === 'existing_core_currency_al_qardh_loan_amount')?.attributeValue ||
          financingFacilityData?.attributes?.find((attr) =>
            attr.attributeKey === 'currency_al_qardh_loan_amount')?.attributeValue;

        const existingValue = existingAlQardhLoanAmount ? parseFloat(existingAlQardhLoanAmount.toString().replace(/,/g, '')) : 0;
        const currentValue = parseFloat(al_qardh_loan_amount.value?.toString().replace(/,/g, '') || '0');
        const existingCurrency = existingCurrencyAlQardhLoanAmount || 'IDR';
        const currentCurrency = currency_al_qardh_loan_amount.value || 'IDR';

        // Check if values or currencies are different (checkbox should be unchecked if different)
        const isValueDifferent = existingValue !== currentValue;
        const isCurrencyDifferent = existingCurrency !== currentCurrency;
        const isUnchanged = !isValueDifferent && !isCurrencyDifferent;
        setIsAlQardhLoanAmountUnchanged(isUnchanged);
      } else {
        // For add existing mode: normal logic
        setIsAlQardhLoanAmountUnchanged(isValueUnchanged && isCurrencyUnchanged);
      }
    } else if (financingFacilityData) {
      setIsAlQardhLoanAmountUnchanged(true);
    }
  }, [
    al_qardh_loan_amount.value,
    currency_al_qardh_loan_amount.value,
    originalAlQardhLoanAmount,
    originalCurrencyAlQardhLoanAmount,
    financingFacilityData,
    facilityId,
    existing,
  ]);

  useEffect(() => {
    return () => masintonReset();
  }, []);


  return {
    Dloan_payment_method,
    currencyDropdownList,
    governmentMandateList,
    isAlQardhLoanAmountUnchanged,
    masintonChange,
    masintonForm,
    masintonMagic,
    masintonMultiChange,
    masintonReplace,
    masintonReset,
  };
};

export default useAlQardh;
