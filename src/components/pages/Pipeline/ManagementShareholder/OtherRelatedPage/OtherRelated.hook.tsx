import { useEffect } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { TableHeaderList } from './OtherRelated.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useOtherRelated = () => {
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();

  const { handleSetBreadcrumb } = useMaintenanceDataContext();


  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: '' },
      { label: 'Pihak Terkait Lainnya', url: '' }
    ]);
  }, []);

  const gotoDetailPage = (id: string) => {
    router.push(replacePath(`${pathname}/${id}`, { processId }));
  };

  const gotoEditPage = (id: string) => {
    router.push(replacePath(`${pathname}/edit/${id}`, { processId }));
  };

  const gotoAddPage = () => {
    router.push(replacePath(`${pathname}/add`, { processId }));
  };

  const handleDelete = (otherRelatedData?: any) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        recordActivity({
          activity: ActivityType.DELETE,
          bucketProcessId: processId || '',
          changeAfter: JSON.stringify({ status: 'deleted' }),
          changeBefore: JSON.stringify({ id: otherRelatedData?.id, name: otherRelatedData?.name }),
          menuCode: 'pipeline',
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          remarks: 'delete other related data',
        });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
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
              remarks: 'view other related data detail',
            });
            gotoDetailPage(data?.id);
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
              remarks: 'view other related data edit form',
            });
            gotoEditPage(data?.id);
          },
        },
        {
          iconName: 'delete', onClick: (data) => handleDelete(data),
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
    tableHeaderList,
    theme,
  };
};

export default useOtherRelated;
