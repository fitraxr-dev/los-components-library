import Button from '@/components/shared/Button';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const projectPhaseTableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Project Phase',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'statusAsOf',
    label: 'Status As Of',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const projectMemberTableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'customerId',
    label: 'Customer ID',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'cif',
    label: 'CIF',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'institutionType',
    label: 'Institution Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'customerName',
    label: 'Nama Customer',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const projectFacilityTableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Customer Name',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'facilityId',
    label: 'Facility ID',
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
    key: 'pic',
    label: 'PIC',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'productType',
    label: 'Produk',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'facilityStatus',
    label: 'Status Fasilitas',
    render: (data) => {
      if (data.facilityStatus === '' || !data.facilityStatus) {
        return <span> </span>;
      }

      return (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          noClick
        >
          {data.facilityStatus}
        </Button>
      );
    },
    sx: {
      minWidth: '10vw',
    },
  },
];
