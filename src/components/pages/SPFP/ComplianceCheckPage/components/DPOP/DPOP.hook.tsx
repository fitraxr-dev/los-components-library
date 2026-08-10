import { useContext, useState } from 'react';

import { useParams } from 'next/navigation';


import { spfp } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import useGetDetailComplianceCheck from '../../hooks/useGetDetailComplianceCheck';
import useSaveWordComplianceCheck from '../../hooks/useSaveWordComplianceCheck';


export const useDPOP = (props) => {
  const { setDirtyMsg } = useContext(DirtyContext);
  const { goToNextStep } = useSpfpContext();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const bucket = useSpfpBucketContext();
  const pathList = spfp.LIST_PAGE;

  const [shouldGoNext, setShouldGoNext] = useState(false);

  // Get compliance detail to get complianceNumber
  const { data: complianceDetail } = useGetDetailComplianceCheck({
    ...bucket,
  });

  // Get DPOP data
  const getDPOPData = () => {
    if (!props?.data) return {};

    try {
      let dataToProcess = props.data;

      // If data is a JSON string, parse it first
      if (typeof props.data === 'string') {
        dataToProcess = JSON.parse(props.data);
      }

      // If parsed data is an array, find DPOP division
      if (Array.isArray(dataToProcess)) {
        const dpopData = dataToProcess.find((e) => e.division?.includes('DPOP'));
        return dpopData || {};
      }

      // If data is an object (not array), return empty object
      return {};
    } catch {
      return {};
    }
  };

  const dpopData = getDPOPData();

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

  const handleSave = (blob: Blob, saveType: 'response' | 'review' = 'response') => {
    // Log blob info sebelum kirim ke BE (DPOP)
    console.log('DPOP blob:', blob ? { size: blob.size, type: blob.type } : null);

    if (viewOnly) {
      goToNextStep();
    } else {
      if (!complianceDetail?.complianceNumber) {
        showNiceModalV2({
          title: 'Compliance number tidak ditemukan',
          type: 'error',
        });
        return;
      }

      const payload = {
        bucketProcessId: bucket.bucketProcessId,
        complianceNumber: complianceDetail.complianceNumber,
        module: bucket.module,
        process: bucket.process,
        ...(saveType === 'response' ? { responseFile: blob } : { reviewFile: blob }),
      };

      //Log payload sebelum kirim ke BE (DPOP)
      console.log('DPOP payload:', {
        ...payload,
      });

      saveComplianceCheck(payload);
    }
  };

  return {
    dpopData,
    handleSave,
    // isFetching,
    isSaveLoading,
    setShouldGoNext,
  };
};
