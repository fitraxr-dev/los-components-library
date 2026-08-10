import { formatCurrency } from '@/helpers/formatCurrency';

import type { TabDebtSecuritiesPlacementListProps } from './TabDebtSecuritiesPlacementList.types';


const useTabDebtSecuritiesPlacementList = (props: TabDebtSecuritiesPlacementListProps) => {
  const { tableDataGroup, tableDataDebtor, isTableDataDebtorSuccess } = props;

  const hasTableGroupData = tableDataGroup?.length > 0;

  const convertCurrencyStrToNumber = (value: string) => parseFloat(value?.replace(/,/g, ''));

  const generateTotalNominalInIdr = () => {
    let totalNominal = 0;
    if (isTableDataDebtorSuccess) {
      tableDataDebtor.forEach((item) => totalNominal += convertCurrencyStrToNumber(item.faceValueIdr));
    }

    return String(totalNominal);
  };

  const totalNominalInIdr = formatCurrency(generateTotalNominalInIdr());

  return {
    hasTableGroupData,
    totalNominalInIdr,
  };
};

export default useTabDebtSecuritiesPlacementList;
