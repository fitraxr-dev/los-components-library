import { useEffect, useState } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetDebtorById from '../../../hooks/useGetDebtorById';


type CellData = {
  label: string;
  value: string;
  url?: string | null;
  sx?: Record<string, unknown>;
  fileName?: string;
  extension?: string;
};


const useModalDebtorDetailNew = ({ id }: { id: string }) => {
  const { recordActivity } = useRecordLog();
  const { processId } = useIdentity();

  const [cellDataWithDetail, setCellDataWithDetail] = useState<CellData[]>([
    { label: 'Nama', sx: { gridColumn: '1 / span 2' }, value: '-' },
    { label: 'NPWP', value: '-' },
    { label: 'NPWP Document', url: null, value: '-' }
  ]);

  const { data, isSuccess } = useGetDebtorById({ debtorId: id });

  useEffect(() => {
    if (isSuccess && data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view new debtor detail in existing model',
      });

      const {
        name,
        npwp,
        npwpFile,
      } = data;

      const fileNameWithExtension = npwpFile ? npwpFile.split('/').pop() ?? '' : '';
      const fileExtension = fileNameWithExtension && fileNameWithExtension.includes('.')
        ? fileNameWithExtension.split('.').pop() ?? ''
        : '';
      const baseFileName = fileExtension
        ? fileNameWithExtension.slice(0, -(fileExtension.length + 1))
        : fileNameWithExtension;

      setCellDataWithDetail([
        { label: 'Nama', sx: { gridColumn: '1 / span 2' }, value: name ?? '-' },
        { label: 'NPWP', value: npwp ?? '-' },
        {
          extension: fileExtension || undefined,
          fileName: baseFileName || undefined,
          label: 'NPWP Document',
          url: npwpFile,
          value: fileNameWithExtension || '-',
        }
      ]);
    }
  }, [data, isSuccess, processId, recordActivity]);

  return {
    cellDataWithDetail,
    debtorData: data,
  };
};

export default useModalDebtorDetailNew;
