import { useContext, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';


import { spfp } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import useSaveVerificationSheet from '../../hooks/useSaveVerification';


export const useDPOP = (props, container?: any) => {
  const { setDirtyMsg } = useContext(DirtyContext);
  const { goToNextStep } = useSpfpContext();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const bucket = useSpfpBucketContext();
  const pathList = spfp.LIST_PAGE;

  const [shouldGoNext, setShouldGoNext] = useState(false);
  const dpopData = props?.data?.length ? props?.data?.find((e) => e.division?.includes('DPOP')) : {};

  // Save
  const { isPending: isSaveLoading, mutate: saveVerificationSheet } = useSaveVerificationSheet({
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2(
        {
          onClose: () => {
            if (shouldGoNext) {
              goToNextStep();
            }
          },
          title: 'Data berhasil disimpan',
          type: 'success',
        });
    },
  });

  const handleSave = (blob: Blob) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      saveVerificationSheet({
        description: blob,
        ...bucket,
      });
    }
  };

  const autoSavePayload = useMemo(() => async () => {

    const blob = await convertToDocx(container);

    return {
      description: blob,
      ...bucket,
    };
  }, [container, bucket]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!container,
    payload: autoSavePayload,
    url: 'agreement.add.saveSheet',
  });

  return {
    dpopData,
    handleSave,
    // isFetching,
    isAutoSaveFetching,
    isSaveLoading,
    setShouldGoNext,
  };
};
