import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import { additionalFormData, bottomSectionFormData, facilityFormData } from './AlQardh.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlQardh = (props: SyariahFormsProps) => {
  const { financingFacilityData } = props;
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  const mapCellData = (data: any, cellData: any[]) => {

    const result = cellData.map((item) => {
      let value = data?.[item.key];

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
export default useAlQardh;
