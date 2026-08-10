import { useEffect } from 'react';

import dayjs from 'dayjs';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import useGetManagement from '../../../hooks/useGetManagementById';


type ManagementCellData = {
  key: string;
  label: string;
  value: string;
  url: string | null;
  fileName?: string;
  extension?: string;
};


const useModalManagementDetail = (managementCode: string, processId: string) => {
  const { recordActivity } = useRecordLog();

  const { data } = useGetManagement({
    bucketProcessId: processId,
    managementCode,
    module: TypeModule.PIPELINE,
    process: TypeProcess.PIPELINE,
  }, { enabled: managementCode !== undefined });

  // Record activity when management detail is loaded
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
        remarks: 'view management detail in existing modal',
      });
    }
  }, [data, processId, recordActivity]);


  const cellData = [
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'positionLabel',
      label: 'Jabatan',
    },
    {
      key: 'identityDocNumber',
      label: 'Identity Number',
    },
    {
      key: 'identityTypeKey',
      label: 'Identity Type',
    },
    {
      key: 'npwpFile',
      label: 'Document NPWP',
    },
    {
      key: 'npwp',
      label: 'NPWP',
    },
    {
      key: 'identityDocFile',
      label: 'Identity Document',
    },
    {
      key: 'dateOfBirth',
      label: 'DOB',
    }];

  const cellDataWithDetail: ManagementCellData[] = cellData.map((item) => {
    const defaultValue = item.key === 'identityDocNumber'
      ? (data?.[item.key] ?? '-')
      : item.key === 'identityTypeKey'
        ? (data?.identityDocTypeValue ?? '-')
        : (data?.[item.key] ?? '-');

    let url: string | null = null;
    let value: string = defaultValue;
    let fileName: string | undefined;
    let extension: string | undefined;

    if (item.key === 'npwpFile') {
      const filePath = data?.npwpFile ?? '';
      const fileNameWithExtension = filePath ? filePath.split('/').pop() ?? '' : '';
      const fileExtension = fileNameWithExtension && fileNameWithExtension.includes('.')
        ? fileNameWithExtension.split('.').pop() ?? ''
        : '';
      const baseFileName = fileExtension
        ? fileNameWithExtension.slice(0, -(fileExtension.length + 1))
        : fileNameWithExtension;

      url = filePath || null;
      value = fileNameWithExtension || '-';
      fileName = baseFileName || undefined;
      extension = fileExtension || undefined;
    }

    if (item.key === 'identityDocFile') {
      const filePath = data?.identityDocUrl ?? '';
      const fileNameWithExtension = filePath ? filePath.split('/').pop() ?? '' : '';
      const fileExtension = fileNameWithExtension && fileNameWithExtension.includes('.')
        ? fileNameWithExtension.split('.').pop() ?? ''
        : '';
      const baseFileName = fileExtension
        ? fileNameWithExtension.slice(0, -(fileExtension.length + 1))
        : fileNameWithExtension;

      url = filePath || null;
      value = fileNameWithExtension || '-';
      fileName = baseFileName || undefined;
      extension = fileExtension || undefined;
    }

    if (item.key === 'dateOfBirth') {
      const parsedDate = dayjs(data?.dateOfBirth);
      const formattedDate = parsedDate.isValid() ? parsedDate.format('DD-MM-YYYY') : '-';
      value = data?.dateOfBirth ? formattedDate : '-';
      url = null;
    }

    return {
      ...item,
      extension,
      fileName,
      url,
      value,
    };
  });


  return {
    cellDataWithDetail,
    managementData: data,
  };
};

export default useModalManagementDetail;
