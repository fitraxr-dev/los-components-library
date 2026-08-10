import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDataDk = () => {
  const { recordActivity } = useRecordLog();

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'debtorName',
      label: 'Nama Depan',
    },
    {
      key: 'debtorId',
      label: 'Kode',
    },
    {
      key: 'profile',
      label: 'Profil',
    },
    {
      key: 'birthPlace',
      label: 'Tempat Lahir',
    },
    {
      key: 'birthDate',
      label: 'Tanggal Lahir',
    },
    {
      key: 'nationality',
      label: 'Warga Negara',
    },
    {
      key: 'category',
      label: 'Watch List',
    },
  ];

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'business-activity-report',
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
      remarks: 'view table DK',
    });
  }, []);

  return {
    tableHeader,
  };
};
