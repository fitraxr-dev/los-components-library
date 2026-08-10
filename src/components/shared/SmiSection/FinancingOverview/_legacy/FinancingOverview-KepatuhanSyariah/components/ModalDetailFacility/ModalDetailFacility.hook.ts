import { useEffect, useState } from 'react';

import { multiplyNominalValues } from '@/helpers/utils';

import {
  baseCellDataSyariah,
  proyekCellDataSyariah,
  cellDataKoven,
  proyekCellDataKoven,
  cellDataAlIjarah,
  cellDataAlIstishna,
  cellDataAlMudharabah,
  cellDataAlMurabahah,
  cellDataAlMusyarakah,
  cellDataAlMusyarakahMuntanaqisah,
  cellDataAlQardh,
  financingCellDataAlIjarah,
  financingCellDataAlIstishna,
  financingCellDataAlMudharabah,
  financingCellDataAlMurabahah,
  financingCellDataAlMusyarakah,
  financingCellDataAlMusyarakahMuntanaqisah,
  financingCellDataAlQardh,
  cellDataImfzForm,
  cellDataImbtForm,
} from '@/components/pages/MIP/FinancingOverviewPage/components/ModalDetailFacility/ModalDetailFacility.constants';

import useGetDetailFinancingFacility from '../../hooks/useGetDetailFinancingFacility';


type MappedData = {
  key: string;
  label: string;
  value: any;
};

const useDetailFacility = (id, facilityId, bucketProcessId) => {
  const { data: financingFacilityData } = useGetDetailFinancingFacility({
    bucketProcessId,
    facilityId,
    id,
  });

  const [facilityData, setFacilityData] = useState<MappedData[]>([]);
  const [financingData, setFinancingData] = useState<MappedData[]>([]);
  const [projectData, setProjectData] = useState<MappedData[]>([]);
  const [financingSegment, setFinancingSegment] = useState<string | null>(null);

  const getSafeValue = (value: any, defaultValue: string = '-'): string => {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    return value;
  };

  const mappingData = (data: any, cellData: any[]): MappedData[] => {
    if (data?.['currencyOrderValue'] === 'IDR') {
      cellData = cellData.filter(
        (cell) => cell.key !== 'exchangeRate' && cell.key !== 'orderValueAfterExchangeRate'
      );
    }

    return cellData.map((cell) => ({
      key: cell.key,
      label: cell.label,
      value:
        cell.key === 'orderValue'
          ? `${data['currencyOrderValue']} ${data[cell.key]}`
          : cell.key === 'exchangeRate'
            ? `IDR ${data[cell.key]}`
            : cell.key === 'orderValueAfterExchangeRate'
              ? `IDR ${data[cell.key]}`
              : data[cell.key] === '' || data[cell.key] === '0' || data[cell.key] === null
                ? '-'
                : data[cell.key],
    }));
  };

  const mappingAttributes = (attributes: any[], cellData: any[]): MappedData[] => {
    const filterCell: string[] = [];

    for (const cell of cellData) {
      if (cell.flag === 'nominal') {
        const suffix = cell.key;
        const currencyKey = `currency_${suffix}`;
        const currency = attributes.find((a) => a.attributeKey === currencyKey)?.attributeValue;

        if (currency === 'IDR') {
          const exchangeRateKey = suffix.endsWith('_value') && !(cellData.find((a) => a.key === `exchange_rate_${suffix}`))
            ? `exchange_rate_${suffix.replace('_value', '')}`
            : `exchange_rate_${suffix}`;
          const afterExchangeKey = `${suffix}_idr`;
          filterCell.push(exchangeRateKey, afterExchangeKey);
        }
      }
    }

    if (filterCell.length > 0) {
      cellData = cellData.filter(
        (cell) => !(filterCell.includes(cell.key))
      );
    }

    return cellData
      .map((cell) => {
        const found = attributes.find((attr) => attr.attributeKey === cell.key);
        const value = found?.attributeValue;
        const labelValue = found?.attributeLabel || value;

        if (cell.flag === 'nominal') {
          const suffix = cell.key;
          const currencyKey = `currency_${suffix}`;
          const currency = attributes.find((a) => a.attributeKey === currencyKey)?.attributeValue;

          if (!value || value === '0' || value === '') {
            return { key: cell.key, label: cell.label, value: '-' };
          }

          const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

          return {
            key: cell.key,
            label: cell.label,
            value: `${currency} ${formattedValue}`,
          };
        }

        if (cell.flag === 'exchange_rate' || cell.flag === 'total' || cell.flag === 'after_exchange_rate') {
          return {
            key: cell.key,
            label: cell.label,
            value:
            !value || value === '0' || value === ''
              ? '-'
              : `IDR ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          };
        }

        return {
          key: cell.key,
          label: cell.label,
          value: !labelValue || labelValue === '0' || labelValue === '' ? '-' : labelValue,
        };
      });
  };

  const mapCellData = (type: 'facility' | 'project', data: any, cellData: any[]): MappedData[] => {
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

    // Handle project data specific logic
    if (type === 'project') {
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

        const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
        result.splice(cityLabelIndex + 1, 0, exchangeRateCell);

        const districtLabelIndex = result.findIndex((item) => item.key === 'districtLabel');
        result.splice(districtLabelIndex + 1, 0, valueAfterExchangeRate);
      } else {
        const cityLabelIndex = result.findIndex((item) => item.key === 'cityLabel');
        // result.splice(cityLabelIndex + 1, 0, { key: 'empty', label: '', value: '' });
      }
    }

    return result;
  };

  useEffect(() => {
    if (!financingFacilityData) return;

    setFinancingSegment(financingFacilityData.financingSegment);

    if (financingFacilityData.financingSegment === 'SYARIAH') {
      const baseFacilityDataSyariah = mappingData(financingFacilityData, baseCellDataSyariah);
      const projectDataSyariah = mapCellData('project', financingFacilityData.project, proyekCellDataSyariah);

      let facilityDataSyariah: MappedData[] = [];
      let financeDataSyariah: MappedData[] = [];

      switch (financingFacilityData.product) {
        case 'AL_MUSYARAKAH':
          facilityDataSyariah = mappingAttributes(financingFacilityData.attributes, cellDataAlMusyarakah);
          financeDataSyariah = mappingAttributes(financingFacilityData.attributes, financingCellDataAlMusyarakah);
          break;
        case 'AL_MUSYARAKAH_MUTANAQISAH_MMQ':
          facilityDataSyariah = mappingAttributes(financingFacilityData.attributes, cellDataAlMusyarakahMuntanaqisah);
          financeDataSyariah =
          mappingAttributes(financingFacilityData.attributes, financingCellDataAlMusyarakahMuntanaqisah);
          break;
        case 'AL_MURABAHAH':
          facilityDataSyariah = mappingAttributes(financingFacilityData.attributes, cellDataAlMurabahah);
          financeDataSyariah = mappingAttributes(financingFacilityData.attributes, financingCellDataAlMurabahah);
          break;
        case 'AL_ISTISHNA':
          facilityDataSyariah = mappingAttributes(financingFacilityData.attributes, cellDataAlIstishna);
          financeDataSyariah = mappingAttributes(financingFacilityData.attributes, financingCellDataAlIstishna);
          break;
        case 'AL_QARDH':
          facilityDataSyariah = mappingAttributes(financingFacilityData.attributes, cellDataAlQardh);
          financeDataSyariah = mappingAttributes(financingFacilityData.attributes, financingCellDataAlQardh);
          break;
        case 'AL_IJARAH':
          facilityDataSyariah = mappingAttributes(financingFacilityData.attributes, cellDataAlIjarah);
          financeDataSyariah = mappingAttributes(financingFacilityData.attributes, financingCellDataAlIjarah);
          break;
        case 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ':
          facilityDataSyariah = mappingAttributes(financingFacilityData.attributes, cellDataImfzForm);
          financeDataSyariah = mappingAttributes(financingFacilityData.attributes, financingCellDataAlIjarah);
          break;
        case 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT':
          facilityDataSyariah = mappingAttributes(financingFacilityData.attributes, cellDataImbtForm);
          financeDataSyariah = mappingAttributes(financingFacilityData.attributes, financingCellDataAlIjarah);
          break;
        case 'AL_MUDHARABAH':
          facilityDataSyariah = mappingAttributes(financingFacilityData.attributes, cellDataAlMudharabah);
          financeDataSyariah = mappingAttributes(financingFacilityData.attributes, financingCellDataAlMudharabah);
          break;
        default:
          break;
      }

      setFacilityData([...baseFacilityDataSyariah, ...facilityDataSyariah]);
      setFinancingData(financeDataSyariah);
      setProjectData(projectDataSyariah);

    } else {
      const facilityDataKonven = mapCellData('facility', financingFacilityData, cellDataKoven);
      const projectDataKonven = mapCellData('project', financingFacilityData.project, proyekCellDataKoven);

      console.log('projectDataKonven', projectDataKonven);
      setFacilityData(facilityDataKonven);
      setProjectData(projectDataKonven);
      setFinancingData([]);
    }
  }, [financingFacilityData]);

  return {
    facilityData,
    financingData,
    financingSegment,
    projectData,
  };
};

export default useDetailFacility;
