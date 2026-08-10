import { useContext, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { spfp } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import { action } from '../../../VerificationSheetPage/VerificationSheet.constants';
import useGetDetailComplianceCheck from '../../hooks/useGetDetailComplianceCheck';
import useSaveWordComplianceCheck from '../../hooks/useSaveWordComplianceCheck';


export const useBusiness = () => {
  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const router = useCustomRouter();
  const pathList = spfp.LIST_PAGE;
  const bucket = useSpfpBucketContext();

  const [shouldGoNext, setShouldGoNext] = useState(false);
  const queryClient = useQueryClient();

  const path = usePathname();
  const [state] = useApp();
  const stepper = state?.stepper;

  let actions = [];
  const buttons = {};

  if (stepper) {
    actions = stepper.steps.filter((steps) => steps.urlPath === getLastPath(path))[0]?.action;
  }

  for (const key in actions) {
    buttons[key] = actions[key];
  }

  // Get compliance detail to get complianceNumber
  const { data: complianceDetail } = useGetDetailComplianceCheck({
    ...bucket,
  });

  // Save
  const { isPending: isSaveLoading, mutate: saveComplianceCheck } = useSaveWordComplianceCheck({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon dicoba kembali',
        type: 'error',
      });
    },
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
    },
  });

  const handleSave = (blob: Blob, saveType: 'response' | 'review' = 'response') => {
    if (!complianceDetail?.complianceNumber) {
      showNiceModalV2({
        title: 'Compliance number tidak ditemukan',
        type: 'error',
      });
      return;
    }

    saveComplianceCheck({
      bucketProcessId: bucket.bucketProcessId,
      complianceNumber: complianceDetail.complianceNumber,
      module: bucket.module,
      process: bucket.process,
      ...(saveType === 'response' ? { responseFile: blob } : { reviewFile: blob }),
    });
  };

  return {
    handleSave,
    isSaveLoading,
  };
};
