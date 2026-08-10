import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { tableHeaderSelectedTask } from '../ModalReassign/ModalReassign.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const tableHeader: Array<TableHeader> = [
  ...tableHeaderSelectedTask,
  {
    key: 'pic',
    label: 'PIC',
    render: (row, idx) => {
      return (
        <ColumnWrapper key={idx}>
          {row?.pic?.map((item, idx) => (
            <TextStyle
              key={idx}
              weight={item.isLeader ? 600 : 400}
            >
              {item.name}
            </TextStyle>
          ))}
        </ColumnWrapper>
      );
    },
    sx: {
      minWidth: '6vw',
    },
  },
  {
    key: 'reAssignTo',
    label: 'Re-assign to',
    render: (row) => (
      <ColumnWrapper alignItems="start">
        {
          row?.pic?.map((item, idx) => (
            <TextStyle key={idx}>
              {item.reAssignTo.name || '-'}
            </TextStyle>
          ))
        }
      </ColumnWrapper>
    ),
    sx: {
      minWidth: '6vw',
    },
  },
];

export default tableHeader;
