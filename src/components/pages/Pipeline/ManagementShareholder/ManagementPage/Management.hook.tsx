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

import useDeleteManagement from '../hooks/useDeleteManagement';
import useGetManagementList from '../hooks/useGetManagementList';

import { TableHeaderList } from './Management.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useManagement = () => {
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { debtorId } = useIdentity();


  const gotoDetailPage = (id: string) => {
    router.push(replacePath(`${pathname}/${id}`, { processId }));
  };

  const gotoEditPage = (id: string) => {
    router.push(replacePath(`${pathname}/edit/${id}`, { processId }));
  };

  const gotoAddPage = () => {
    router.push(replacePath(`${pathname}/add`, { processId }));
  };

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: '' },
      { label: 'Management', url: '' }
    ]);
  }, []);

  const { data, isLoading } = useGetManagementList({
    filter: {
      debtorId,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  // Record activity when management list is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view pipeline management list',
      });
    }
  }, [data, processId, recordActivity]);

  const { mutate: deleteManagement } = useDeleteManagement({
    onError: () => showNiceModalV2({
      title: 'Data gagal dihapus',
      type: 'error',
    }),
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleDelete = (id: 'string', managementData?: any) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        recordActivity({
          activity: ActivityType.DELETE,
          bucketProcessId: processId || '',
          changeAfter: JSON.stringify({ status: 'deleted' }),
          changeBefore: JSON.stringify({ id, name: managementData?.name }),
          menuCode: 'pipeline',
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          remarks: 'delete management',
        });
        deleteManagement({ id: Number(id) });
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
              remarks: 'view management detail',
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
              remarks: 'view management edit form',
            });
            gotoEditPage(data?.id);
          },
        },
        {
          iconName: 'delete', onClick: (data) => {
            handleDelete(data?.id, data);
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
    data,
    gotoAddPage,
    tableHeaderList,
    theme,
  };
};

export default useManagement;
