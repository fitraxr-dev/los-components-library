import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'processLabel',
    label: 'Process',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'groupDivision',
    label: 'Group Division',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'stage',
    label: 'Stage',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'slaDeadline',
    label: 'SLA',
    render: (row) => <TextStyle>{row.slaDeadline} Hari</TextStyle>,
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'isActive',
    label: 'Active',
    render: (row) => (
      <TextStyle>
        {row.isActive ? 'Ya' : 'Tidak'}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'modifiedDate',
    label: 'Last Modified',
    sx: {
      minWidth: '10vw',
    },
    type: 'date',
  },
];

export const MODAL = {
  EDIT_PROCESS_SLA_MODAL: 'EDIT_PROCESS_SLA_MODAL',
};
