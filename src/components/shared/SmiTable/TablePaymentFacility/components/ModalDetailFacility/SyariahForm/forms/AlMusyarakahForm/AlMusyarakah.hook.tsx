import { useEffect, useMemo } from 'react';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import useSyariahForm from '../../../../ModalFormFacility/SyariahForm/SyariahForm.hook';

import { facilityFormData, additionalFormData, bottomSectionFormData } from './AlMusyarakah.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlMusyarakah = (props: SyariahFormsProps) => {
  const { financingFacilityData } = props;

  const { calculateTotalSyirkah } = useSyariahForm();
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  const mapCellData = (data: any, cellData: any[]) => {

    const result = cellData.map((item) => {
      let value = data?.[item.key];

      if (value?.includes('OTHER')) {
        const dataKey = `other_${item.key}`;
        value = data[dataKey];
      } else if (item.value) {
        value = data[item.value];
      }

      if (value === null || value === undefined) {
        value = '-';
      }

      if (item.label === '') {
        value = '';
      }

      return { ...item, value };
    });

    return result;
  };

  const totalPartnership = useMemo(() => calculateTotalSyirkah({
    currency: financingFacilityData?.currency_partnership_smi,
    idr: financingFacilityData?.partnership_smi_idr,
    value: financingFacilityData.partnership_smi,
  },
  {
    currency: financingFacilityData?.currency_partnership_customer,
    idr: financingFacilityData?.partnership_customer_idr,
    value: financingFacilityData.partnership_customer,
  }), [financingFacilityData]);

  const facilityData = mapCellData(financingFacilityData, facilityFormData);
  const additionalData = mapCellData(financingFacilityData, additionalFormData);
  const bottomSectionData = mapCellData(financingFacilityData, bottomSectionFormData);

  return {
    additionalData,
    bottomSectionData,
    currencyDropdownList,
    facilityData,
    financingFacilityData,
    totalPartnership,
  };

};

export default useAlMusyarakah;
