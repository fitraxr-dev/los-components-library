import { useEffect, useMemo, useState } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../../ManagementShareholder/ManagementShareholder.constants';

import useGetDeltaTabSlik from './hooks/useGetDeltaTabSlik';
import { tab } from './Slik.constants';


const useSlik = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(tab.CUSTOMER);
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { processId } = useIdentity();

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: processId?.includes('DEBT'),
  });

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId) enabled = true;

    return enabled;
  }, [bucketDetail]);

  const { data: deltaTab } = useGetDeltaTabSlik({
    ...payloadFilterList(processId as string),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: isEnabledDataDelta,
  });

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Regulator Data', url: '' },
      { label: 'Slik', url: '' }
    ]);
  }, []);

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const watchFields = methods.watch();

  return {
    activeTab,
    deltaTab,
    handleChangeTab,
    methods,
    theme,
    watchFields,
  };
};
export default useSlik;
