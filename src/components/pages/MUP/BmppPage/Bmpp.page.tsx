'use client';
import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import { BmppDetailRequestDtoBmppTypeEnum } from '@/services/openapi/mip-service';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TabBmppCalculation from '@/components/shared/SmiSection/Bmpp/TabBmppCalculation';
import TabExistingFacilitiesList from '@/components/shared/SmiSection/Bmpp/TabExistingFacilitiesList';
import TabProposedFacilitiesList from '@/components/shared/SmiSection/Bmpp/TabProposedFacilitiesList';
import TabSummary from '@/components/shared/SmiSection/Bmpp/TabSummary';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import { tab } from './Bmpp.constants';
import useBmpp from './Bmpp.hook';


const BmppPage = () => {
  const theme = useTheme();
  const { goToNextStep } = useMUPContext();
  const { processId } = useIdentity();
  const {
    activeTab,
    handleChangeTab,
    isPemda,
    debtorName,
    debtorId,
    detailMasterDebtor,
    tabProposedFacilities,
    tabs,
    canViewBmpp,
    isViewOnlyMode,
    handleNext,
    handleCalculationDataChange,
    tabExistingFacilitiesData,
    tabProposedFacilitiesData,
    handleCalculationNext,
    handleSummaryNext,
    handleExistingFacilitiesNext,
  } = useBmpp();

  if (!canViewBmpp) {
    return null;
  }

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Title title="Perhitungan BMPP" />

      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={tabs}
      />

      <TabItem activeValue={activeTab} value={tab.CALCULATION}>
        <TabBmppCalculation
          module={TypeModule.MUP}
          process={TypeProcess.MUP}
          debtorId={debtorId}
          processId={processId}
          isPemda={isPemda}
          handleNext={handleCalculationNext}
          bmppType={
            isPemda
              ? BmppDetailRequestDtoBmppTypeEnum.SIMULATIONPEMDA
              : BmppDetailRequestDtoBmppTypeEnum.SIMULATIONNONPEMDA
          }
          viewOnly={isViewOnlyMode}
          withTableDebtorInformation
          onDataChange={handleCalculationDataChange}
          isMipBmpp={true}
          standaloneBmppSimulation={true}
          dataMasterDebtor={detailMasterDebtor}
        />
      </TabItem>

      {!isPemda && (
        <TabItem activeValue={activeTab} value={tab.SUMMARY}>
          <TabSummary
            module={TypeModule.MUP}
            process={TypeProcess.MUP}
            processId={processId}
            viewOnly={isViewOnlyMode}
            handleNext={handleSummaryNext}
            withTableDebtorInformation
          />
        </TabItem>
      )}

      <TabItem activeValue={activeTab} value={tab.EXISTING_FACILITIES}>
        <TabExistingFacilitiesList
          module={TypeModule.MUP}
          process={TypeProcess.MUP}
          handleNext={handleExistingFacilitiesNext}
          debtorName={debtorName}
          viewOnly={isViewOnlyMode}
          processId={processId}
          debtorId={debtorId}
          withTableDebtorInformation
          disableExchangeRate
          hideActionButton
          tableDataDebtor={tabProposedFacilities.tableDataDebtor}
          groupOptionsList={tabExistingFacilitiesData.groupOptionsList}
        />
      </TabItem>
      <TabItem activeValue={activeTab} value={tab.PROPOSED_FACILITIES}>
        <TabProposedFacilitiesList
          module={TypeModule.MUP}
          process={TypeProcess.MUP}
          handleNext={() => {
            handleNext();
            goToNextStep();
          }}
          viewOnly={isViewOnlyMode}
          withNextButton={true}
          debtorId={debtorId}
          withAddButton={false}
          debtorName={debtorName}
          processId={processId}
          withTableDebtorInformation
          tableDataGroup={tabProposedFacilities.tableDataGroup}
          tableDataDebtor={tabProposedFacilities.tableDataDebtor}
          tableHeaderDebtor={tabProposedFacilities.tableHeaderDebtor}
          tableHeaderGroup={tabProposedFacilities.tableHeaderGroup}
          isTableDataDebtorLoading={tabProposedFacilities.isDebtorLoading}
          isTableDataGroupLoading={tabProposedFacilities.isGroupLoading}
          isTableDataDebtorSuccess={tabProposedFacilities.isSuccess}
          groupOptionsList={tabProposedFacilitiesData.groupOptionsList}
        />
      </TabItem>
    </ColumnWrapper>
  );
};

export default BmppPage;
