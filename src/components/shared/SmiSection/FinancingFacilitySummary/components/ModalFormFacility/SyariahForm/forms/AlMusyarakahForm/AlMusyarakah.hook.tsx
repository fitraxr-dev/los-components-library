import { useEffect } from 'react';

import Modules from '@/enums/Modules';
import { sumNominalValues, multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useFinancingSegment from '@/hooks/useFinancingSegment';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { AlMusyarakahData } from './AlMusyarakah.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlMusyarakah = (props: SyariahFormsProps) => {
  const { debiturName } = useIdentity();
  const { onChangeSyariahForm, financingFacilityData, facilityId } = props;

  const { data: Dprofit_share_type } = useGetParameterList('typesProfitSharingRatio');
  const { data: Dprofit_share_review } = useGetParameterList('reviewProfitSharingRatio');
  const { data: Dfund_usage_purpose } = useGetParameterList('purposeUsingMusyarakahFunds');
  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  const _financingSegment = useFinancingSegment();
  const _formData = Object.assign(AlMusyarakahData, { financingSegment: { value: _financingSegment } });

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
    currency_partnership_smi: { value: currency_partnership_smi },
    partnership_smi_idr: { value: partnership_smi_idr },
    partnership_smi: { value: partnership_smi },
    exchange_rate_partnership_smi: { value: exchange_rate_partnership_smi },
  } = masintonForm;


  useEffect(() => {
    const new_partnership_smi_idr = multiplyNominalValues(partnership_smi, exchange_rate_partnership_smi);
    masintonChange('partnership_smi_idr', new_partnership_smi_idr);
  }, [partnership_smi, exchange_rate_partnership_smi]);

  useEffect(() => {
    const new_partnership_customer_idr =
    multiplyNominalValues(partnership_customer, exchange_rate_partnership_customer);
    masintonChange('partnership_customer_idr', new_partnership_customer_idr);
  }, [partnership_customer, exchange_rate_partnership_customer]);

  useEffect(() => {
    const idr_partnership_smi = currency_partnership_smi === 'USD' ? partnership_smi_idr : partnership_smi;
    const idr_partnership_customer = currency_partnership_customer === 'USD' ? partnership_customer_idr : partnership_customer;
    const new_total_partnership = sumNominalValues(idr_partnership_smi, idr_partnership_customer);
    masintonChange('total_partnership', new_total_partnership);
  }, [partnership_smi_idr, partnership_customer_idr]);

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
    masintonChange('partnership_smi_partner', debiturName);
  }, [debiturName]);

  useEffect(() => {
    return () => masintonReset();
  }, []);

  return {
    Dfund_usage_purpose,
    Dprofit_share_review,
    Dprofit_share_type,
    currencyDropdownList,
    governmentMandateList,
    masintonChange,
    masintonForm,
    masintonMultiChange,
  };
};

export default useAlMusyarakah;
