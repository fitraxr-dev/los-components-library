import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';


const useManagementDetailPage = () => {
  const [activeTab, setActiveTab] = useState('FORM');
  const { id } = useParams();
  const isEditPage = Boolean(id);

  const handleChangeTab = (newValue: string, isFormDirty: boolean = false) => {
    if (isFormDirty && newValue !== activeTab) {
      NiceModal.show(MODAL.IS_DIRTY, {
        onSubmit: () => {
          setActiveTab(newValue);
        },
        title: 'Data belum tersimpan, apakah anda ingin menyimpan data ini dan berpindah ke tab lain?',
      });
    } else {
      setActiveTab(newValue);
    }
  };

  const TAB = [
    {
      label: 'General Information',
      value: 'FORM',
    },
    {
      label: 'Internal Assessment',
      value: 'INTERNAL',
    },
  ];

  return {
    TAB,
    activeTab,
    handleChangeTab,
    isEditPage,
  };
};

export default useManagementDetailPage;
