'use client';
import React, { useCallback, useState } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import isEqual from 'lodash/isEqual';

import useViewOnly from '@/hooks/useViewOnly';
import { BmppDetailRequestDtoBmppTypeEnum } from '@/services/openapi/mip-service';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TabBmppCalculation from '@/components/shared/SmiSection/Bmpp/TabBmppCalculation';
import TabExistingFacilitiesList from '@/components/shared/SmiSection/Bmpp/TabExistingFacilitiesList';
import TabSummary from '@/components/shared/SmiSection/Bmpp/TabSummary';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import { modal, tab } from './BmppCalculation.constants';
import useBmppCalculation from './BmppCalculation.hook';
import ModalFacilityProposalPlan from './components/ModalFacilityProposedPlan';


const BmppCalculationPage = () => {

  const theme = useTheme();
  const { viewOnly } = useViewOnly();

  const {
    activeTab,
    handleChangeTab,
    isPemda,
    processId,
    debtorId,
    detailMasterDebtor,
    module,
    process,
    tabExistingFacilities,
    tabProposedFacilities,
    tabs,
    goToNextStep,
  } = useBmppCalculation();
  const { isDepiDivision } = useAnnualReviewContext();

  const {
    customerName: debtorName,
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
      {isDepiDivision && <ConfirmationLatest />}
      <Title title="Perhitungan BMPP" />
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={tabs}
      />

      <TabItem activeValue={activeTab} value={tab.CALCULATION}>
        <TabBmppCalculation
          module={module}
          process={process}
          processId={processId}
          handleNext={() => isPemda ? handleChangeTab(tab.EXISTING_FACILITIES) : handleChangeTab(tab.SUMMARY)}
          bmppType={bmppType}
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
          // isMipBmpp={true}
          isPemda={isPemda}
          groupOptionsList={tabExistingFacilitiesData.groupOptionsList}
          disableExchangeRate
          hideActionButton
        />
      </TabItem>

      <ModalDef id={modal.facilityProposalPlan} component={ModalFacilityProposalPlan} />
    </ColumnWrapper>
  );
};

export default BmppCalculationPage;
