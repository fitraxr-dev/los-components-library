import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalHistoryRating = () => {
  const tableData = [
    {
      grade: '[grade]',
      ratingPeriod: '[rating period]',
      ratingResult: '[rating result]',
      ratingType: '[rating type]',
      reRatingDue: '[re-rating due]',
    },
    {
      grade: '[grade]',
      ratingPeriod: '[rating period]',
      ratingResult: '[rating result]',
      ratingType: '[rating type]',
      reRatingDue: '[re-rating due]',
    },
  ];

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'ratingPeriod',
      label: 'Rating Period',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'ratingType',
      label: 'Rating Type',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'ratingResult',
      label: 'Rating Result',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'grade',
      label: 'Grade',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'reRatingDue',
      label: 'Re-rating Due',
      sx: {
        minWidth: '10vw',
      },
    },
  ];

  return {
    tableData,
    tableHeader,
  };
};

export default useModalHistoryRating;
