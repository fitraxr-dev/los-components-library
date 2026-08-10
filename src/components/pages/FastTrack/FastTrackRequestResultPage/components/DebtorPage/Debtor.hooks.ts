import { useState } from 'react';

import { useParams } from 'next/navigation';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetStakeholderLov from '@/hooks/services/fast-track/useGetStakeholderLov';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetDebtorDetail from './hooks/useGetDebtorDetail';
import useSaveDebtor from './hooks/useSaveDebtor';


const useDebtorPage = (isEditMode: boolean) => {
  const router = useCustomRouter();
  const { processId, debtorId } = useIdentity();
  const { id } = useParams();
  const summaryDetailId = sessionStorage.getItem('summaryDetailId');
  const summaryId = (id && id !== 'null' ? Number(id) : null) ?? (summaryDetailId ? Number(summaryDetailId) : null);
  const { data: institutiontypeData } = useGetParameterList(Modules.INSTITUTION_TYPE);
  const { data: collectibilityOptions } = useGetParameterList(Modules.COLLECTIBILITY);

  const [selectedStakeholderCode, setSelectedStakeholderCode] = useState<string | null>
  (isEditMode ? (debtorId || null) : null);

  const { data: stakeholderOptions } = useGetStakeholderLov(
    {
      bucketProcessId: processId,
      type: 'debtor',
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

  const { data: debtorDetailData } = useGetDebtorDetail(
    {
      bucketProcessId: processId,
      referenceCode: selectedStakeholderCode || '',
      summaryId,
    },
    {
      enabled: !!processId && !!selectedStakeholderCode,
      select: (data: any) => {
        const npwpDoc = data?.listDocuments?.find((item) => item.documentType === 'NPWP_OWNER');

        const npwpFile = npwpDoc ? {
          extension: npwpDoc.documentExtension ? `.${npwpDoc.documentExtension}` : null,
          name: npwpDoc.documentName,
          url: npwpDoc.document,
        } : null;

        return {
          collectability: data?.collectabilityLabel,
          name: data?.debtorName,
          npwp: data?.npwp,
          npwpFile,
          ...data,
        };
      },
    }
  );

  const { mutate: saveDebtor, isPending: isSaveDebtorLoading } = useSaveDebtor({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal menyimpan data!',
        type: 'error',
      });
    },
    onSuccess: () => showNiceModalV2({
      onClose: () => router.back(),
      title: 'Berhasil menyimpan data customer!',
      type: 'success',
    }),
  });

  return {
    collectibilityOptions,
    debtorDetailData,
    institutiontypeData,
    isSaveDebtorLoading,
    saveDebtor,
    selectedStakeholderCode,
    setSelectedStakeholderCode,
    stakeholderOptions,
  };
};

export default useDebtorPage;
