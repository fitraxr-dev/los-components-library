import { useContext, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { ASPECT_LEGAL_REVIEW } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { AspectLegalReviewContext } from '@/components/layouts/AspectLegalReviewLayout/AspectLegalReview.context';

import { useLegalAspectAccess } from '../hooks/useLegalAspectAccess';

import useIdentifyRisksDetail from './hooks/useGetRiskProfileDetail';
import useIdentifyLegalRisksDelete from './hooks/useIdentifyLegalRisksDelete';
import useIdentifyRisksSave from './hooks/useRiskProfileSave';


export const useIdentifyLegalRisks = () => {
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const currentPath = usePathname();
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();
  const { goToNextStep } = useContext(AspectLegalReviewContext);
  const [container, setContainer] = useState(null);
  const { setDirtyMsg } = useContext(DirtyContext);
  const id = Number(processId?.split('-')[1]);


  const { data: riskDetail, isLoading: isLoadingDetail } = useIdentifyRisksDetail(
    {
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
    },
  );

  const { mutate: mutateSave, isPending: isSaveLoading } = useIdentifyRisksSave({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' }),
    onSuccess: () => {
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['identify-risk-dh-detail']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      showNiceModalV2({ type: 'success' });
    },
  });

  const {
    hasAnyUpdateAccess: canUpdate,
  } = useLegalAspectAccess();


  const { mutate: mutateDelete } = useIdentifyLegalRisksDelete({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: () => {
      showNiceModalV2({ type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['identify-legal-risks-list', { bucketProcessId: processId }]});

    },
  });
  const handleDelete = async (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        mutateDelete({
          id: id,
        });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
  };

  const handleCreate = () => {
    const lastPath = getLastPath(ASPECT_LEGAL_REVIEW.IDENTIFY_RISKS_CREATE_PAGE);
    const url = `${currentPath}/${lastPath}`;
    router.push(url);
  };

  const handleSave = async (file: any, options?: { goToNext?: boolean }) => {
    const { goToNext = false } = options || {};

    if (viewOnly) return goToNextStep();

    const descWord = await convertToDocx(file);

    let payload = {
      bucketProcessId: processId,
      id,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      riskDescription: descWord,
    };

    mutateSave(payload, {
      onSuccess: () => {
        if (goToNext) {
          goToNextStep();
        }
      },
    });
  };

  const handleSaveOnly = () => handleSave(container, { goToNext: false });
  const handleSaveAndNext = () => handleSave(container, { goToNext: true });

  const handleNext = () => goToNextStep();

  const isLoading = isLoadingDetail || isSaveLoading;

  const autoSavePayload = useMemo(() => async () => {
    if (!container || !processId) return null;

    const descWord = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      id,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      riskDescription: descWord,
    };
  }, [container, processId, id]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: canUpdate && !viewOnly && !!riskDetail && !!processId,
    payload: autoSavePayload,
    url: 'mip.identificationLegalRisk.save',
  });

  return {
    canUpdate,
    container,
    goToNextStep,
    handleCreate,
    handleDelete,
    handleNext,
    handleSaveAndNext,
    handleSaveOnly,
    isAutoSaveFetching,
    isLoading,
    riskDetail,
    setContainer,
    viewOnly,
  };
};
