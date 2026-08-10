import type { TableHeader } from '@/components/shared/Table/Table.types';


export const ADD_NEW_BUSINESS_SUMMARY_HEADER: TableHeader[] = [
  { key: 'bankName', label: 'Bank Name', sx: { width: '10vw' } },
  { key: 'bankPrefix', label: 'Bank Prefix', sx: { width: '10vw' } },
  { key: 'currency', label: 'Currency', sx: { width: '10vw' } },
  { key: 'customerType', label: 'Customer Type', sx: { width: '10vw' } },
  { key: 'vaType', label: 'VA Type', sx: { width: '10vw' } },
  { key: 'vaTypeDigit', label: 'VA Type Digit', sx: { width: '10vw' } },
  { key: 'totalDigit', label: 'Total Digit', sx: { width: '10vw' } },
  { key: 'isActive', label: 'Active', sx: { width: '10vw' } },
  { key: 'virtualAccount', label: 'Virtual Account', sx: { width: '10vw' } },
];

export const createAddNewBusinessSummaryHeader = (onDetailClick: (data: any) => void): TableHeader[] => {
  return [
    ...ADD_NEW_BUSINESS_SUMMARY_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: onDetailClick,
        },
      ],
      sx: { width: '10vw' },
      type: 'action',
    },
  ];
};
