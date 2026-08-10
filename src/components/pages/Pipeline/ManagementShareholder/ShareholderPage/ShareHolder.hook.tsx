import { useEffect } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import useGetShareholderList from '../hooks/useGetShareholderList';

import { TableHeaderList } from './ShareHolder.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useShareHolder = () => {
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { debtorId } = useIdentity();

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: '' },
      { label: 'Shareholder', url: '' }
    ]);
  }, []);

  const { data: tableData } = useGetShareholderList({
    filter: {
      debtorId: debtorId,
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  // Record activity when shareholder list is loaded
  useEffect(() => {
    if (tableData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view pipeline shareholder list',
      });
    }
  }, [tableData, processId, recordActivity]);

  const gotoDetailPage = (id: string) => {
    router.push(replacePath(`${pathname}/${id}`, { processId }));
  };

  const gotoEditPage = (id: string) => {
    router.push(replacePath(`${pathname}/edit/${id}`, { processId }));
  };

  const gotoAddPage = () => {
    router.push(replacePath(`${pathname}/add`, { processId }));
  };
  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: processId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'pipeline',
              module: TypeModule.PIPELINE,
              process: TypeProcess.PIPELINE,
              remarks: 'view shareholder detail',
            });
            gotoDetailPage(data?.id);
            // router.push(replacePath(
            //   maintenanceDebtor.PROJECT_DETAIL_PAGE,
            //   {
            //     debtorId,
            //     id: data.projectId,
            //     module: moduleIndex,
            //   },
            // ));
          },
        },
        {
          iconName: 'edit', onClick: (data) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: processId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'pipeline',
              module: TypeModule.PIPELINE,
              process: TypeProcess.PIPELINE,
              remarks: 'view shareholder edit form',
            });
            gotoEditPage(data?.id);
          },
        },
        {
          iconName: 'delete', onClick: (data) => {
            recordActivity({
              activity: ActivityType.DELETE,
              bucketProcessId: processId || '',
              changeAfter: JSON.stringify({ status: 'deleted' }),
              changeBefore: JSON.stringify({ id: data?.id, name: data?.name }),
              menuCode: 'pipeline',
              module: TypeModule.PIPELINE,
              process: TypeProcess.PIPELINE,
              remarks: 'delete shareholder',
            });
          },
        },
        {
          iconName: 'preview-document', onClick: (data) => {},
        },
        {
          iconName: 'download', onClick: (data) => {},
        },
      ],
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    },
  ];
  return {
    gotoAddPage,
    tableData,
    tableHeaderList,
    theme,
  };
};

export default useShareHolder;
