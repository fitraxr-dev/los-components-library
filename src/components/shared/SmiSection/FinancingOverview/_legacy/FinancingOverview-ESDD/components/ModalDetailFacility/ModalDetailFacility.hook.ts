import { multiplyNominalValues } from '@/helpers/utils';

import useGetDetailFinancingFacility from '../../hooks/useGetDetailFinancingFacility';

import {
  cellDataSyariah,
  proyekCellDataSyariah,
  cellDataKoven,
  proyekCellDataKoven,
} from './ModalDetailFacility.constants';


const useDetailFacility = (id, facilityId?, bucketProcessId?) => {
  const { data: financingFacilityData } = useGetDetailFinancingFacility({ bucketProcessId, facilityId, id } as any);

  const processCellValue = (item: any, data: any, exchangeRateValue: any) => {
    let value = data?.[item.key];

    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      value = '-';
    }

    if (item.label === 'Nominal Pembiayaan') {
      const currency = data?.currencyOrderValue || '';
      const orderValue = data?.orderValue || '';
      value = currency && orderValue ? `${currency} ${orderValue}` : '-';
    }

    if (item.label === 'Nilai Proyek') {
      const projectValue = data?.[item.key];
      if (projectValue === null || projectValue === '' || (Array.isArray(projectValue) && projectValue.length === 0)) {
        value = '-';
      } else {
        value = `${data?.curValue || 'IDR'} ${projectValue}`;
      }
    }

    if (item.label === 'Nominal Pengajuan (dalam Rp)') {
      value = multiplyNominalValues(value, exchangeRateValue) || '-';
    }

    return value;
  };

  const handleProjectCells = (result: any[], data: any, exchangeRateValue: any) => {
    if (data?.curValue === 'USD') {
      const exchangeRateCell = {
        key: 'exchangeRate',
        label: 'Exchange Rate',
        value: exchangeRateValue || '-',
      };

      const valueAfterExchangeRate = {
        key: 'orderValueAfterExchangeRate',
        label: 'Nominal Pengajuan (dalam Rp)',
        value: multiplyNominalValues(data?.['value'], data?.['exchangeRate']) || '-',
      };

      // Insert cells after the 'cityLabel' cell
      const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
      if (cityLabelIndex !== -1) {
        result.splice(cityLabelIndex + 1, 0, exchangeRateCell);
      }

      // Insert cells after the 'districtLabel' cell
      const districtLabelIndex = result.findIndex((item) => item.key === 'districtLabel');
      if (districtLabelIndex !== -1) {
        result.splice(districtLabelIndex + 1, 0, valueAfterExchangeRate);
      }
    } else {
      // Insert empty cell after the 'cityLabel' cell for non-USD
      const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
      if (cityLabelIndex !== -1) {
        result.splice(cityLabelIndex + 1, 0, {});
      }
    }
  };

  const handleFacilityCells = (result: any[], data: any, exchangeRateValue: any, financingSegment: string) => {
    if (financingSegment === 'SYARIAH') {
      // Handle USD currency for SYARIAH
      if (data?.currencyOrderValue === 'USD') {
        const exchangeRateCell = {
          key: 'exchangeRate',
          label: 'Exchange Rate',
          value: exchangeRateValue || '-',
        };

        const valueAfterExchangeRate = {
          key: 'orderValueAfterExchangeRate',
          label: 'Nominal Pengajuan (dalam Rp)',
          value: 'IDR ' + (multiplyNominalValues(data?.['orderValue'], exchangeRateValue) || '-'),
        };

        const currencyIndex = result.findIndex((item) => item.key === 'timePeriod');
        if (currencyIndex !== -1) {
          result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
        }
      }

      // Handle existing facility for SYARIAH
      if (data?.orderType === 'NEW_FROM_EXISTING_FACILITY') {
        const os = {
          key: 'osValue',
          label: 'O/S',
          value: data?.outstanding ?? '-',
        };

        const kolektibilitas = {
          key: 'collectibility',
          label: 'Kolektibilitas',
          value: data?.collectabilityLabel ?? '-',
        };

        const characteristicIndex = result.findIndex((item) => item.key === 'characteristic');
        if (characteristicIndex !== -1) {
          result.splice(characteristicIndex + 1, 0, os, kolektibilitas);
        }

        if (data?.currencyOutstanding === 'USD') {
          const osDalamRp = {
            key: 'osValueAfterExchangeRate',
            label: 'O/S (dalam Rp)',
            value: data?.outstandingIdr ?? '-',
          };

          const collectibilityIndex = result.findIndex((item) => item.key === 'collectibility');
          if (collectibilityIndex !== -1) {
            result.splice(collectibilityIndex + 1, 0, osDalamRp, {});
          }
        }
      }
    } else {
      // Handle USD currency for non-SYARIAH
      if (data?.currencyOrderValue === 'USD') {
        const exchangeRateCell = {
          key: 'exchangeRate',
          label: 'Exchange Rate',
          value: exchangeRateValue || '-',
        };

        const valueAfterExchangeRate = {
          key: 'orderValueAfterExchangeRate',
          label: 'Nominal Pengajuan (dalam Rp)',
          value: multiplyNominalValues(data?.['orderValue'], exchangeRateValue) || '-',
        };

        const currencyIndex = result.findIndex((item) => item.key === 'timePeriod');
        if (currencyIndex !== -1) {
          result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
        }
      }

      // Handle existing facility for non-SYARIAH
      if (data?.orderType === 'NEW_FROM_EXISTING_FACILITY') {
        const os = {
          key: 'osValue',
          label: 'O/S',
          value: data?.outstanding ?? '-',
        };

        const kolektibilitas = {
          key: 'collectibility',
          label: 'Kolektibilitas',
          value: data?.collectabilityLabel ?? '-',
        };

        const characteristicIndex = result.findIndex((item) => item.key === 'governmentMandateLabel');
        if (characteristicIndex !== -1) {
          result.splice(characteristicIndex + 1, 0, os, kolektibilitas);
        }

        if (data?.currencyOutstanding === 'USD') {
          const osDalamRp = {
            key: 'osValueAfterExchangeRate',
            label: 'O/S (dalam Rp)',
            value: data?.outstandingIdr ?? '-',
          };

          const collectibilityIndex = result.findIndex((item) => item.key === 'collectibility');
          if (collectibilityIndex !== -1) {
            result.splice(collectibilityIndex + 1, 0, osDalamRp, {});
          }
        }
      }
    }
  };

  const mapCellData = (type: 'facility' | 'project', data: any, cellData: any[]) => {
    // If data is null or undefined, return all cells with "-" values
    if (!data) {
      return cellData.map((item) => ({ ...item, value: '-' }));
    }

    const exchangeRateValue = data?.['exchangeRate'];
    const result = cellData.map((item) => ({
      ...item,
      value: processCellValue(item, data, exchangeRateValue),
    }));

    // Handle type-specific logic
    if (type === 'project') {
      handleProjectCells(result, data, exchangeRateValue);
    } else if (type === 'facility') {
      handleFacilityCells(result, data, exchangeRateValue, financingFacilityData?.financingSegment);
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
