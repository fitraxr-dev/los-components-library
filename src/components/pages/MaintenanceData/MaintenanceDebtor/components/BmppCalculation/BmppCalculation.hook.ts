import { useEffect, useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { bmppMonitoring } from '@/configs/constants/pathname';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import {
  tab,
  tabItems,
  tableHeaderDebtorProposedFacilitiesList,
  tableHeaderGroupProposedFacilitiesList,
} from './BmppCalculation.constants';
import useGetDebtorMaster from './hooks/useGetDebtorMaster';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useBmppCalculation = (props: { params: { calculationId?: string; processId?: string}}) => {
  const { processId, calculationId } = props.params;
  const params = useParams();
  const [activeTab, setActiveTab] = useState('calculation');
  const debtorIdFromParams = String(params.debtorId);
  // const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const isIndividual = true;

  const { data: detailMasterDebtor } = useGetDebtorMaster({
    bucketProcessId: calculationId,
    debtorId: processId,
  });

  const isPemda = detailMasterDebtor?.generalInformation?.isRegionalGovern ?? false;
  const tabsItemPemdaGroup = tabItems.filter((item) => item.value !== tab.SUMMARY);
  const tabs = (isPemda || !isIndividual) ? tabsItemPemdaGroup : tabItems;

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  // useEffect(() => {
  //   handleSetBreadcrumb([
  //     { label: 'Customer Information', url: '' },
  //     { label: 'BMPK/BMPD/BMPP Individual', url: '' },
  //     { label: 'Perhitungan BMPP', url: bmppMonitoring.INDIVIDUAL_CALCULATION_PAGE }
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
