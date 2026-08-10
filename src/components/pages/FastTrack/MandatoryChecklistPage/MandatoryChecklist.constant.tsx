import Checkbox from '@/components/shared/CheckBox';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '1vw' },
    type: 'index',
  },
  {
    key: 'typeName',
    label: 'Jenis Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'moduleName',
    label: 'Module',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'isDocumentFulfilled',
    label: 'dokumen Fulfilled',
    render: (row) => <Checkbox
      checked={row?.tlConfirmation}
      disabled
      sx={{ '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' } }}
    />,
    sx: { minWidth: '10vw' },
  },
  {
    key: 'uploadedByName',
    label: 'Uploaded By',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'uploadedDate',
    label: 'Uploaded Date',
    sx: { minWidth: '10vw' },
    type: 'date',
  },
  {
    key: 'statusName',
    label: 'Status',
    sx: { minWidth: '10vw' },
    type: 'status',
  },

];
