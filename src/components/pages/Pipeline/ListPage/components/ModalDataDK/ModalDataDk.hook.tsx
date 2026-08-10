import { useEffect, useState } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDataDk = (data?: Array<any>, visible?: boolean) => {
  const { recordActivity } = useRecordLog();
  const { processId } = useIdentity();

  // Record activity when modal is opened and data is available
  useEffect(() => {
    if (visible && data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view DK database validation data in modal',
      });
    }
  }, [visible, data, processId, recordActivity]);

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

  return {
    tableHeader,
  };
};
