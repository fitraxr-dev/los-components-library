import * as React from 'react';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';

import { useCreditCheckingRequestResultContext } from '../../CreditCheckingRequestResult.context';

import { tab } from './ManagementShareholder.constants';

import type { Tabs } from '@/components/shared/Tabs/types';


const REMARK_KEY_BY_TAB = {
  [tab.DEBTOR]: 'debtorRemark',
  [tab.SHAREHOLDER]: 'shareholderRemark',
  [tab.MANAGEMENT]: 'managementRemark',
  [tab.OTHER_RELATION]: 'otherRelateRemark',
};

const DISABLED_STATUS = new Set(['CC_DPOP_UPLOAD_RESULT']);

const useManagementShareholder = () => {
  const { form, setField, bucketDetail } = useCreditCheckingRequestResultContext();
  const { isRequestModule } = useCreditCheckingContext();
  const { debtorId } = useIdentity();
  const router = useCustomRouter();

  const [activeTab, setActiveTab] = React.useState<Tabs>(tab.DEBTOR);

  const isDisabledRemarkByStatus = React.useMemo(
    () => DISABLED_STATUS.has(bucketDetail?.status ?? ''),
    [bucketDetail?.status],
  );

  const remarkValue = React.useMemo(() => {
    const key = REMARK_KEY_BY_TAB[activeTab] ?? REMARK_KEY_BY_TAB[tab.DEBTOR];
    return form?.[key]?.value ?? '';
  }, [form, activeTab]);

  const handleRemarkChange = React.useCallback(
    (value: string) => {
      const key = REMARK_KEY_BY_TAB[activeTab] ?? REMARK_KEY_BY_TAB[tab.DEBTOR];
      setField(key, value);
    },
    [activeTab, setField],
  );

  const handleViewMaintenanceCustomer = React.useCallback(async () => {
    const path = replacePath(
      maintenanceDebtor.LIST_PAGE,
      { debtorId, from: 'credit-checking', module: 'maintenance' },
    );
    router.replace(path);
  }, [debtorId, router]);

  return {
    activeTab,
    handleRemarkChange,
    handleViewMaintenanceCustomer,
    isDisabledRemarkByStatus,
    isRequestModule,
    remarkValue,
    setActiveTab,
  };
};

export default useManagementShareholder;
