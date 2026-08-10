import { useMemo } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';

import useGetFinancingFacility from '../../hooks/useGetFinancingFacility';

import { cellData, conventionalCellData, proyekCellData } from './ModalDetailFacility.constants';


const useDetailFacility = (props: SmiComponentProps) => {
  const { module, process } = props;
  const { facilityId, processId } = useIdentity();
  const { data: financingFacilityData } = useGetFinancingFacility({ bucketProcessId: processId, facilityId });
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });

  const isSyariah = useMemo(() => financingFacilityData?.financingSegment === 'SYARIAH', [financingFacilityData]);

  // Whitelist: Show additional fields for these module/process
  const additionalFieldsWhitelist = [
    { module: TypeModule.MIP, process: TypeProcess.MIP },
    { module: TypeModule.MUP, process: TypeProcess.MUP },
    { module: TypeModule.RISALAH_RAPAT, process: TypeProcess.RISALAH_RAPAT },
    { module: TypeModule.SPFP, process: TypeProcess.SPFP },
  ];

  const showAdditionalFields = additionalFieldsWhitelist.some(
    (item) => item.module === module && item.process === process
  );

  // Additional fields to filter out when not in whitelist
  const additionalFieldKeys = ['withdrawalPeriod', 'timePeriod', 'rates', 'gracePeriod', 'financingObjectives'];

  // Filter conventionalCellData based on whitelist
  const filteredConventionalCellData = useMemo(() => {
    if (showAdditionalFields) {
      return conventionalCellData;
    }
    return conventionalCellData.filter((item) => !additionalFieldKeys.includes(item.key));
  }, [showAdditionalFields]);

  const mapCellData = (type: 'facility' | 'project', data: any, cellData: any[], showAdditionalFields?: boolean) => {
    const exchangeRateValue = data?.['exchangeRate'];
    const result = cellData.map((item) => {
      let value = data?.[item.key];

      if (item.label === 'Nominal Pengajuan') {
        const isKonven = data?.financingSegment === 'KONVEN';
        let nominalValue = data?.totalOrderValue
          ? Number(data.totalOrderValue).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
          : '0.00';

        if (isKonven && type === 'facility') {
          nominalValue = data?.orderValue;
        }

        value = (data?.currencyOrderValue ? data?.currencyOrderValue : 'IDR') + ' ' + nominalValue;
      }

      if (item.label === 'Nilai Proyek') {
        if (value === null || value === undefined) {
          value = '-';
        } else {
          value = (data?.curValue ? data?.curValue : 'IDR') + ' ' + value;
        }
      }

      if (item.label === 'Nominal Pengajuan (dalam Rp)') {
        value = 'IDR ' + (data?.orderValueAfterExchangeRate);
      }

      if (item.label === 'Nilai Proyek (dalam Rp)') {
        if (value === null || value === undefined) {
          value = '-';
        } else {
          value = 'IDR ' + value;
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
          result.splice(cityLabelIndex, 0, exchangeRateCell);
        } else {
          const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
          result.splice(cityLabelIndex + 1, 0, {});
          result.splice(6, 2);
        }

        break;
      default:
        if (data?.currencyOrderValue === 'USD') {
          const currencyIndex = result.findIndex((item) => item.key === 'orderValue');

          const exchangeRateCell = {
            key: 'exchangeRate',
            label: 'Exchange Rate',
            value: 'IDR' + ' ' + exchangeRateValue,
          };
          result.splice(currencyIndex + 1, 0, exchangeRateCell);

          const hasValueAfterExchangeRate = result.some((item) => item.key === 'orderValueAfterExchangeRate');

          if (!hasValueAfterExchangeRate) {
            const valueAfterExchangeRate = {
              key: 'orderValueAfterExchangeRate',
              label: 'Nominal Pengajuan (dalam Rp)',
              value: 'IDR' + ' ' + (data?.orderValueAfterExchangeRate || '0.00'),
            };
            result.splice(currencyIndex + 2, 0, valueAfterExchangeRate);
          }
        }

    }

    return result.filter((item) => {
      if (type === 'project' && data?.curValue === 'IDR' && item.key === 'valueInIdr') {
        return false;
      }
      if (type === 'facility' && (data?.currencyOrderValue === 'IDR' || !data?.currencyOrderValue) && item.key === 'orderValueAfterExchangeRate') {
        return false;
      }
      return true;
    });
  };

  const facilityData = mapCellData('facility', financingFacilityData, isSyariah ? cellData : filteredConventionalCellData, showAdditionalFields);
  const projectData = mapCellData('project', financingFacilityData?.project, proyekCellData, showAdditionalFields);

  return {
    currencyDropdownList,
    facilityData,
    financingFacilityData,
    isSyariah,
    projectData,
  };
};

export default useDetailFacility;
