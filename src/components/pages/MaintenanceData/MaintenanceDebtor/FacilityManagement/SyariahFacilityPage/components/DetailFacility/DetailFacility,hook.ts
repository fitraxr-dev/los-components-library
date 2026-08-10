import { useState, useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useSearchParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';


const useDetailFacility = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('child-limit');

  useEffect(() => {
    const menuParam = searchParams.get('menu');
    if (menuParam === 'child-limit' || menuParam === 'other-information') {
      setActiveTab(menuParam);
    }
  }, [searchParams]);

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

  return {
    activeTab,
    handleChangeTab,
  };
};

export default useDetailFacility;
