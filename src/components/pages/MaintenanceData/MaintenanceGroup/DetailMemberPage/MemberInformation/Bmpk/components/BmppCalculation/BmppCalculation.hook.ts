import { useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { maintenanceGroup } from '@/configs/constants/pathname';

import { useMaintenanceGroupContext } from '@/components/layouts/MaintenanceGroupLayout/MaintenanceGroup.context';

import {
  tab,
  tabItems,
  tableHeaderDebtorProposedFacilitiesList,
  tableHeaderGroupProposedFacilitiesList,
} from './BmppCalculation.constants';
import useGetDebtorMaster from './hooks/useGetDebtorMaster';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useBmppCalculation = (props: { params: { groupId?: string; memberId?: string; calculationId?: string}}) => {
  const { groupId, memberId, calculationId } = props.params;
  const params = useParams();
  const [activeTab, setActiveTab] = useState('calculation');
  const debtorIdFromParams = String(params.debtorId);
  const path = usePathname();
  const isIndividual = true;

  const { data: detailMasterDebtor } = useGetDebtorMaster({
    bucketProcessId: calculationId,
    debtorId: memberId,
  });

  const isPemda = detailMasterDebtor?.generalInformation?.isRegionalGovern ?? false;
  const tabsItemPemdaGroup = tabItems.filter((item) => item.value !== tab.SUMMARY);
  const tabs = (isPemda || !isIndividual) ? tabsItemPemdaGroup : tabItems;

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  // Start TabProposedFacilities
  const tableHeaderDebtorProposed: TableHeader[] = [
    ...tableHeaderDebtorProposedFacilitiesList,
  ];

  const tableHeaderGroupProposed: TableHeader[] = [
    ...tableHeaderGroupProposedFacilitiesList,
  ];
  // End TabProposedFacilities

  return {
    activeTab,
    debtorIdFromParams,
    detailMasterDebtor,
    handleChangeTab,
    isIndividual,
    isPemda,
    tabProposedFacilities: {
      tableHeaderDebtor: tableHeaderDebtorProposed,
      tableHeaderGroup: tableHeaderGroupProposed,
    },
    tabs,
  };
};

export default useBmppCalculation;
