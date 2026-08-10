import { TableHeaderList } from './AssessmentAndAddendum.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useAssessmentAndAddendum = () => {

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

export default useAssessmentAndAddendum;
