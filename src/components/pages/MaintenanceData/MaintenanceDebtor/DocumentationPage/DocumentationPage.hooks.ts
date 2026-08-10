import { TableHeaderList } from './DocumentationPage.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDocumentationPage = () => {

  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'detail', onClick: (data) => {
          console.log('Detail', data);
        } },
      ],
      type: 'action',
    }
  ];

  return {
    tableHeaderList,
  };
};

export default useDocumentationPage;
