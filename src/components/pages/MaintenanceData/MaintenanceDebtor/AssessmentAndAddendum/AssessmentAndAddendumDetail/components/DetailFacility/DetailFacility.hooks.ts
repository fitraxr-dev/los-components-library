import { TableHeaderList } from './DetailFacility.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDetailFacility = () => {

  const tableHeaderList: TableHeader[] = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'detail', onClick: (data) => {
          console.log('data', data);
        } },
      ],
      type: 'action',
    },
  ];

  return {
    tableHeaderList,
  };
};

export default useDetailFacility;
