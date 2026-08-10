import { useEffect, useState } from 'react';

import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useIdentity from '@/hooks/useIdentity';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { tab } from './ConventionalFacility.constants';


const useConventionalFacility = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const [activeTab, setActiveTab] = useState(tab.proposed);
  const { processId } = useIdentity();
  const isDebtor = processId?.includes('DEBT');

  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Facility Management', url: '' },
      { label: 'Fasilitas Konvensional', url: '' }
    ]);
  }, []);

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
  };

  return {
    activeTab,
    debtorData,
    handleChangeTab,
    isDebtor,
  };
};

export default useConventionalFacility;
