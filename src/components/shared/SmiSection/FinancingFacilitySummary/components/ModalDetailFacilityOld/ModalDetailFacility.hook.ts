import { multiplyNominalValues } from '@/helpers/utils';

import useGetFinancingFacility from '../../hooks/useGetFinancingFacility';

import { cellData, proyekCellData } from './ModalDetailFacility.constants';


const useDetailFacility = (props: SmiComponentProps) => {
  const { id } = props;
  const { data: financingFacilityData } = useGetFinancingFacility({ id: Number(id) });
  const mapCellData = (type: 'facility' | 'project', data: any, cellData: any[]) => {
    const exchangeRateValue = data?.['exchangeRate'];
    const result = cellData.map((item) => {
      let value = data?.[item.key];

      if (item.label === 'Nominal Pengajuan') {
        value = (data?.currencyOrderValue ? data?.currencyOrderValue : 'IDR') + ' ' + data?.orderValue;
      }

      if (item.label === 'Nilai Proyek') {
        if (value === null || value === undefined) {
          value = '-';
        } else {
          value = (data?.curValue ? data?.curValue : 'IDR') + ' ' + value ;
        }
      }

      if (item.label === 'Nominal Pengajuan (dalam Rp)') {
        value = multiplyNominalValues(value, exchangeRateValue);
      }

      if (value === null || value === undefined) {
        value = '-';
      }

      if (item.label === '') {
        value = '';
      }
      return { ...item, value };
    });


    switch (type) {
      case 'project':
        if (data?.curValue === 'USD') {
          const exchangeRateCell = {
            key: 'exchangeRate',
            label: 'Exchange Rate',
            value: 'IDR' + ' ' + data?.exchangeRate,
          };

          const valueAfterExchangeRate = {
            key: 'orderValueAfterExchangeRate',
            label: 'Nominal Pengajuan (dalam Rp)',
            value: 'IDR' + ' ' + multiplyNominalValues(data?.value, exchangeRateValue),
          };

          const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
          result.splice(cityLabelIndex + 1, 0, exchangeRateCell);

          const districtLabelIndex = result.findIndex((item) => item.key === 'districtLabel');
          result.splice(districtLabelIndex + 1, 0, valueAfterExchangeRate);

        } else {
          const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
          result.splice(cityLabelIndex + 1, 0, {});
        }

      default:
        if (data?.currencyOrderValue === 'USD') {
          const exchangeRateCell = {
            key: 'exchangeRate',
            label: 'Exchange Rate',
            value: 'IDR' + ' ' + exchangeRateValue,
          };

          const valueAfterExchangeRate = {
            key: 'orderValueAfterExchangeRate',
            label: 'Nominal Pengajuan (dalam Rp)',
            value: 'IDR' + ' ' + multiplyNominalValues(data?.orderValue, exchangeRateValue),
          };

          const currencyIndex = result.findIndex((item) => item.key === 'orderValue');
          result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
        }

    }
    return result;
  };

  const facilityData = mapCellData('facility', financingFacilityData, cellData);
  const projectData = mapCellData('project', financingFacilityData?.project, proyekCellData);

  return {
    facilityData,
    projectData,
  };
};

export default useDetailFacility;
