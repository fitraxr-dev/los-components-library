import { useMemo } from 'react';

import { formatDate } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';

import type { TableGroupProps } from './TableGroup.types';


const useTableGroup = (props: TableGroupProps) => {
  const { tableData } = props;

  const tableDataContents = tableData?.map((item) => ({
    ...item,
    bonds: item.bonds ?? '-',
    currency: item.currExchangeRate ? item.currExchangeRate : '-',
    faceValue: item.faceValue ? item.faceValue : '-',
    faceValueIdr: item.faceValueInIdr ? item.faceValueInIdr : '-',
    issuer: item.issuer ?? '-',
    maturityDate: item.maturityDate ? formatDate(new Date(item.maturityDate)) : '-',
    sequence: item.seq ?? '-',
  }));

  const convertCurrencyStrToNumber = (value: string) => parseFloat(value.replace(/,/g, ''));

  const generateTotalNominalInIdr = () => {
    let totalNominal = 0;
    tableDataContents.forEach((item) => totalNominal += convertCurrencyStrToNumber(item.faceValueIdr));

    return String(totalNominal);
  };

  const totalNominalIdr = useMemo(() => formatCurrency(generateTotalNominalInIdr()), [tableDataContents]);

  return {
    generateTotalNominalInIdr,
    tableDataContents,
    totalNominalIdr,
  };
};

export default useTableGroup;
