import { useEffect } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';


const useProjectDetailPage = () => {
  const pathname = usePathname();
  const theme = useTheme();
  const { processId } = useIdentity();
  const { id, projectId } = useParams();
  const isMaster = pathname.split('/').includes('master');

  const { handleSetBreadcrumb } = useMaintenanceDataContext();

  useEffect(() => {
    handleSetBreadcrumb([
      {
        label: 'Fasilitas Syariah',
        url: maintenanceDebtor.SYARIAH_FACILITY_PAGE.replace('[module]', isMaster ? 'master' : 'maintenance').replace('[processId]', processId as string),
      },
      {
        label: 'Informasi Lainnya',
        url: isMaster ?
          maintenanceDebtor.DETAIL_INFORMASI_LAINNYA.replace('[module]', isMaster ? 'master' : 'maintenance').replace('[processId]', processId as string).replace('[id]', id as string)
          :
          maintenanceDebtor.EDIT_INFORMASI_LAINNYA.replace('[module]', isMaster ? 'master' : 'maintenance').replace('[processId]', processId as string).replace('[id]', id as string),
      },
      {
        label: 'Detail Project',
        url: '',
      },
    ]);
  }, []);

  const methods = useForm({
    defaultValues: {
    },
  });

  const handleSaveMethod = () => {
    console.log(methods.getValues());
  };

  const [activeTab, setActiveTab] = useSessionStorage('activeTab', 0);

  const handleChangeTab = (val: number) => {
    setActiveTab(val);
  };


  const tabItems = [
    { label: 'Project' },
    { label: 'Informasi Project Lainnya' },
    { label: 'Project Owner' },
    { label: 'Contractor' },
  ];

  return {
    activeTab,
    handleChangeTab,
    handleSaveMethod,
    methods,
    tabItems,
    theme,
  };
};

export default useProjectDetailPage;
