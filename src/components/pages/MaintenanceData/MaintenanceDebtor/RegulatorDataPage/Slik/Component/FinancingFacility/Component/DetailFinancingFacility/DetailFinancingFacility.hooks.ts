import { useEffect, useMemo, useState } from 'react';

import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import { accessid } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';

import useGetDeltaTabSlik from '../../../../hooks/useGetDeltaTabSlik';


import { tab } from './DetailFinancingFacility.constant';


export const useDetailFinancingFacility = () => {
  const theme = useTheme();
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [activeTab, setActiveTab] = useState(tab.FACILITAS_PEMBIAYAAN);
  const { processId } = useIdentity();

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

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

  return {
    activeTab,
    deltaTab,
    handleChangeTab,
    methods,
    theme,
  };
};
