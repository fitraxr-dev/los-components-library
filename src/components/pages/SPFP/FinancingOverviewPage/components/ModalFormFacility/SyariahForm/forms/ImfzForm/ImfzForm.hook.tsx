import { useEffect } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useFinancingSegment from '@/hooks/useFinancingSegment';
import useMasintonForm from '@/hooks/useMasintonForm';

import { ImfzFormData } from './ImfzForm.form';

import type { SyariahFormsProps } from '../forms.type';


const Imfz = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, facilityId } = props;

  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
  const { data: Dujroh_review_type } = useGetParameterList('rentReview');
  const { data: Dujroh_review_period } = useGetParameterList('rentReviewPeriod');
  const { data: Dujroh_payment_period } = useGetParameterList('rentReviewPeriod');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });


  const _financingSegment = useFinancingSegment();
  const _formData = Object.assign(ImfzFormData, { financingSegment: { value: _financingSegment } });


  const {
    masintonForm,
    masintonChange,
    masintonMultiChange,
    masintonMagic,
    masintonReplace,
    masintonReset,
  } = useMasintonForm(_formData);


  const {
    facility_value: { value: facility_value },
    exchange_rate_facility_value: { value: exchange_rate_facility_value },
    ujroh_value: { value: ujroh_value },
    exchange_rate_ujroh: { value: exchange_rate_ujroh },
  } = masintonForm;


  useEffect(() => {
    const new_facility_value_idr =
    multiplyNominalValues(facility_value, exchange_rate_facility_value);
    masintonChange('facility_value_idr', new_facility_value_idr);
  }, [facility_value, exchange_rate_facility_value]);

  useEffect(() => {
    const new_ujroh_value_idr = multiplyNominalValues(ujroh_value, exchange_rate_ujroh);
    masintonChange('ujroh_value_idr', new_ujroh_value_idr);
  }, [ujroh_value, exchange_rate_ujroh]);


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

export default Imfz;
