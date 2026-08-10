import { useCallback, useEffect, useState } from 'react';

import isEqual from 'lodash/isEqual';

import { ONE_MINUTE } from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import useGetDebtorMaster from '@/hooks/services/master/maintenance-customer/useGetDebtorMaster';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDebtorGroupProposalList from '@/hooks/services/useGetDebtorGroupProposalList';
import useGetDebtorProposalList from '@/hooks/services/useGetDebtorProposalList';
import useGetDebtSecuritiesDebtorList from '@/hooks/services/useGetDebtSecuritiesDebtorList';
import useGetDebtSecuritiesGroupExcludeDebtorList from '@/hooks/services/useGetDebtSecuritiesGroupExcludeDebtorList';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPAccess } from '../hooks/useMUPAccess';


import {
  tab,
  tabItems,
  tableHeaderDebtorProposedFacilitiesList,
  tableHeaderGroupProposedFacilities,
} from './Bmpp.constants';


const useBmpp = () => {
  const { processId } = useIdentity();
  const [activeTab, setActiveTab] = useState('calculation');
  const { baseMUPAccess, isAnalyst } = useMUPAccess();
  const { recordActivity } = useRecordLog();
  const { viewOnly } = useViewOnly();

  const [tabExistingFacilitiesData, setTabExistingFacilitiesData] = useState({ groupOptionsList: []});
  const [tabProposedFacilitiesData, setTabProposedFacilitiesData] = useState({ groupOptionsList: []});

  const handleCalculationDataChange = useCallback((updatedData) => {
    setTabExistingFacilitiesData((prev) => {
      const diff = !isEqual(prev.groupOptionsList, updatedData.groupOptionsList);
      return diff ? { ...prev, groupOptionsList: updatedData.groupOptionsList } : prev;
    });

    setTabProposedFacilitiesData((prev) => {
      const diff = !isEqual(prev.groupOptionsList, updatedData.groupOptionsList);
      return diff ? { ...prev, groupOptionsList: updatedData.groupOptionsList } : prev;
    });
  }, []);

  const canViewBmpp = baseMUPAccess.canView;
  const isViewOnlyMode = viewOnly || isAnalyst || !baseMUPAccess.canUpdate;

  useEffect(() => {
    if (!canViewBmpp) {
      return;
    }

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `view BMPP calculation page - initial tab: ${activeTab}`,
    });
  }, [canViewBmpp, processId, recordActivity]);

  const { data: bucketDetail } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const groupId = bucketDetail?.groupId;
  const debtorName = bucketDetail?.debtorName;

  const { data: debtorInfo } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });
  const typeFinancing = debtorInfo?.typeFinancing;
  const debtorId = debtorInfo?.debtorId;

  const { data: detailMasterDebtor } = useGetDebtorMaster({
    bucketProcessId: processId,
    debtorId: debtorId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  }, { enabled: !!processId && !!debtorId });

  const { data: institutionTypeDropdownList } = useGetParameterList('institutionType', { isPemda: 'value3', label: 'value1', value: 'key' });

  const isPemdaFromInstitutionType = institutionTypeDropdownList
    ?.find((dt) => dt.value === detailMasterDebtor?.institutionType)
    ?.isPemda === 'PEMDA';

  const isPemda = isPemdaFromInstitutionType ?? (typeFinancing === 'MUNICIPAL_FINANCING');

  const tabsItemPemda = tabItems.filter((item) => item.value !== tab.SUMMARY && item.value !== tab.DEBT_SECURITIES);
  const tabs = isPemda ? tabsItemPemda : tabItems;

  const handleChangeTab = (tabValue: string) => {
    const selectedTab = tabItems.find((item) => item.value === tabValue);
    const tabLabel = selectedTab?.label || tabValue;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: tabValue,
      changeBefore: activeTab,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `navigate to BMPP tab: ${tabLabel}`,
    });

    setActiveTab(tabValue);
  };

  const handleCalculationNext = () => {
    const nextTab = isPemda ? tab.EXISTING_FACILITIES : tab.SUMMARY;
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: nextTab,
      changeBefore: tab.CALCULATION,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `completed BMPP calculation and moved to tab: ${nextTab}`,
    });

    isPemda ? handleChangeTab(tab.EXISTING_FACILITIES) : handleChangeTab(tab.SUMMARY);
  };

  const handleSummaryNext = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: tab.DEBT_SECURITIES,
      changeBefore: tab.SUMMARY,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'viewed BMPP summary and moved to debt securities tab',
    });
    handleChangeTab(tab.DEBT_SECURITIES);
  };

  const handleExistingFacilitiesNext = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: tab.PROPOSED_FACILITIES,
      changeBefore: tab.EXISTING_FACILITIES,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'viewed existing facilities list and moved to proposed facilities tab',
    });
    handleChangeTab(tab.PROPOSED_FACILITIES);
  };

  const { data: debtSecuritiesData, isLoading: isDebtSecuritiesLoading } = useGetDebtSecuritiesDebtorList({
    debtorId,
  }, {
    enabled: activeTab === tab.DEBT_SECURITIES,
    staleTime: ONE_MINUTE,
  });

  const {
    data: debtSecuritiesGroupData,
    isLoading: isDebtSecuritiesGroupLoading,
  } = useGetDebtSecuritiesGroupExcludeDebtorList({
    debtorId,
  }, {
    enabled: activeTab === tab.DEBT_SECURITIES,
    staleTime: ONE_MINUTE,
  });

  const tableDebtSecuritiesList = debtSecuritiesData?.map((data) => ({
    bonds: data.bonds ?? '-',
    currency: data.currExchangeRate ? data.currExchangeRate : '-',
    faceValue: data.faceValue ? data.faceValue : '-',
    faceValueIdr: data.faceValueInIdr ? data.faceValueInIdr : '-',
    issuer: data.issuer ?? '-',
    maturityDate: data.maturityDate ? formatDate(new Date(data.maturityDate)) : '-',
    sequence: data.seq ?? '-',
  }));

  const tableDebtGroupList = debtSecuritiesGroupData;

  // Start TabProposedFacilities
  const {
    data: debtorDataProposedFacilities,
    isLoading: isDebtorProposedFacilitiesLoading,
    isSuccess: isDebtorProposedFacilitiesSuccess,
  } = useGetDebtorProposalList({
    bucketProcessId: processId,
    debtorId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  }, !!processId && !!debtorId);

  const tableDataDebtorProposedFacilities = debtorDataProposedFacilities?.map((item) => ({
    ...item,
    division: item.divison ?? '-',
    facilityId: item.facilityId,
    governmentMandate: item.governmentMandateLabel ?? '-',
    nominalInIdr: item.orderValueAfterExchangeRate,
    orderType: item.orderTypeLabel ?? '-',
    plafondExisting: item.outstanding,
    product: item.productLabel ?? '-',
    project: item.project?.name ?? '-',
    timePeriod: item.timePeriod ?? '-',
  }));

  const {
    data: groupDataProposedFacilities,
    isLoading: isGroupProposedExistingLoading,
  } = useGetDebtorGroupProposalList({
    bucketProcessId: processId,
    debtorId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  }, !!processId && !!debtorId);

  const tableDataGroupProposedFacilities = groupDataProposedFacilities;
  // End TabProposedFacilities


  const handleNext = () => {
    recordActivity({
      activity: ActivityType.SAVE,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'completed BMPP calculation and moved to next step',
    });
  };

  return {
    activeTab,
    canViewBmpp,
    debtorId,
    debtorName,
    detailMasterDebtor,
    groupId,
    handleCalculationDataChange,
    handleCalculationNext,
    handleChangeTab,
    handleExistingFacilitiesNext,
    handleNext,
    handleSummaryNext,
    isPemda,
    isViewOnlyMode,
    recordActivity,
    tabDebtSecurities: {
      isDebtorLoading: isDebtSecuritiesLoading,
      isGroupLoading: isDebtSecuritiesGroupLoading,
      tableDataDebtor: tableDebtSecuritiesList,
      tableDataGroup: tableDebtGroupList,
    },
    tabExistingFacilitiesData,
    tabProposedFacilities: {
      isDebtorLoading: isDebtorProposedFacilitiesLoading,
      isGroupLoading: isGroupProposedExistingLoading,
      isSuccess: isDebtorProposedFacilitiesSuccess,
      tableDataDebtor: tableDataDebtorProposedFacilities,
      tableDataGroup: tableDataGroupProposedFacilities,
      tableHeaderDebtor: tableHeaderDebtorProposedFacilitiesList,
      tableHeaderGroup: tableHeaderGroupProposedFacilities,
    },
    tabProposedFacilitiesData,
    tabs,
  };
};

export default useBmpp;
