import { useEffect } from 'react';

import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';


import { tabs } from './MemberInformation.constant';


const useMemberInformation = () => {

  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const router = useCustomRouter();
  const pathname = usePathname();
  const { processId } = useIdentity();
  const { groupId } = useParams();
  const { recordActivity } = useRecordLog();
  const methods = useForm({
    defaultValues: {
    },
  });

  const [activeTab, setActiveTab] = useSessionStorage('activeTab-memberInformation', tabs.MEMBER_INFORMATION);

  const handleChangeTab = (val: number) => {
    setActiveTab(val);
  };

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer group information detail - member information page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Group Information', url: `/maintenance-data/maintenance-debtor/maintenance/${processId}/group-information` },
      { label: 'Detail Group', url: `/maintenance-data/maintenance-debtor/maintenance/${processId}/group-information/${groupId}` },
      { label: 'Member Information', url: '' },
    ]);
  }, []);


  return {
    activeTab,
    handleChangeTab,
    methods,
  };
};

export default useMemberInformation;
