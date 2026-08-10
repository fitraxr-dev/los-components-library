import { TableHeaderList } from './TableOtherParties.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableOtherParties = () => {

  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => { },
        },
        {
          iconName: 'edit', onClick: (data) => { },
        },
        {
          iconName: 'delete', onClick: (data) => { },
        },
        {
          iconName: 'download', onClick: (data) => { },
        }
      ],
      type: 'action',
    }
  ];

  return {
    tableHeaderList,
  };
};

export default useTableOtherParties;
