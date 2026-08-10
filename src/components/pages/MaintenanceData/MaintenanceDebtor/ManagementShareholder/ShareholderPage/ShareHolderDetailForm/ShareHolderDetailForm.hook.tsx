import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { tab } from './ShareHolder.constants';


const useShareHolderDetailForm = () => {
  const [activeTab, setActiveTab] = useState(tab.GENERAL_INFORMATION);
  const router = useCustomRouter();

  const handleChangeTab = (tab: string, isFormDirty: boolean = false) => {
    if (isFormDirty && tab !== activeTab) {
      NiceModal.show(MODAL.IS_DIRTY, {
        onSubmit: () => {
          setActiveTab(tab);
        },
        title: 'Data belum tersimpan, apakah anda ingin menyimpan data ini dan berpindah ke tab lain?',
      });
    } else {
      setActiveTab(tab);
    }
  };


  return {
    activeTab,
    handleChangeTab,
    router,
  };
};

export default useShareHolderDetailForm;
