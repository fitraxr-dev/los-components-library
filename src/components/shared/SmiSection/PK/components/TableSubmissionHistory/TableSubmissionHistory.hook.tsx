import { toDateStringNumber } from '@/helpers/date';
import useIdentity from '@/hooks/useIdentity';

import TextStyle from '@/components/shared/TextStyle';


import useGetListProcessingTypeHistory from '../../hooks/useGetListProcessingTypeHistory';

import { TableHeaderHistoryAdendum } from './TableSubmissionHistory.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableSubmissionHistory = () => {
  const isLoading = false;
  const { debtorId } = useIdentity();

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3.5vw' },
      type: 'index',
    },
    {
      key: 'pkName',
      label: 'Nama PK',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'pkNumber',
      label: 'No PK/Adendum',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'pkDate',
      label: 'Tanggal Tanda Tangan PK/Adendum',
      render: (row) => (
        <TextStyle variant="body4">
          {row?.pkDate ? toDateStringNumber(row.pkDate) : '-'}
        </TextStyle>
      ),
      sx: { minWidth: '14vw' },
    },
    {
      key: 'effectiveDate',
      label: 'Tanggal Efektif',
      render: (row) => (
        <TextStyle variant="body4">
          { row?.effectiveDate ? toDateStringNumber(row.effectiveDate) : '-'}
        </TextStyle>
      ),
      sx: { minWidth: '14vw' },
    },
    ...TableHeaderHistoryAdendum
  ];

  const { data } = useGetListProcessingTypeHistory({
    debtorCode: debtorId,
  });
  const listDataHistory = data?.contents;

  return {
    isLoading,
    listDataHistory,
    tableHeader,
  };
};

export default useTableSubmissionHistory;
