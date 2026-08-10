import { useEffect, useMemo, useState } from 'react';

import { Base } from '@syncfusion/ej2-base';

import useGetDetailFinancingFacility from '@/hooks/services/bucket/financing-facility/useGetDetailFinancingFacility';
import useIdentity from '@/hooks/useIdentity';

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
} from './ModalDetailFacility.constants';


const formatAttributesToObject = (attributes?: Array<any>) => {
  if (!attributes || !Array.isArray(attributes)) return {};

  return attributes.reduce((acc, attr) => {
    const displayValue =
      attr?.attributeLabel && attr.attributeLabel.trim() !== ''
        ? attr.attributeLabel
        : attr?.attributeValue;

    acc[attr.attributeKey] = displayValue ?? null;
    if (attr?.attributeKey === 'expected_profit_share' && acc.expected_profit === undefined) {
      acc['expected_profit'] = attr?.attributeValue ?? null;
    }
    return acc;
  }, {});
};

const useDetailFacility = () => {
  const { bucketProcessId, facilityId } = useIdentity();
  const { data: financingFacilityData } = useGetDetailFinancingFacility({
    bucketProcessId: bucketProcessId,
    facilityId: facilityId,
  });
  const [facilityData, setFacilityData] = useState(null);
  const [financingData, setFinancingData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [financingSegment, setFinancingSegment] = useState(null);

  useEffect(() => {
    if (!financingFacilityData) return;

    setFinancingSegment(financingFacilityData.financingSegment);
    const attributeMap = formatAttributesToObject(financingFacilityData.attributes);

    if (financingFacilityData.financingSegment === 'SYARIAH') {
      const baseFacilityDataSyariah = mappingData(
        {
          ...financingFacilityData,
          ...attributeMap,
        },
        baseCellDataSyariah,
      );
      const projectDataSyariah = mappingData(financingFacilityData.project, proyekCellDataSyariah);
      let facilityDataSyariah = null;
      let financeDataSyariah = null;
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
      const facilityDataKonven = mappingData(
        {
          ...financingFacilityData,
          ...attributeMap,
        },
        cellDataKoven,
      );
      const projectDataKonven = mappingData(financingFacilityData.project, proyekCellDataKoven);
      setFacilityData(facilityDataKonven);
      setProjectData(projectDataKonven);
    }
  }, [financingFacilityData]);

  type MappedData = {
    key: string;
    label: string;
    value: any;
  };

  const mappingData = (data: any, cellData: any[]): MappedData[] => {
    if (data['currencyOrderValue'] === 'IDR') {
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
    const filterCell = [];

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
        const found = (() => {
          const direct = attributes.find((attr) => attr.attributeKey === cell.key);
          if (direct) return direct;
          if (cell.key === 'expected_profit') {
            return attributes.find((attr) => attr.attributeKey === 'expected_profit_share');
          }
          return null;
        })();
        const value = found?.attributeValue;

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
          const valueForDisplay = found?.attributeLabel && found.attributeLabel !== ''
            ? found.attributeLabel
            : value;

          return {
            key: cell.key,
            label: cell.label,
            value:
            !valueForDisplay || valueForDisplay === '0' || valueForDisplay === ''
              ? '-'
              : `IDR ${valueForDisplay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          };
        }

        const displayValue = (() => {
          if (found?.attributeLabel && found.attributeLabel.trim() !== '') {
            return found.attributeLabel;
          }

          return value;
        })();

        const normalizedValue = (() => {
          if (displayValue === null || displayValue === undefined) return '-';

          if (typeof displayValue === 'string') {
            const trimmed = displayValue.trim();
            if (!trimmed || trimmed === '0') return '-';
            return trimmed;
          }

          if (displayValue === 0) return '-';

          return displayValue;
        })();

        return {
          key: cell.key,
          label: cell.label,
          value: normalizedValue,
        };
      });
  };


  return {
    facilityData,
    financingData,
    financingSegment,
    projectData,
  };
};

export default useDetailFacility;
