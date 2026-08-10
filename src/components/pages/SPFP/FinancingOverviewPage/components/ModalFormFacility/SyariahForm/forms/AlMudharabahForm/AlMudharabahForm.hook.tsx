import { useEffect } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { validation } from '../../SyariahForm.constant';

import { AlMudharabahFormData } from './AlMudharabah.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlMudharabah = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData, module, process } = props;
  const { facilityId } = useIdentity();

  const {
    masintonForm,
    masintonChange,
    masintonReplace,
    masintonMultiChange,
    masintonMagic,
  } = useMasintonForm(AlMudharabahFormData, validation);

  const { data: Dmudharabah_fund_usage_purpose } = useGetParameterList('purposeUsingMusyarakahFunds');
  const { data: Dprofit_share_type } = useGetParameterList('typesProfitSharingRatio');
  const { data: Dprofit_share_review } = useGetParameterList('reviewProfitSharingRatio');
  const { data: governmentMandateList } = useGetParameterList('govermentGuarantee');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  const {
    mudharabah_fund: { value: mudharabah_fund },
    exchange_rate_mudharabah_fund: { value: exchange_rate_mudharabah_fund },
  } = masintonForm;

  useEffect(() => {
    const new_mudharabah_fund_idr =
      multiplyNominalValues(mudharabah_fund, exchange_rate_mudharabah_fund);
    masintonChange('mudharabah_fund_idr', new_mudharabah_fund_idr);
  }, [mudharabah_fund, exchange_rate_mudharabah_fund]);

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

  return {
    Dmudharabah_fund_usage_purpose,
    Dprofit_share_review,
    Dprofit_share_type,
    currencyDropdownList,
    governmentMandateList,
    masintonChange,
    masintonForm,
    masintonMultiChange,
  };
};

export default useAlMudharabah;
