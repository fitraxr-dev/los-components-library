import { multiplyNominalValues } from '@/helpers/utils';

import useGetDetailFinancingFacility from '../../hooks/useGetDetailFinancingFacility';

import {
  cellDataSyariah,
  proyekCellDataSyariah,
  cellDataKoven,
  proyekCellDataKoven,
} from './ModalDetailFacility.constants';


const useDetailFacility = (id, facilityId, bucketProcessId) => {
  const { data: financingFacilityData } = useGetDetailFinancingFacility({ bucketProcessId, facilityId, id });

  const getSafeValue = (value: any, defaultValue: string = '-'): string => {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    return value;
  };

  const mapCellData = (type: 'facility' | 'project', data: any, cellData: any[]) => {
    const exchangeRateValue = data?.['exchangeRate'];
    const result = cellData.map((item) => {
      let value = data?.[item.key];

      value = getSafeValue(value);

      if (item.label === 'Nominal Pembiayaan') {
        const currency = getSafeValue(data?.currencyOrderValue, '');
        const orderValue = getSafeValue(data?.orderValue, '');
        value = currency && orderValue ? `${currency} ${orderValue}` : '-';
      }

      if (item.label === 'Nilai Proyek') {
        const curValue = getSafeValue(data?.curValue, 'IDR');
        value = value !== '-' ? `${curValue} ${value}` : '-';
      }

      if (item.label === 'Nominal Pengajuan (dalam Rp)') {
        value = multiplyNominalValues(data?.[item.key], exchangeRateValue);
        value = getSafeValue(value);
      }

      if (item.label === '') {
        value = '';
      }
      return { ...item, value };
    });

    switch (type) {
      case 'project':
        // Check if currencyType is USD and insert a new cell for exchange rate
        if (data?.curValue === 'USD') {
          const exchangeRateCell = {
            key: 'exchangeRate',
            label: 'Exchange Rate',
            value: getSafeValue(exchangeRateValue),
          };

          const valueAfterExchangeRate = {
            key: 'orderValueAfterExchangeRate',
            label: 'Nominal Pengajuan (dalam Rp)',
            value: getSafeValue(multiplyNominalValues(data?.['value'], data?.['exchangeRate'])),
          };

          // Insert the new cell after the 'cityLabel' cell
          const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
          result.splice(cityLabelIndex + 1, 0, exchangeRateCell);

          // Insert the new cell after the 'exchangeRate' cell
          const districtLabelIndex = result.findIndex((item) => item.key === 'districtLabel');
          result.splice(districtLabelIndex + 1, 0, valueAfterExchangeRate);
        } else {
          // Insert the new cell after the 'cityLabel' cell
          const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
          result.splice(cityLabelIndex + 1, 0, {});
        }
        break;

      default:
        if (financingFacilityData?.financingSegment === 'SYARIAH') {
          // Check if currencyType is USD and insert a new cell for exchange rate
          if (data?.currencyOrderValue === 'USD') {
            const exchangeRateCell = {
              key: 'exchangeRate',
              label: 'Exchange Rate',
              value: getSafeValue(exchangeRateValue),
            };

            const valueAfterExchangeRate = {
              key: 'orderValueAfterExchangeRate',
              label: 'Nominal Pengajuan (dalam Rp)',
              value: getSafeValue('IDR' + ' ' + multiplyNominalValues(data?.['orderValue'], exchangeRateValue)),
            };

            // Insert the new cell after the 'Currency' cell
            const currencyIndex = result.findIndex((item) => item.key === 'timePeriod');
            result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
          }

          if (data?.orderType === 'NEW_FROM_EXISTING_FACILITY') {
            const os = {
              key: 'osValue',
              label: 'O/S',
              value: getSafeValue(data?.outstanding),
            };

            const kolektibilitas = {
              key: 'collectibility',
              label: 'Kolektibilitas',
              value: getSafeValue(data?.collectabilityLabel),
            };
            // Insert the new cell after the 'Currency' cell
            const characteristicIndex = result.findIndex((item) => item.key === 'characteristic');
            result.splice(characteristicIndex + 1, 0, os, kolektibilitas);

            if (data?.currencyOutstanding === 'USD') {
              const osDalamRp = {
                key: 'osValueAfterExchangeRate',
                label: 'O/S (dalam Rp)',
                value: getSafeValue(data?.outstandingIdr),
              };
              // Insert the new cell after the 'Currency' cell
              const collectibilityIndex = result.findIndex((item) => item.key === 'collectibility');
              result.splice(collectibilityIndex + 1, 0, osDalamRp, {});
            }
          }
        } else {
          // Check if currencyType is USD and insert a new cell for exchange rate
          if (data?.currencyOrderValue === 'USD') {
            const exchangeRateCell = {
              key: 'exchangeRate',
              label: 'Exchange Rate',
              value: getSafeValue(exchangeRateValue),
            };

            const valueAfterExchangeRate = {
              key: 'orderValueAfterExchangeRate',
              label: 'Nominal Pengajuan (dalam Rp)',
              value: getSafeValue(multiplyNominalValues(data?.['orderValue'], exchangeRateValue)),
            };

            // Insert the new cell after the 'Jangka Waktu' cell
            const currencyIndex = result.findIndex((item) => item.key === 'timePeriod');
            result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
          }

          if (data?.orderType === 'NEW_FROM_EXISTING_FACILITY') {
            const os = {
              key: 'osValue',
              label: 'O/S',
              value: getSafeValue(data?.outstanding),
            };

            const kolektibilitas = {
              key: 'collectibility',
              label: 'Kolektibilitas',
              value: getSafeValue(data?.collectabilityLabel),
            };
            // Insert the new cell after the 'Currency' cell
            const characteristicIndex = result.findIndex((item) => item.key === 'governmentMandateLabel');
            result.splice(characteristicIndex + 1, 0, os, kolektibilitas);

            if (data?.currencyOutstanding === 'USD') {
              const osDalamRp = {
                key: 'osValueAfterExchangeRate',
                label: 'O/S (dalam Rp)',
                value: getSafeValue(data?.outstandingIdr),
              };
              // Insert the new cell after the 'Currency' cell
              const collectibilityIndex = result.findIndex((item) => item.key === 'collectibility');
              result.splice(collectibilityIndex + 1, 0, osDalamRp, {});
            }
          }
        }

    }

    return result;
  };

  const facilityData = mapCellData('facility', financingFacilityData, (financingFacilityData?.financingSegment === 'SYARIAH' ? cellDataSyariah : cellDataKoven));
  const projectData = mapCellData('project', financingFacilityData?.project, (financingFacilityData?.financingSegment === 'SYARIAH' ? proyekCellDataSyariah : proyekCellDataKoven));

  return {
    facilityData,
    projectData,
  };
};

export default useDetailFacility;
