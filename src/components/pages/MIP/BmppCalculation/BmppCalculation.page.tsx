'use client';
import React, { useCallback, useState } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import isEqual from 'lodash/isEqual';


import { TypeModule, TypeProcess } from '@/enums/Module';
import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import { BmppDetailRequestDtoBmppTypeEnum } from '@/services/openapi/mip-service';

import useMipCcExpired from '@/components/pages/MIP/shared/hooks/useMipCcExpired';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TabBmppCalculation from '@/components/shared/SmiSection/Bmpp/TabBmppCalculation';
import TabExistingFacilitiesList from '@/components/shared/SmiSection/Bmpp/TabExistingFacilitiesList';
import TabProposedFacilitiesList from '@/components/shared/SmiSection/Bmpp/TabProposedFacilitiesList';
import TabSummary from '@/components/shared/SmiSection/Bmpp/TabSummary';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import { modal, tab } from './BmppCalculation.constants';
import useBmppCalculation from './BmppCalculation.hook';
import ModalFacilityProposalPlan from './components/ModalFacilityProposedPlan';

import type { ReactNode } from 'react';


const BmppCalculationPage = () => {

  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const [state] = useApp();
  const { processId: identityProcessId } = useIdentity();

  const {
    activeTab,
    bucketMasterId,
    handleChangeTab,
    isPemda,
    processId,
    debtorId,
    tabProposedFacilities,
    detailMasterDebtor,
    module,
    process,
    stepperStatus,
    stepperSteps,
    tabExistingFacilities,
    tabs,
  } = useBmppCalculation();

  useMipCcExpired({
    bucketMasterId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
    stepperStatus,
    steps: stepperSteps,
  });

  useUpdateMipr({
    bucketParent: identityProcessId,
    stepperStatus,
    steps: stepperSteps,
  });

  const {
    gamName,
    cif,
    customerName: debtorName,
    divisionName,
    isNewDebtor,
    staffName,
    createdDate,
  } = detailMasterDebtor ?? {};


  const [tabExistingFacilitiesData, setTabExistingFacilitiesData] = useState({ groupOptionsList: []});
  const [tabProposedFacilitiesData, setTabProposedFacilitiesData] = useState({ groupOptionsList: []});

  const handleCalculationDataChange = useCallback((updatedData) => {
    console.log('[Parent] handleCalculationDataChange', updatedData);

    setTabExistingFacilitiesData((prev) => {
      const diff = !isEqual(prev.groupOptionsList, updatedData.groupOptionsList);
      console.log('[Parent] update existing?', { diff, next: updatedData.groupOptionsList, prev: prev.groupOptionsList });
      return diff ? { ...prev, groupOptionsList: updatedData.groupOptionsList } : prev;
    });

    setTabProposedFacilitiesData((prev) => {
      const diff = !isEqual(prev.groupOptionsList, updatedData.groupOptionsList);
      console.log('[Parent] update proposed?', { diff, next: updatedData.groupOptionsList, prev: prev.groupOptionsList });
      return diff ? { ...prev, groupOptionsList: updatedData.groupOptionsList } : prev;
    });
  }, []);


  const bmppType = isPemda
    ? BmppDetailRequestDtoBmppTypeEnum.SIMULATIONPEMDA
    : BmppDetailRequestDtoBmppTypeEnum.SIMULATIONNONPEMDA;


  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Title title="Simulasi Perhitungan BMPP" />
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={tabs}
      />

      <TabItem activeValue={activeTab} value={tab.CALCULATION}>
        <TabBmppCalculation
          module={module}
          process={process}
          handleNext={() => isPemda ? handleChangeTab(tab.EXISTING_FACILITIES) : handleChangeTab(tab.SUMMARY)}
          bmppType={bmppType}
          processId={processId}
          debtorId={debtorId}
          isMipBmpp={true}
          isPemda={isPemda}
          viewOnly={viewOnly}
          dataMasterDebtor={detailMasterDebtor}
          standaloneBmppSimulation={true}
          withTableDebtorInformation={true}
          onDataChange={handleCalculationDataChange}
        />
      </TabItem>

      {!isPemda && (
        <TabItem activeValue={activeTab} value={tab.SUMMARY}>
          <TabSummary
            module={module}
            process={process}
            handleNext={() => handleChangeTab(tab.EXISTING_FACILITIES)}
            processId={processId}
            standaloneBmppSimulation={true}
            withTableDebtorInformation={true}
          />
        </TabItem>
      )}

      <TabItem activeValue={activeTab} value={tab.EXISTING_FACILITIES}>
        <TabExistingFacilitiesList
          bmppType={bmppType}
          module={module}
          process={process}
          handleNext={() => handleChangeTab(tab.PROPOSED_FACILITIES)}
          debtorName={debtorName}
          processId={processId}
          withTableDebtorInformation={true}
          debtorId={debtorId}
          tableDataDebtor={tabExistingFacilities.tableDataDebtor}
          isTableDataDebtorSuccess={tabExistingFacilities.isSuccess}
          isTableDataDebtorLoading={tabExistingFacilities.isDebtorLoading}
          viewOnly={viewOnly}
          isMipBmpp={true}
          isPemda={isPemda}
          groupOptionsList={tabExistingFacilitiesData.groupOptionsList}
          disableExchangeRate
          hideActionButton
        />
      </TabItem>

      <TabItem activeValue={activeTab} value={tab.PROPOSED_FACILITIES}>
        <TabProposedFacilitiesList
          module={module}
          process={process}
          processId={processId}
          debtorName={debtorName}
          withTableDebtorInformation={true}
          debtorId={debtorId}
          handleOnClickAddNew={(val) => tabProposedFacilities.handleOpenAddNewModal(val)}
          disabledAddNewDebtor={tabProposedFacilities.hasEditableDebtor}
          tableHeaderDebtor={tabProposedFacilities.tableHeaderDebtor}
          tableHeaderGroup={tabProposedFacilities.tableHeaderGroup}
          tableDataDebtor={tabProposedFacilities.tableDataDebtor}
          tableDataGroup={tabProposedFacilities.tableDataGroup}
          isTableDataDebtorSuccess={tabProposedFacilities.isSuccess}
          isTableDataDebtorLoading={tabProposedFacilities.isDebtorLoading}
          isTableDataGroupLoading={tabProposedFacilities.isGroupLoading}
          isMipBmpp={true}
          withAddButton={false}
          disabledAddNewGroup={true}
          isPemda={isPemda}
          groupOptionsList={tabProposedFacilitiesData.groupOptionsList}
        />
      </TabItem>

      <ModalDef id={modal.facilityProposalPlan} component={ModalFacilityProposalPlan} />
    </ColumnWrapper>
  );
};

export default BmppCalculationPage;
