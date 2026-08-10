import { useState } from 'react';

import { useParams } from 'next/navigation';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetStakeholderLov from '@/hooks/services/fast-track/useGetStakeholderLov';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetShareholderDetail from './hooks/useGetShareholderDetail';
import useSaveShareholder from './hooks/useSaveShareholder';


const useShareholderPage = (isEditMode: boolean) => {
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { id } = useParams();
  const summaryDetailId = sessionStorage.getItem('summaryDetailId');
  const summaryId = (id && id !== 'null' ? Number(id) : null) ?? (summaryDetailId ? Number(summaryDetailId) : null);
  const { data: institutiontypeData } = useGetParameterList(Modules.INSTITUTION_TYPE);
  const { data: collectibilityOptions } = useGetParameterList(Modules.COLLECTIBILITY);

  const shareholderCode = sessionStorage.getItem('shareholderCode');
  const [selectedStakeholderCode, setSelectedStakeholderCode] = useState<string | null>(
    isEditMode ? (shareholderCode || null) : null
  );

  const {
    data: stakeholderOptions,
  } = useGetStakeholderLov(
    {
      bucketProcessId: processId,
      type: 'shareholder',
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


  const { data: shareholderDetailData } = useGetShareholderDetail(
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
          name: data?.name,
          npwpFile,
          ...data,
        };
      },
    }
  );

  const { mutate: saveShareholder, isPending: isSaveShareholderLoading } = useSaveShareholder({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal menyimpan data!',
        type: 'error',
      });
    },
    onSuccess: () => showNiceModalV2({
      onClose: () => router.back(),
      title: 'Berhasil menyimpan data shareholder!',
      type: 'success',
    }),
  });

  return {
    collectibilityOptions,
    institutiontypeData,
    isSaveShareholderLoading,
    saveShareholder,
    selectedStakeholderCode,
    setSelectedStakeholderCode,
    shareholderDetailData,
    stakeholderOptions,
  };
};

export default useShareholderPage;
