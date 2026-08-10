import { useEffect } from 'react';


import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useFinancingSegment from '@/hooks/useFinancingSegment';
import useMasintonForm from '@/hooks/useMasintonForm';

import { AlQardhData } from './AlQardh.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlQardh = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, existing, facilityId } = props;

  const { data: Dloan_payment_method } = useGetParameterList('howToPayLoan');
  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  const _financingSegment = useFinancingSegment();
  const _formData = Object.assign(AlQardhData, { financingSegment: { value: _financingSegment } });

  const {
    masintonForm,
    masintonChange,
    masintonMultiChange,
    masintonMagic,
    masintonReplace,
    masintonReset,
  } = useMasintonForm(_formData);


  const {
    exchange_rate_al_qardh_loan: { value: exchange_rate_al_qardh_loan },
    al_qardh_loan_amount: { value: al_qardh_loan_amount },
    administration_fee: { value: administration_fee },
    exchange_rate_administration_fee: { value: exchange_rate_administration_fee },
    installment_value: { value: installment_value },
    exchange_rate_installment_value: { value: exchange_rate_installment_value },
  } = masintonForm;

  useEffect(() => {
    const new_al_qardh_loan_amount_idr = multiplyNominalValues(al_qardh_loan_amount, exchange_rate_al_qardh_loan);
    masintonChange('al_qardh_loan_amount_idr', new_al_qardh_loan_amount_idr);
  }, [al_qardh_loan_amount, exchange_rate_al_qardh_loan]);

  useEffect(() => {
    const new_administration_fee_idr =
    multiplyNominalValues(administration_fee, exchange_rate_administration_fee);
    masintonChange('administration_fee_idr', new_administration_fee_idr);
  }, [administration_fee, exchange_rate_administration_fee]);

  useEffect(() => {
    const new_installment_value_idr = multiplyNominalValues(installment_value, exchange_rate_installment_value);
    masintonChange('installment_value_idr', new_installment_value_idr);
  }, [installment_value, exchange_rate_installment_value]);


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
    Dloan_payment_method,
    currencyDropdownList,
    governmentMandateList,
    masintonChange,
    masintonForm,
    masintonMultiChange,
  };
};

export default useAlQardh;
