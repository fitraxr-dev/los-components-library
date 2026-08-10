import { useEffect } from 'react';


import Modules from '@/enums/Modules';
import { sumNominalValues, multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useFinancingSegment from '@/hooks/useFinancingSegment';
import useMasintonForm from '@/hooks/useMasintonForm';

import { AlMusyarakahMuntanaqisahData } from './AlMusyarakahMuntanaqisah.form';

import type { SyariahFormsProps } from '../forms.type';


const AlMusyarakahMuntanaqisah = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, existing, facilityId } = props;

  const { data: Dprofit_share_type } = useGetParameterList('typesProfitSharingRatio');
  const { data: Dprofit_share_review } = useGetParameterList('reviewProfitSharingRatio');
  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
  const { data: Dujroh_review_type } = useGetParameterList('rentReview');
  const { data: Dujroh_review_period } = useGetParameterList('rentReviewPeriod');
  const { data: Dujroh_payment_period } = useGetParameterList('rentReviewPeriod');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });


  const _financingSegment = useFinancingSegment();
  const _formData = Object.assign(AlMusyarakahMuntanaqisahData, { financingSegment: { value: _financingSegment } });


  const {
    masintonForm,
    masintonChange,
    masintonMultiChange,
    masintonMagic,
    masintonReplace,
    masintonReset,
  } = useMasintonForm(_formData);


  const {
    currency_partnership_customer: { value: currency_partnership_customer },
    partnership_customer_idr: { value: partnership_customer_idr },
    partnership_customer: { value: partnership_customer },
    exchange_rate_partnership_customer: { value: exchange_rate_partnership_customer },
    currency_partnership_smi_facility: { value: currency_partnership_smi_facility },
    partnership_smi_facility_idr: { value: partnership_smi_facility_idr },
    partnership_smi_facility: { value: partnership_smi_facility },
    exchange_rate_partnership_smi_facility: { value: exchange_rate_partnership_smi_facility },
    currency_ujroh_value: { value: currency_ujroh_value },
    ujroh_value_idr: { value: ujroh_value_idr },
    ujroh_value: { value: ujroh_value },
    exchange_rate_ujroh: { value: exchange_rate_ujroh },
    currency_hishshah_value: { value: currency_hishshah_value },
    hishshah_value_idr: { value: hishshah_value_idr },
    hishshah_value: { value: hishshah_value },
    exchange_rate_hishshah: { value: exchange_rate_hishshah },
  } = masintonForm;

  useEffect(() => {
    const new_partnership_smi_facility_idr =
    multiplyNominalValues(partnership_smi_facility, exchange_rate_partnership_smi_facility);
    masintonChange('partnership_smi_facility_idr', new_partnership_smi_facility_idr);
  }, [partnership_smi_facility, exchange_rate_partnership_smi_facility]);

  useEffect(() => {
    const new_partnership_customer_idr =
    multiplyNominalValues(partnership_customer, exchange_rate_partnership_customer);
    masintonChange('partnership_customer_idr', new_partnership_customer_idr);
  }, [partnership_customer, exchange_rate_partnership_customer]);

  useEffect(() => {
    const new_ujroh_value_idr = multiplyNominalValues(ujroh_value, exchange_rate_ujroh);
    masintonChange('ujroh_value_idr', new_ujroh_value_idr);
  }, [ujroh_value, exchange_rate_ujroh]);

  useEffect(() => {
    const new_hishshah_value_idr = multiplyNominalValues(hishshah_value, exchange_rate_hishshah);
    masintonChange('hishshah_value_idr', new_hishshah_value_idr);
  }, [hishshah_value, exchange_rate_hishshah]);

  useEffect(() => {
    const idr_partnership_smi_facility = currency_partnership_smi_facility === 'USD' ? partnership_smi_facility_idr : partnership_smi_facility;
    const idr_partnership_customer = currency_partnership_customer === 'USD' ? partnership_customer_idr : partnership_customer;
    const idr_ujroh_value = currency_ujroh_value === 'USD' ? ujroh_value_idr : ujroh_value;
    const idr_hishshah_value = currency_hishshah_value === 'USD' ? hishshah_value_idr : hishshah_value;
    const new_total_partnership1 = sumNominalValues(idr_partnership_smi_facility, idr_partnership_customer);
    const new_total_ujrohHishah = sumNominalValues(idr_ujroh_value, idr_hishshah_value);
    const new_total = sumNominalValues(new_total_partnership1, new_total_ujrohHishah);
    masintonChange('total_partnership', new_total);
  }, [
    partnership_smi_facility_idr,
    partnership_customer_idr,
    ujroh_value_idr,
    hishshah_value_idr
  ]);

  useEffect(() => {
    if (financingFacilityData && facilityId) {
      const newFinancingData = structuredClone(financingFacilityData);
      const masintonData = Object.assign(newFinancingData, {
        projectId: financingFacilityData.project?.id,
      });
      masintonMagic(masintonData);
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
    masintonChange,
    masintonForm,
    masintonMultiChange,
  };
};

export default AlMusyarakahMuntanaqisah;
