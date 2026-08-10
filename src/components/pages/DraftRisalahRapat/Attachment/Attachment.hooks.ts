import { useState } from 'react';

import { active } from 'd3';
import { usePathname } from 'next/navigation';

import { risalahRapat } from '@/configs/constants/pathname';
import { TypeModule } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


import { TABS } from './Attachment.constants';
import useDeleteCorrectiveActionPlan from './hooks/useDeleteCorrectiveActionPlan';
import useGetCorrectiveActionPlanList from './hooks/useGetCorrectiveActionPlanList';


const useAttachment = () => {
  const [activeTab, setActiveTab] = useState(TABS.CORRECTIVE_ACTION);
  const [selected, setSelected] = useState([]);
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const path = usePathname();

  const pathArray = path.split('/');
  const moduleIndex = pathArray[3];
  const processIdIndex = pathArray[4];

  const { viewOnly } = useViewOnly();
  const handleChangeTab = (val: string) => {

    setActiveTab(val);
  };


  const { isLoading, data: correctiveActionPlanBucket } = useGetCorrectiveActionPlanList({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeModule.RISALAH_RAPAT,
  });

  const { isPending: deleteLoading, mutate: deleteSubData } = useDeleteCorrectiveActionPlan({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba kembali', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data Berhasil Di hapus', type: 'success' });
    },
  });


  const handleNewData = () => {
    router.push(replacePath(risalahRapat.ADD_NEW_CORRECTIVE_ACTION_PLAN_PAGE, {
      module: moduleIndex,
      processId: processIdIndex,
    }));
  };


  const handleEditData = (id: string) => {
    router.push(replacePath(
      risalahRapat.EDIT_CORRECTIVE_ACTION_PLAN_PAGE,
      {
        id,
        module: moduleIndex,
        processId: processIdIndex,
      },
    ));
  };

  const handleDeleteData = (id: number) => {
    deleteSubData({ id });
  };


  return {
    activeTab,
    correctiveActionPlanBucket,
    handleChangeTab,
    handleDeleteData,
    handleEditData,
    handleNewData,
    isLoading,
    selected,
    setActiveTab,
    setSelected,
    viewOnly,
  };
};

export default useAttachment;
