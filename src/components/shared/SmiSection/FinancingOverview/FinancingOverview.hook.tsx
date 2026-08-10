import { useContext, useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetDetailFinancingOverview from './hooks/useGetDetailFinancingOverview';
import useSaveFinancingOverview from './hooks/useSaveFinancingOverview';


export const useFinancingOverview = (props: SmiComponentProps) => {
  const { module, process } = props;
  const { goToNextStep } = useContext(MIPContext);
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { processId } = useParams();
  const { viewOnly } = useViewOnly();

  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [remark, setRemark] = useState(null);
  const {
    data: financingOverviewDetail,
    isFetching: isFetchLoading,
  } = useGetDetailFinancingOverview({
    bucketProcessId: String(processId),
    module: module,
    process: process,
  });

  useEffect(() => {
    if (financingOverviewDetail) {
      setRemark(financingOverviewDetail?.remark);
    }
  }, [financingOverviewDetail]);

  useEffect(() => {
    if (!dirtyMsg) {
      setDirtyMsg(financingOverviewDetail?.remark === remark
        ? undefined
        : 'Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    }
  }, [remark]);


  // Save
  const { isPending: isSaveLoading, mutate: saveFinancingOverview } = useSaveFinancingOverview({
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({ onClose: () => shouldGoNext ? goToNextStep() : null, type: 'success' });
    },
  });

  const handleSave = (blob: Blob) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      if (!!remark) {
        saveFinancingOverview({
          bucketProcessId: String(processId),
          description: blob,
          id: undefined,
          module: module,
          process: process,
          remark: remark,
        });
      } else {
        showNiceModal('confirm', 'DATA MANDATORY belum terisi, simpan perubahan ?', () => goToNextStep(), 'Tidak', 'Ya');
      }
    }
  };


  return {
    financingOverviewDetail,
    handleSave,
    isFetchLoading,
    isSaveLoading,
    remark,
    setRemark,
    setShouldGoNext,
  };
};
