import { useState } from 'react';

import { useParams } from 'next/navigation';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetStakeholderLov from '@/hooks/services/fast-track/useGetStakeholderLov';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetOtherRelationDetail from './hooks/useGetOtherRelationDetail';
import useSaveOtherRelation from './hooks/useSaveOtherRelation';


const useOtherRelationPage = (isEditMode: boolean) => {
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { id } = useParams();
  const summaryDetailId = sessionStorage.getItem('summaryDetailId');
  const summaryId = (id && id !== 'null' ? Number(id) : null) ?? (summaryDetailId ? Number(summaryDetailId) : null);
  const { data: institutionTypeOptions } = useGetParameterList(Modules.INSTITUTION_TYPE);
  const { data: jobPositionOptions } = useGetParameterList(Modules.JOB_POSITION);
  const { data: collectibilityOptions } = useGetParameterList(Modules.COLLECTIBILITY);

  const otherRelatedCode = sessionStorage.getItem('otherRelatedCode');
  const [selectedStakeholderCode, setSelectedStakeholderCode] = useState<string | null>(
    isEditMode ? (otherRelatedCode || null) : null
  );

  const { data: stakeholderOptions } = useGetStakeholderLov(
    {
      bucketProcessId: processId,
      type: 'other_related',
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

  const { data: otherRelationDetailData } = useGetOtherRelationDetail(
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
          typeDescription: data?.typeDescription,
          ...data,
        };
      },
    }
  );

  const { mutate: saveOtherRelation, isPending: isSaveOtherRelationLoading } = useSaveOtherRelation({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal menyimpan data!',
        type: 'error',
      });
    },
    onSuccess: () => showNiceModalV2({
      onClose: () => router.back(),
      title: 'Berhasil menyimpan data pihak terkait lainnya!',
      type: 'success',
    }),
  });

  return {
    collectibilityOptions,
    institutionTypeOptions,
    isSaveOtherRelationLoading,
    jobPositionOptions,
    otherRelationDetailData,
    saveOtherRelation,
    selectedStakeholderCode,
    setSelectedStakeholderCode,
    stakeholderOptions,
  };
};

export default useOtherRelationPage;
