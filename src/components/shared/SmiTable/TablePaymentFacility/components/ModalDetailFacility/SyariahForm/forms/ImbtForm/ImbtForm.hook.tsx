import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import { additionalFormData, bottomSectionFormData, facilityFormData } from './Imbt.form';

import type { SyariahFormsProps } from '../forms.type';


const useImbt = (props: SyariahFormsProps) => {
  const { financingFacilityData } = props;

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

  const facilityData = mapCellData(financingFacilityData, facilityFormData);
  const additionalData = mapCellData(financingFacilityData, additionalFormData);
  const bottomSectionData = mapCellData(financingFacilityData, bottomSectionFormData);

  return {
    additionalData,
    bottomSectionData,
    currencyDropdownList,
    facilityData,
    financingFacilityData,
  };
};

export default useImbt;
