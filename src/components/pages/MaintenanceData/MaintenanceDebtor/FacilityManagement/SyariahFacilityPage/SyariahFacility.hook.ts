import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { tab } from './SyariahFacility.constants';


const useSyariahFacility = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const [activeTab, setActiveTab] = useState(tab.proposed);
  const params = useParams();
  const { processId } = params;

  const isDebtor = processId?.includes('DEBT');

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Facility Management', url: '' },
      { label: 'Fasilitas Syariah', url: '' }
    ]);
  }, []);

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
  };

  return {
    activeTab,
    handleChangeTab,
    isDebtor,
  };
};

export default useSyariahFacility;
