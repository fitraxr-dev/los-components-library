import { useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import useGetProjectPhase from '../../hooks/useGetProjectPhase';

import { TableHeaderList } from './ProjectPhase.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useProjectPhase = () => {

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer project detail - project phase page',
    });
  }, []);

  const { data } = useGetProjectPhase({
    filter: {
      id: 1,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  const handleEditProjectPhase = (data: any) => {
    NiceModal.show('EDIT_PROJECT_PHASE', { data });
  };

  const tableHeaderList: TableHeader[] = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit', onClick: (data) => {
            handleEditProjectPhase(data);
          },
        },
      ],
      type: 'action',
    },
  ];

  return {
    data,
    tableHeaderList,
  };
};

export default useProjectPhase;
