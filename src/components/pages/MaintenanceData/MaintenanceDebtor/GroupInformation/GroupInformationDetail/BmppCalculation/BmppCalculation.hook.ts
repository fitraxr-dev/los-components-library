import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import useIdentity from '@/hooks/useIdentity';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import {
  tab,
  tabItems,
  tableHeaderDebtorProposedFacilitiesList,
  tableHeaderGroupProposedFacilitiesList,
} from './BmppCalculation.constants';
import useGetDebtorMaster from './hooks/useGetDebtorMaster';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useBmppCalculation = (props: { params: { calculationId?: string; id?: string}}) => {
  const { id, calculationId } = props.params;
  const params = useParams();
  const [activeTab, setActiveTab] = useState('calculation');
  const debtorIdFromParams = String(params.debtorId);
  // const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const isIndividual = false;
  // const { processId } = useIdentity();
  // const { groupId } = useParams();


  const { data: detailMasterDebtor } = useGetDebtorMaster({
    bucketProcessId: calculationId,
    debtorId: id,
  });

  const isPemda = detailMasterDebtor?.generalInformation?.isRegionalGovern ?? false;
  const tabsItemPemdaGroup = tabItems.filter((item) => item.value !== tab.SUMMARY);
  const tabs = (isPemda || !isIndividual) ? tabsItemPemdaGroup : tabItems;

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  // useEffect(() => {
  //   handleSetBreadcrumb([
  //     { label: 'Group Information', url: `` },
  //     { label: 'Detail Group', url: `` },
  //     { label: 'Member Information', url: '' },
  //   ]);
  // }, []);

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
