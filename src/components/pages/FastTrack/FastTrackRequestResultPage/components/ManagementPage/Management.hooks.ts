import { useState } from 'react';

import { useParams } from 'next/navigation';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetStakeholderLov from '@/hooks/services/fast-track/useGetStakeholderLov';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetManagementDetail from './hooks/useGetManagementDetail';
import useSaveManagement from './hooks/useSaveManagement';


const useManagementPage = (isEditMode: boolean) => {
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { id } = useParams();
  const summaryDetailId = sessionStorage.getItem('summaryDetailId');
  const summaryId = (id && id !== 'null' ? Number(id) : null) ?? (summaryDetailId ? Number(summaryDetailId) : null);
  const { data: jobPositionOptions } = useGetParameterList(Modules.JOB_POSITION);
  const { data: collectibilityOptions } = useGetParameterList(Modules.COLLECTIBILITY);

  const managementCode = sessionStorage.getItem('managementCode');
  const [selectedStakeholderCode, setSelectedStakeholderCode] = useState<string | null>(
    isEditMode ? (managementCode || null) : null
  );

  const { data: stakeholderOptions } = useGetStakeholderLov(
    {
      bucketProcessId: processId,
      type: 'management',
    },
    {
      enabled: !!processId,
      select: (data: any) => {
        const list = (Array.isArray(data) ? data : data?.contents || data?.content || []);
        return list?.map((item: any) => ({
          ...item,
          label: item.label || item.name,
          name: item.label || item.name,
          value: item.label || item.name,
        })) || [];
      },
    }
  );

  const { data: managementDetailData } = useGetManagementDetail(
    {
      bucketProcessId: processId,
      referenceCode: selectedStakeholderCode || '',
      summaryId,
    },
    {
      enabled: !!processId && !!selectedStakeholderCode,
      select: (data: any) => {
        const npwpDoc = data?.listDocuments?.find((item) => item.documentType === 'NPWP_OWNER');
        const identityDoc = data?.listDocuments?.find((item) => item.documentType === 'KTP_OWNER');


        const npwpFile = npwpDoc ? {
          extension: npwpDoc.documentExtension ? `.${npwpDoc.documentExtension}` : null,
          name: npwpDoc.documentName,
          url: npwpDoc.document,
        } : null;

        const identityFile = identityDoc ? {
          extension: identityDoc.documentExtension ? `.${identityDoc.documentExtension}` : null,
          name: identityDoc.documentName,
          url: identityDoc.document,
        } : null;

        return {
          collectability: data?.collectabilityLabel,
          identityFile,
          name: data?.name || data?.debtorName,
          npwpFile,
          ...data,
        };
      },
    }
  );

  const { mutate: saveManagement, isPending: isSaveManagementLoading } = useSaveManagement({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal menyimpan data!',
        type: 'error',
      });
    },
    onSuccess: () => showNiceModalV2({
      onClose: () => router.back(),
      title: 'Berhasil menyimpan data management!',
      type: 'success',
    }),
  });

  return {
    collectibilityOptions,
    isSaveManagementLoading,
    jobPositionOptions,
    managementDetailData,
    saveManagement,
    selectedStakeholderCode,
    setSelectedStakeholderCode,
    stakeholderOptions,
  };
};

export default useManagementPage;
