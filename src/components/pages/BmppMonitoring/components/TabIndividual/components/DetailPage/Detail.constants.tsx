import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'description',
    label: 'Melampaui BMPK/BMPD/BMPP Individual',
    sx: {
      minWidth: '20vw',
    },
  },
  {
    key: 'percentage',
    label: 'Persentase',
    render(row) {
      return (
        <TextStyle variant="body4">
          {`${row?.percentage}% of ${row?.percentageThreshold}%`}
        </TextStyle>
      );
    },
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'lastModified',
    label: 'Data as of',
    sx: {
      minWidth: '10vw',
    },
  },
];
