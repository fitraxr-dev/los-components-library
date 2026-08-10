import React, { useEffect, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';
import router from 'next/router';

import { MODAL } from '@/configs/constants/modalId';
import useIdentity from '@/hooks/useIdentity';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { tabs } from '../OtherRelated.constants';


const useOtherRelatedDetailForm = () => {
  const [activeTab, setActiveTab] = React.useState(tabs.generalInformation);
  const pathname = usePathname();
  const title = pathname.includes('add') ? 'Add Pihak Terkait Lainnya' :
    pathname.includes('edit') ? 'Edit Pihak Terkait Lainnya' :
      'Detail Pihak Terkait Lainnya';

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


  const handleBackToListPage = () => {
    router.back();
  };

  return {
    activeTab,
    handleBackToListPage,
    setActiveTab: handleChangeTab,
    title,
  };
};

export default useOtherRelatedDetailForm;
