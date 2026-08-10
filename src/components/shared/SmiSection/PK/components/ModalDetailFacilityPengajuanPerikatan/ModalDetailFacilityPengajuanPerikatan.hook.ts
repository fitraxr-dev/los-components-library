import { toDateStringNumber } from '@/helpers/date';
import { multiplyNominalValues } from '@/helpers/utils';

import useGetDetailFinancingFacility from '../../hooks/useGetDetailFinancingFacility';
import useGetDetailFinancingPk from '../../hooks/useGetDetailFinancingPk';

import {
  cellDataKoven,
  cellDataSyariah,
  InformationPK,
  proyekCellDataKoven,
  proyekCellDataSyariah,
} from './ModalDetailFacilityPengajuanPerikatan.constants';


const useDetailFacilityPengajuanPerikatan = (id) => {
  const { data: financingFacilityData } = useGetDetailFinancingFacility({ id });
  const { data: financingPk } = useGetDetailFinancingPk({ financingFacilityId: id });


  const mapCellData = (type: 'facility' | 'project', data: any, cellData: any[]) => {
    const exchangeRateValue = data?.['exchangeRate'];
    const result = cellData.map((item) => {
      let value = data?.[item.key];

      if (item.label === 'Nominal Pembiayaan') {
        value = data?.currencyOrderValue + ' ' + data?.orderValue;
      }
      if (item.label === 'Nominal Pembiayaan (dalam Rp)') {
        value = data?.currencyOrderValue + ' ' + data?.orderValue;
      }

      if (item.label === 'Nilai Proyek') {
        if (value === null || value === undefined) {
          value = '-';
        } else {
          value = (data?.curValue || 'IDR') + ' ' + value;
        }
      }

      if (item.label === 'Tanggal Update Data') {
        if (value === null || value === undefined) {
          value = '-';
        } else {
          value = toDateStringNumber(value);
        }
      }

      if (item.label === 'Masa Penarikan') {
        if (value === null || value === undefined) {
          value = '-';
        } else {
          value = toDateStringNumber(value);
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
        // Check if currencyType is USD and insert a new cell for exchange rate
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

          // Insert the new cell after the 'cityLabel' cell
          const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
          result.splice(cityLabelIndex + 1, 0, exchangeRateCell);

          // Insert the new cell after the 'exchangeRate' cell
          const districtLabelIndex = result.findIndex((item) => item.key === 'districtLabel');
          result.splice(districtLabelIndex + 1, 0, valueAfterExchangeRate);
        }

      default:
        if (financingFacilityData?.financingSegment === 'SYARIAH') {
          // Check if currencyType is USD and insert a new cell for exchange rate
          if (data?.currencyOrderValue === 'USD') {
            const exchangeRateCell = {
              key: 'exchangeRate',
              label: 'Exchange Rate',
              value: exchangeRateValue || '-',
            };

            const valueAfterExchangeRate = {
              key: 'orderValueAfterExchangeRate',
              label: 'Nominal Pengajuan (dalam Rp)',
              value: 'IDR' + ' ' + multiplyNominalValues(data?.['orderValue'], exchangeRateValue) || '-',
            };

            // Insert the new cell after the 'Currency' cell
            const currencyIndex = result.findIndex((item) => item.key === 'timePeriod');
            result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
          }


          if (data?.orderType === 'NEW_FROM_EXISTING_FACILITY') {

            const os = {
              key: 'osValue',
              label: 'O/S',
              value: data?.outstanding,
            };

            const kolektibilitas = {
              key: 'collectibility',
              label: 'Kolektibilitas',
              value: data?.collectabilityLabel,
            };
            // Insert the new cell after the 'Currency' cell
            const characteristicIndex = result.findIndex((item) => item.key === 'characteristic');
            result.splice(characteristicIndex + 1, 0, os, kolektibilitas);

            if (data?.currencyOutstanding === 'USD') {

              const osDalamRp = {
                key: 'osValueAfterExchangeRate',
                label: 'O/S (dalam Rp)',
                value: data?.outstandingIdr,
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
              value: exchangeRateValue || '-',
            };

            const valueAfterExchangeRate = {
              key: 'orderValueAfterExchangeRate',
              label: 'Nominal Pengajuan (dalam Rp)',
              value: multiplyNominalValues(data?.['orderValue'], exchangeRateValue) || '-',
            };

            // Insert the new cell after the 'Jangka Waktu' cell
            const currencyIndex = result.findIndex((item) => item.key === 'timePeriod');
            result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
          }

          if (data?.orderType === 'NEW_FROM_EXISTING_FACILITY') {
            const os = {
              key: 'osValue',
              label: 'O/S',
              value: data?.outstanding,
            };

            const kolektibilitas = {
              key: 'collectibility',
              label: 'Kolektibilitas',
              value: data?.collectabilityLabel,
            };
            // Insert the new cell after the 'Currency' cell
            const characteristicIndex = result.findIndex((item) => item.key === 'governmentMandateLabel');
            result.splice(characteristicIndex + 1, 0, os, kolektibilitas);

            if (data?.currencyOutstanding === 'USD') {
              const osDalamRp = {
                key: 'osValueAfterExchangeRate',
                label: 'O/S (dalam Rp)',
                value: data?.outstandingIdr,
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
  const isSyariah = financingFacilityData?.financingSegment === 'SYARIAH';
  const facilityData = mapCellData('facility', financingFacilityData, (isSyariah ? cellDataSyariah : cellDataKoven));
  const projectData = mapCellData('project', financingFacilityData?.project, (isSyariah ? proyekCellDataSyariah : proyekCellDataKoven));
  const pk = mapCellData('facility', financingPk, InformationPK);

  return {
    facilityData,
    isSyariah,
    pk,
    projectData,
  };
};

export default useDetailFacilityPengajuanPerikatan;
