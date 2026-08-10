import { toDateStringNumber } from '@/helpers/date';
import { multiplyNominalValues } from '@/helpers/utils';

import useGetDetailFinancingFacility from '../../hooks/useGetDetailFinancingFacility';
import useGetDetailFinancingPk from '../../hooks/useGetDetailFinancingPk';

import {
  cellDataKoven,
  cellDataSyariah,
  PkCell,
  proyekCellDataKoven,
  proyekCellDataSyariah,
} from './ModalDetailFacilityPk.constants';
import { getSyariahFieldCellsSeparated } from './ModalDetailFacilityPkSyariah.constants';


function formatNumberWithCommas(value: number): string {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function getDebtorLabel(product: string): string {
  switch (product) {
    case 'AL_IJARAH':
    case 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ':
    case 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT':
      return 'Penyewa/Musta\'jir';
    case 'AL_MUDHARABAH':
      return 'Mudharib/Nasabah';
    default:
      return 'Mitra Syarik SMI';
  }
}

const useDetailFacility = (id: number, facilityId?: string, processId?: string, isLps?: boolean) => {
  const { data: financingFacilityData } = useGetDetailFinancingFacility({
    bucketProcessId: processId || null,
    facilityId: facilityId || null,
    id: id || null,
  });
  const { data: financingPk } = useGetDetailFinancingPk(
    isLps ? { facilityId } : { financingFacilityId: id }
  );


  const mapCellData = (type: 'facility' | 'project', data: any, cellData: any[]) => {
    const exchangeRateValue = data?.['exchangeRate'];
    const isSyariahSegment = data?.financingSegment === 'SYARIAH';

    if (type === 'facility' && isSyariahSegment) {
      const baseCells = [
        { key: 'orderTypeLabel', label: 'Order Type', value: data?.orderTypeLabel || '-' },
        { key: 'financingSegmentLabel', label: 'Segmen Pembiayaan', value: data?.financingSegmentLabel || '-' },
        { key: 'mappingOrderTypeLabel', label: 'Mapping Order Type', value: data?.mappingOrderTypeLabel || '-' },
        { key: 'mappingFinancingSegment', label: 'CORE Mapping Segmen Pembiayaan', value: data?.mappingFinancingSegmentLabel || '-' },
        { key: 'productLabel', label: 'Skema Pembiayaan', value: data?.productLabel || '-' },
        { key: 'mappingProductLabel', label: 'CORE Mapping Produk', value: data?.mappingProductLabel || '-' },
        { key: 'outstanding', label: 'O/S', value: data?.outstanding || '-' },
        {
          key: 'debtorName',
          label: getDebtorLabel(data?.product),
          value: data?.debtorName || '-',
        },
      ];

      const { informationCells, nominalCells } = getSyariahFieldCellsSeparated(
        data?.product,
        data?.attributes,
        data?.governmentMandateLabel,
        data?.remark
      );

      return {
        information: [...baseCells, ...informationCells],
        nominal: nominalCells,
      };
    }

    const result = cellData.map((item) => {
      let value = data?.[item.key];

      if (item.key === 'mappingProduct') {
        value = data?.mappingProductLabel;
      }

      if (item.key === 'mappingProduct') {
        value = data?.mappingProductLabel;
      }

      if (item.key === 'mappingFinancingSegment') {
        value = data?.mappingFinancingSegmentLabel;
      }

      if (item.label === 'Nominal Pembiayaan') {
        if (isSyariahSegment) {
          const totalOrderValue = data?.totalOrderValue || 0;
          value = data?.currencyOrderValue + ' ' + formatNumberWithCommas(totalOrderValue);
        } else {
          value = data?.currencyOrderValue + ' ' + data?.orderValue;
        }
      }
      if (item.label === 'Nominal Pembiayaan (dalam Rp)') {
        if (isSyariahSegment) {
          const totalOrderValue = data?.totalOrderValue || 0;
          value = data?.currencyOrderValue + ' ' + formatNumberWithCommas(totalOrderValue);
        } else {
          value = data?.currencyOrderValue + ' ' + data?.orderValue;
        }
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
          value = value;
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
  const facilityDataResult = mapCellData('facility', financingFacilityData, (isSyariah ? cellDataSyariah : cellDataKoven));

  const facilityData = isSyariah && typeof facilityDataResult === 'object' && 'information' in facilityDataResult
    ? facilityDataResult.information
    : facilityDataResult;

  const nominalData = isSyariah && typeof facilityDataResult === 'object' && 'nominal' in facilityDataResult
    ? facilityDataResult.nominal
    : [];

  const projectData = mapCellData('project', financingFacilityData?.project, (isSyariah ? proyekCellDataSyariah : proyekCellDataKoven));
  const pkData = mapCellData('facility', financingPk, PkCell);

  return {
    facilityData,
    isSyariah,
    nominalData,
    pkData,
    projectData,
  };
};

export default useDetailFacility;
