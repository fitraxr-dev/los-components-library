import { formatCurrency } from '@/helpers/formatCurrency';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const notRealetedView = () => (
  <TextStyle sx={{ color: 'grey.600', fontStyle: 'italic' }}>
    Not related
  </TextStyle>
);

export const tableHeader: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'facilityId',
    label: 'Facility Id',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'applicationNo',
    label: 'Application No',
    render: (row) => {
      const financingSegment = row?.financingSegmentLabel?.toLowerCase?.();
      if (!row?.applicationNo && financingSegment === 'syariah') return notRealetedView();

      return <TextStyle>{row?.applicationNo ?? '-'}</TextStyle>;
    },
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'facilityNo',
    label: 'Facility No',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'parentFacilityNo',
    label: 'Kode Induk',
    render: (row) => {
      const financingSegment = row?.financingSegmentLabel?.toLowerCase?.();
      if (!row?.parentFacilityNo && financingSegment !== 'syariah') return notRealetedView();

      return <TextStyle>{row?.parentFacilityNo ?? '-'}</TextStyle>;
    },
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'parentLimitId',
    label: 'Facility Induk ID',
    render: (row) => {
      const financingSegment = row?.financingSegmentLabel?.toLowerCase?.();
      if (!row?.parentLimitId && financingSegment !== 'syariah') return notRealetedView();

      return <TextStyle>{row?.parentLimitId ?? '-'}</TextStyle>;
    },
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'childFacilityCode',
    label: 'Kode Anak',
    render: (row) => {
      const financingSegment = row?.financingSegmentLabel?.toLowerCase?.();
      if (!row?.childFacilityCode && financingSegment !== 'syariah') return notRealetedView();

      return <TextStyle>{row?.childFacilityCode ?? '-'}</TextStyle>;
    },
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'childFacilityCoreId',
    label: 'Facility Anak Id',
    render: (row) => {
      const financingSegment = row?.financingSegmentLabel?.toLowerCase?.();
      if (!row?.childFacilityCoreId && financingSegment !== 'syariah') return notRealetedView();

      return <TextStyle>{row?.childFacilityCoreId ?? '-'}</TextStyle>;
    },
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'orderTypeLabel',
    label: 'Order Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'mappingOrderTypeLabel',
    label: 'Mapping Order Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'financingSegmentLabel',
    label: 'Segmen Pembiayaan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'mappingFinancingSegmentLabel',
    label: 'CORE Mapping Segmen Pembiayaan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'productLabel',
    label: 'Product/Skema Pembiayaan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'projectName',
    label: 'Nominal',
    render: (data) => {
      return <TextStyle>{data?.totalOrderValue ? data?.currencyOrderValueAfterExchangeRate + ' ' + formatCurrency(data?.totalOrderValue.toString()) : '-'}</TextStyle>;
    },
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'timePeriod',
    label: 'Jangka Waktu',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'projectName',
    label: 'Proyek',
    sx: {
      minWidth: '10vw',
    },
  },
];
