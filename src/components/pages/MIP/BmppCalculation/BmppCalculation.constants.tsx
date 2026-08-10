import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tab = {
  CALCULATION: 'calculation',
  DEBT_SECURITIES: 'debt-securities',
  EXISTING_FACILITIES: 'existing-facilities',
  PROPOSED_FACILITIES: 'proposed-facilities',
  SUMMARY: 'summary',
};

export const tabItems = [
  {
    label: 'Perhitungan BMPP',
    value: tab.CALCULATION,
  },
  {
    label: 'Summary BMPP',
    value: tab.SUMMARY,
  },
  {
    label: 'List Fasilitas Existing',
    value: tab.EXISTING_FACILITIES,
  },
  {
    label: 'List Usulan Fasilitas',
    value: tab.PROPOSED_FACILITIES,
  },
];

export const modal = {
  facilityProposalPlan: 'FACILITY_PROPOSAL_PLAN',
};

export const tableHeaderDebtorProposedFacilitiesList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'orderType',
    label: 'Order Type',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'product',
    label: 'Product',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'governmentMandate',
    label: 'Penjaminan / Penugasan',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'plafondExisting',
    label: 'Plafond Existing',
    render: (row) => (
      <TextStyle variant="body4">
        {row.plafondExisting ? `${row.currencyPlafond ? row.currencyPlafond : ''} ${row.plafondExisting}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'nominal',
    label: 'Nominal',
    render: (row) => (
      <TextStyle variant="body4">
        {row.nominal ? `${row.currency ? row.currency : ''} ${row.nominal}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'plafondExistingInIdr',
    label: 'Plafond Existing in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.plafondExistingInIdr ? `IDR ${row.plafondExistingInIdr}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'total',
    label: 'Nominal in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.total ? `IDR ${row.total}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: '',
    label: '',
    render: () => null,
  },
  {
    key: 'timePeriod',
    label: 'Jangka Waktu',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'project',
    label: 'Proyek',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'division',
    label: 'Division',
    sx: { minWidth: '8vw' },
  },
];

export const tableHeaderGroupProposedFacilitiesListMip: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'customerName',
    label: 'Cust. Name',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'orderType',
    label: 'Order Type',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'product',
    label: 'Product',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'guaranty',
    label: 'Penjaminan / Penugasan',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'plafondExisting',
    label: 'Plafond Existing',
    render: (row) => (
      <TextStyle variant="body4">
        {row.plafondExisting ? `${row.currencyPlafond ? row.currencyPlafond : ''} ${row.plafondExisting}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'nominal',
    label: 'Nominal',
    render: (row) => (
      <TextStyle variant="body4">
        {row.nominal ? `${row.currency ? row.currency : ''} ${row.nominal}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'plafondExistingInIdr',
    label: 'Plafond Existing in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.plafondExistingInIdr ? `IDR ${row.plafondExistingInIdr}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'total',
    label: 'Nominal in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.total ? `IDR ${row.total}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: '',
    label: '',
    render: () => null,
  },
  {
    key: 'timePeriod',
    label: 'Jangka Waktu',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'project',
    label: 'Proyek',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'division',
    label: 'Division',
    sx: { minWidth: '8vw' },
  },
];

export const tableHeaderGroupProposedFacilitiesList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'customerName',
    label: 'Cust. Name',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'orderType',
    label: 'Order Type',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'product',
    label: 'Product',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'guaranty',
    label: 'Penjaminan / Penugasan',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'plafondExisting',
    label: 'Plafond Existing',
    render: (row) => (
      <TextStyle variant="body4">
        {row.plafondExisting ? `${row.currencyPlafond ? row.currencyPlafond : ''} ${row.plafondExisting}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'nominal',
    label: 'Nominal',
    render: (row) => (
      <TextStyle variant="body4">
        {row.nominal ? `${row.currency ? row.currency : ''} ${row.nominal}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'plafondExistingInIdr',
    label: 'Plafond Existing in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.plafondExistingInIdr ? `IDR ${row.plafondExistingInIdr}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: 'total',
    label: 'Nominal in IDR',
    render: (row) => (
      <TextStyle variant="body4">
        {row.total ? `IDR ${row.total}` : '-'}
      </TextStyle>
    ),
    sx: { minWidth: '12vw', textAlign: 'end', whiteSpace: 'nowrap' },
  },
  {
    key: '',
    label: '',
    render: () => null,
  },
  {
    key: 'loanTerm',
    label: 'Jangka Waktu',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'project',
    label: 'Proyek',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'division',
    label: 'Division',
    sx: { minWidth: '8vw' },
  },
];
