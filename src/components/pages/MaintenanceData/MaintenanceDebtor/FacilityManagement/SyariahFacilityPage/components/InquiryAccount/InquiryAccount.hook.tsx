import { useEffect, useMemo } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { inquiryAccountSectionData } from './InquiryAccount.constants';


const useInquiryAccount = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const pathname = usePathname();
  const isMaster = pathname.split('/').includes('master');
  const inquiry = sessionStorage.getItem('inquiry-account');
  const InquiryAccount = inquiry && JSON.parse(inquiry);
  const { recordActivity } = useRecordLog();

  const { id, processId } = params;

  const isDebtor = processId?.includes('DEBT');

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Fasilitas Syariah', url: maintenanceDebtor.SYARIAH_FACILITY_PAGE.replace('[processId]', processId as string).replace('[module]', isMaster ? 'master' : 'maintenance') },
      { label: 'Inquiry Limit', url: '' },
    ]);

    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-syariah',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view detail inquiry account',
    });
  }, []);

  const sectionInquiryAccount = useMemo(() => inquiryAccountSectionData.map((item) => ({
    ...item,
    value: InquiryAccount ? InquiryAccount[item.key] : '',
  })), [InquiryAccount]);

  return {
    id,
    isDebtor,
    isMaster,
    processId,
    router,
    sectionInquiryAccount,
    theme,
  };
};
export default useInquiryAccount;
