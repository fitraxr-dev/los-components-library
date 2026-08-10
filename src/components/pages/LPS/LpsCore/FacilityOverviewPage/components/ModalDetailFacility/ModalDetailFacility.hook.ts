import { useMemo } from 'react';

import Modules from '@/enums/Modules';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';

import useGetFinancingFacility from '@/components/shared/SmiTable/TablePaymentFacility/hooks/useGetFinancingFacility';

import { cellData, conventionalCellData, existingCellData, proyekCellData } from './ModalDetailFacility.constants';


const useDetailFacility = (props: SmiComponentProps) => {
  const { facilityId, processId } = useIdentity();
  const { data: financingFacilityData } = useGetFinancingFacility({ bucketProcessId: processId, facilityId });
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  const isSyariah = useMemo(() => financingFacilityData?.financingSegment === 'SYARIAH', [financingFacilityData]);
  const isExisting = useMemo(() =>
    financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' ||
        financingFacilityData?.orderType === 'EXISTING' ||
        financingFacilityData?.orderType === 'New From Existing',
  [financingFacilityData]);

  const mapCellData = (type: 'facility' | 'project', data: any, baseCellData: any[]) => {
    const exchangeRateValue = data?.['exchangeRate'];
    let currentCellData = [...baseCellData];

    if (type === 'facility' && isExisting) {
      const remarkIndex = currentCellData.findIndex((item) => item.key === 'remark');
      if (remarkIndex !== -1) {
        currentCellData.splice(remarkIndex, 0, ...existingCellData);
      } else {
        currentCellData.push(...existingCellData);
      }
    }

    const result = currentCellData.map((item) => {
      let value = data?.[item.key];

      if (item.label === 'Nominal Pengajuan' || item.label === 'Nominal Pembiayaan') {
        const formattedValue = data?.totalOrderValue
          ? Number(data.totalOrderValue).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
          : '0.00';
        value = (data?.currencyOrderValue ? data?.currencyOrderValue : 'IDR') + ' ' + formattedValue;
      }

      if (item.label === 'Nilai Proyek') {
        if (value === null || value === undefined) {
          value = '-';
        } else {

          // Check if value is numeric and format it
          const formattedValue = !isNaN(Number(value))
            ? Number(value).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
            : value;

          value = (data?.curValue ? data?.curValue : 'IDR') + ' ' + formattedValue;
        }
      }

      if (item.label === 'Nominal Pengajuan (dalam Rp)' || item.label === 'Nilai Pembiayaan (dalam Rp)') {
      }

      // O/S logic
      if (item.key === 'outstanding') {
        const formattedValue = value
          ? Number(value).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
          : '0.00';
        const currency = data?.currencyOutstanding || data?.currencyOrderValue || 'IDR';
        value = currency + ' ' + formattedValue;
      }

      if (item.label === 'Nilai Proyek (dalam Rp)') {
        if (value === null || value === undefined) {
          value = '-';
        } else {
          // Format value
          const formattedValue = !isNaN(Number(value))
            ? Number(value).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
            : value;

          value = 'IDR ' + formattedValue;
        }
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
            label: 'Konversi Mata Uang',
            value: data?.exchangeRate ? 'IDR' + ' ' + data?.exchangeRate : '-',
          };

          const cityLabelIndex = result.findIndex((item) => item.key === 'provinceLabel');
          if (cityLabelIndex !== -1) result.splice(cityLabelIndex, 0, exchangeRateCell);
        } else {
        }

        break;
      default:
        // Facility logic (Currency handling)
        if (data?.currencyOrderValue === 'USD') {
          const exchangeRateCell = {
            key: 'exchangeRate',
            label: 'Exchange Rate',
            value: 'IDR' + ' ' + exchangeRateValue,
          };

          const valueAfterExchangeRate = {
            key: 'orderValueAfterExchangeRate',
            label: 'Nilai Pembiayaan (dalam Rp)',
            value: 'IDR' + ' ' + multiplyNominalValues(data?.orderValue, exchangeRateValue),
          };

          const currencyIndex = result.findIndex((item) => item.label === 'Nominal Pembiayaan' || item.label === 'Nominal Pengajuan');
          if (currencyIndex !== -1) {
            result.splice(currencyIndex + 1, 0, exchangeRateCell, valueAfterExchangeRate);
          }
        }

        // Existing USD logic
        if (isExisting && data?.currencyOutstanding === 'USD') {
          // Add O/S (in Rp)
          const osIndex = result.findIndex((item) => item.key === 'outstanding');
          if (osIndex !== -1) {
            const osInRp = {
              key: 'outstandingIdr',
              label: 'O/S (Dalam rp)',
              value: 'IDR ' + (data?.outstandingIdr
                ? Number(data.outstandingIdr).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                : multiplyNominalValues(data?.outstanding, exchangeRateValue)),
            };
            result.splice(osIndex + 1, 0, osInRp);
          }
        }

    }
    return result;
  };

  const facilityData = mapCellData('facility', financingFacilityData, isSyariah ? cellData : conventionalCellData);
  const projectData = mapCellData('project', financingFacilityData?.project, proyekCellData);

  return {
    currencyDropdownList,
    facilityData,
    facilityDataRaw: financingFacilityData,
    financingFacilityData,
    isSyariah,
    projectData, // For debugging if needed
  };
};

export default useDetailFacility;
