import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import useGetMasterDebtorById from '@/components/pages/Pipeline/PipelineCreationPage/hooks/useGetMasterDebtorById';


const useSyncTemenos = (debtorId: string) => {
  const { data: debtorDetail } = useGetMasterDebtorById({ debtorId });

  const mutation = useMutation({
    mutationFn: async () => {
      const cif = debtorDetail?.cif;
      await API('master.facilityManagementSyariahExisiting.syncTemenos', {
        data: { cif },
      });
    },
  });

  return {
    isSyncing: mutation.isPending,
    syncTemenos: () => mutation.mutateAsync(),
  };
};

export default useSyncTemenos;
