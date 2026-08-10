'use client';
import { useCallback, useState } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { BmppDetailRequestDtoBmppTypeEnum } from '@/services/openapi/mip-service';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TabBmppCalculation from '@/components/shared/SmiSection/Bmpp/TabBmppCalculation';
import TabExistingFacilitiesList from '@/components/shared/SmiSection/Bmpp/TabExistingFacilitiesList';
import TabProposedFacilitiesList from '@/components/shared/SmiSection/Bmpp/TabProposedFacilitiesList';
import TabSummary from '@/components/shared/SmiSection/Bmpp/TabSummary';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import ModalFacilityProposalPlan from './components/ModalFacilityProposedPlan';
import { modal, tab } from './Detail.constants';
import useDetailPage from './Detail.hook';


const DetailPage = () => {
  const theme = useTheme();

  const {
    activeTab,
    handleChangeTab,
    isMipBmpp,
    isPemda,
    debtorIdFromParams,
    tabProposedFacilities,
    detailMasterDebtor,
    tabExistingFacilities,
    tabs,
  } = useDetailPage();

  const [tabExistingFacilitiesData, setTabExistingFacilitiesData] = useState({ groupOptionsList: []});
  const [tabProposedFacilitiesData, setTabProposedFacilitiesData] = useState({ groupOptionsList: []});

  const handleCalculationDataChange = useCallback((updatedData) => {
    setTabExistingFacilitiesData((prevData) => {
      if (JSON.stringify(prevData.groupOptionsList) !== JSON.stringify(updatedData.groupOptionsList)) {
        return { ...prevData, groupOptionsList: updatedData.groupOptionsList };
      }
      return prevData;
    });

    setTabProposedFacilitiesData((prevData) => {
      if (JSON.stringify(prevData.groupOptionsList) !== JSON.stringify(updatedData.groupOptionsList)) {
        return { ...prevData, groupOptionsList: updatedData.groupOptionsList };
      }
      return prevData;
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
          module={TypeModule.BMPP}
          process={TypeProcess.BMPP}
          handleNext={() => isPemda ? handleChangeTab(tab.EXISTING_FACILITIES) : handleChangeTab(tab.SUMMARY)}
          bmppType={bmppType}
          processId={debtorIdFromParams}
          debtorId={debtorIdFromParams}
          isMipBmpp={isMipBmpp}
          isPemda={isPemda}
          viewOnly={false}
          dataMasterDebtor={detailMasterDebtor}
          standaloneBmppSimulation={true}
          onDataChange={handleCalculationDataChange}
          withTableDebtorInformation={true}
          isUseGetMasterDetail={true}
        />
      </TabItem>

      {!isPemda && (
        <TabItem activeValue={activeTab} value={tab.SUMMARY}>
          <TabSummary
            module={TypeModule.BMPP}
            process={TypeProcess.BMPP}
            handleNext={() => handleChangeTab(tab.EXISTING_FACILITIES)}
            processId={debtorIdFromParams}
            standaloneBmppSimulation={true}
            withTableDebtorInformation={true}
            isUseGetMasterDetail={true}
          />
        </TabItem>
      )}

      {/* Tab Surat Hutang */}
      {/* {!isPemda && (
        <TabItem activeValue={activeTab} value={tab.DEBT_SECURITIES}>
            <TabDebtSecuritiesPlacementList
              module={TypeModule.BMPP}
              process={TypeProcess.BMPP}
              handleNext={() => handleChangeTab(tab.EXISTING_FACILITIES)}
              debtorName={detailMasterDebtor?.name}
              handleOnClickInquiry={() => {}}
              isPemda={isPemda}
              processId={debtorIdFromParams}
              viewOnly
              tableDataDebtor={tabDebtSecurities.tableDataDebtor}
              isTableDataDebtorLoading={tabDebtSecurities.isDebtorLoading}
              isTableDataDebtorSuccess={tabDebtSecurities.isDebtorSuccess}
              tableDataGroup={tabDebtSecurities.tableDataGroup}
              isTableDataGroupLoading={tabDebtSecurities.isGroupLoading}
            />
        </TabItem>
      )} */}

      <TabItem activeValue={activeTab} value={tab.EXISTING_FACILITIES}>
        <TabExistingFacilitiesList
          bmppType={bmppType}
          module={TypeModule.BMPP}
          process={TypeProcess.BMPP}
          handleNext={() => handleChangeTab(tab.PROPOSED_FACILITIES)}
          debtorName={detailMasterDebtor?.name}
          processId={debtorIdFromParams}
          debtorId={debtorIdFromParams}
          tableDataDebtor={tabExistingFacilities.tableDataDebtor}
          isTableDataDebtorSuccess={tabExistingFacilities.isSuccess}
          isTableDataDebtorLoading={tabExistingFacilities.isDebtorLoading}
          viewOnly={false}
          isMipBmpp={isMipBmpp}
          isPemda={isPemda}
          groupOptionsList={tabExistingFacilitiesData.groupOptionsList}
          withTableDebtorInformation={true}
          isUseGetMasterDetail={true}
        />
      </TabItem>

      <TabItem activeValue={activeTab} value={tab.PROPOSED_FACILITIES}>
        <TabProposedFacilitiesList
          module={TypeModule.BMPP}
          process={TypeProcess.BMPP}
          processId={debtorIdFromParams}
          debtorName={detailMasterDebtor?.name}
          debtorId={debtorIdFromParams}
          handleOnClickAddNew={(val) => tabProposedFacilities.handleOpenAddNewModal(val)}
          disabledAddNewDebtor={tabProposedFacilities.hasEditableDebtor}
          tableHeaderDebtor={tabProposedFacilities.tableHeaderDebtor}
          tableHeaderGroup={tabProposedFacilities.tableHeaderGroup}
          tableDataDebtor={tabProposedFacilities.tableDataDebtor}
          tableDataGroup={tabProposedFacilities.tableDataGroup}
          isTableDataDebtorSuccess={tabProposedFacilities.isSuccess}
          isTableDataDebtorLoading={tabProposedFacilities.isDebtorLoading}
          isTableDataGroupLoading={tabProposedFacilities.isGroupLoading}
          isMipBmpp={isMipBmpp}
          isPemda={isPemda}
          groupOptionsList={tabProposedFacilitiesData.groupOptionsList}
          withTableDebtorInformation={true}
          isUseGetMasterDetail={true}
        />
      </TabItem>

      <ModalDef id={modal.facilityProposalPlan} component={ModalFacilityProposalPlan} />
    </ColumnWrapper>
  );
};

export default DetailPage;
