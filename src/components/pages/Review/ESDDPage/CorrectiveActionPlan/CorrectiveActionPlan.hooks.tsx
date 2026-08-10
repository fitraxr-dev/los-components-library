import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useESDDContext } from '@/components/layouts/EsddLayout/Esdd.context';

import useDeleteSubData from './hooks/useDeleteSubData';
import useGetCorrectiveActionPlan from './hooks/useGetCorrectiveActionPlan';


const useCorrectiveActionPlan = () => {
  const { goToNextStep } = useESDDContext();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const path = usePathname();

  const segments: string[] = path.split('/');
  const editPath: string = `${segments.slice(0, -1).join('/')}/edit-corrective-action-plan/[id]`;


  const { isLoading, data: correctiveActionPlanBucket } = useGetCorrectiveActionPlan({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DELST,
  });

  const { isPending: deleteLoading, mutate: deleteSubData } = useDeleteSubData({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba kembali', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data Berhasil Di hapus', type: 'success' });
    },
  });


  const handleNewData = () => {
    router.push(replacePath(`${segments.slice(0, -1).join('/')}/add-new-corrective-action-plan`, {}));
  };


  const handleEditData = (id: string) => {
    router.push(replacePath(
      editPath,
      {
        id: id,
      },
    ));
  };

  const handleDeleteData = (id: number) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onSubmit: () => deleteSubData({ id }),
      title: 'Apakah anda yakin untuk menghapus data?',
    });
    ;
  };


  return {
    correctiveActionPlanBucket,
    deleteLoading,
    goToNextStep,
    handleDeleteData,
    handleEditData,
    handleNewData,
    isLoading,
    viewOnly,
  };
};

export default useCorrectiveActionPlan;
