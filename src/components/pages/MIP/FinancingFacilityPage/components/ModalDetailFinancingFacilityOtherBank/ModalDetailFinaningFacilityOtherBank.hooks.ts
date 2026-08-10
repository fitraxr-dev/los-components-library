import useGetFinancingFacilityOtherBankById from '../../hooks/useGetFinancingFacilityOtherBankById';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDetailFinancingFacilityOtherBank = ({ id }) => {
  const { data } = useGetFinancingFacilityOtherBankById({ id });

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'bankTypeLabel',
      label: 'Jenis Kreditur',
    },
    {
      key: 'bankLabel',
      label: 'Bank',
    },
  ];

  const tableData = data?.otherBankList;

  return { data, tableData, tableHeader };
};
