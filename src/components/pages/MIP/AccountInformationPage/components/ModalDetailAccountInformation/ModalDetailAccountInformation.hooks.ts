// import useGetFinancingFacilityOtherBankById from '../../hooks/useGetFinancingFacilityOtherBankById';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDetailAccountInformation = ({ id }) => {
  // const { data } = useGetFinancingFacilityOtherBankById({ id });
  const data = [];

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

  const tableData = data;

  return { data, tableData, tableHeader };
};
