import { useMemo } from 'react';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import useSyariahForm from '../../../../ModalFormFacility/SyariahForm/SyariahForm.hook';

import { additionalFormData, bottomSectionFormData, facilityFormData } from './AlMusyarakahMutanaqisah.form';

import type { SyariahFormsProps } from '../forms.type';


const useAlMusyarakahMutanaqisah = (props: SyariahFormsProps) => {
  const { financingFacilityData } = props;
  const { calculateTotalSyirkah } = useSyariahForm();
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });
  const mapCellData = (data: any, cellData: any[], isMoreFields: boolean) => {

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

    if (isMoreFields) {
      if (data?.currencyOrderValue === 'USD') {
        result.splice(8, 3);

        const konversiMataUangCell = {
          key: 'exchange_rate_hishshah',
          label: 'Konversi Mata Uang',
          value: data?.exchange_rate_hishshah ? 'IDR' + ' ' + data?.exchange_rate_hishshah : '-',
        };

        const nilaiHishahLabel = result.findIndex((item) => item.key === 'hishshah_value');
        result.splice(nilaiHishahLabel + 1, 0, konversiMataUangCell);
      }
    }
    return result;
  };

  const totalPartnership = useMemo(() => calculateTotalSyirkah({
    currency: financingFacilityData?.currency_partnership_smi_facility,
    idr: financingFacilityData?.partnership_smi_facility_idr,
    value: financingFacilityData.partnership_smi_facility,
  }, {
    currency: financingFacilityData?.currency_partnership_customer,
    idr: financingFacilityData?.partnership_customer_idr,
    value: financingFacilityData.partnership_customer,
  }), [financingFacilityData]);

  const facilityData = mapCellData(financingFacilityData, facilityFormData, false);
  const additionalData = mapCellData(financingFacilityData, additionalFormData, true);
  const bottomSectionData = mapCellData(financingFacilityData, bottomSectionFormData, false);

  return {
    additionalData,
    bottomSectionData,
    currencyDropdownList,
    facilityData,
    financingFacilityData,
    totalPartnership,
  };

};

export default useAlMusyarakahMutanaqisah;
