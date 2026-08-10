import { useState, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';


const useInformationOther = () => {
  const [activeTab, setActiveTab] = useState('project');
  const { id } = useParams();
  const isEditPage = Boolean(id);

  const TAB = useMemo(() => [
    {
      label: 'Project',
      value: 'project',
    },
    {
      label: 'Informasi Sindikasi',
      value: 'syndication',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ], []);

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
    TAB,
    activeTab,
    handleChangeTab,
    isEditPage,
  };
};

export default useInformationOther;
