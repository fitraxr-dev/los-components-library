'use client';
import React, { useCallback, useState } from 'react';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { BmppDetailRequestDtoBmppTypeEnum } from '@/services/openapi/mip-service';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import TableDebtorInformation from '../TableDebtorInformation/TableDebtorInformation';

import { tab } from './BmppCalculation.constants';
import useBmppCalculation from './BmppCalculation.hook';
import TabBmppCalculation from './TabBmppCalculation';
import TabExistingFacilitiesList from './TabExistingFacilitiesList';
import TabProposedFacilitiesList from './TabProposedFacilitiesList';
import TabSummary from './TabSummary';

import type { ReactNode } from 'react';


const BmppCalculation = (props: { params: { id: string; calculationId: string} }) => {
  const { groupId, calculationId } = props.params;
  const id = groupId;
  const theme = useTheme();

  const {
    activeTab,
    handleChangeTab,
    isIndividual,
    isPemda,
    tabProposedFacilities,
    detailMasterDebtor,
    tabs,
  } = useBmppCalculation(props);

  const debtorDetail = detailMasterDebtor?.generalInformation;
  const [tabExistingFacilitiesData, setTabExistingFacilitiesData] = useState({ detailGroup: {}, groupOptionsList: []});
  const [tabProposedFacilitiesData, setTabProposedFacilitiesData] = useState({ detailGroup: {}, groupOptionsList: []});

  const handleCalculationDataChange = useCallback((updatedData) => {
    setTabExistingFacilitiesData((prevData) => {
      if (JSON.stringify(prevData.groupOptionsList) !== JSON.stringify(updatedData.groupOptionsList)) {
        return { ...prevData, groupOptionsList: updatedData.groupOptionsList };
      }

      if (JSON.stringify(prevData.detailGroup) !== JSON.stringify(updatedData.detailGroup)) {
        return { ...prevData, detailGroup: updatedData.detailGroup };
      }
      return prevData;
    });

    setTabProposedFacilitiesData((prevData) => {
      if (JSON.stringify(prevData.groupOptionsList) !== JSON.stringify(updatedData.groupOptionsList)) {
        return { ...prevData, groupOptionsList: updatedData.groupOptionsList };
      }

      if (JSON.stringify(prevData.detailGroup) !== JSON.stringify(updatedData.detailGroup)) {
        return { ...prevData, detailGroup: updatedData.detailGroup };
      }
      return prevData;
    });
  }, []);

  const bmppType = isPemda
    ? BmppDetailRequestDtoBmppTypeEnum.PEMDA
    : BmppDetailRequestDtoBmppTypeEnum.NONPEMDA;

  const TabWrapper = ({ children }: {children: ReactNode}) => {
    return (
      <ColumnWrapper gap={theme.spacing(3)}>
        { isIndividual &&
          <TableDebtorInformation
            debtorName={debtorDetail?.debtorName}
            gamName={detailMasterDebtor?.anotherInformation?.gam}
            staffName={debtorDetail?.staffName}
            isNewClient={!debtorDetail?.isExisting}
            cif={debtorDetail?.cif}
            division={debtorDetail?.division}
            debtorId={detailMasterDebtor?.debtorId}
            createdAt={debtorDetail?.createdDate}
          />
        }
        {children}
      </ColumnWrapper>
    );
  };

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Title title="Perhitungan BMPP" />
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={tabs}
      />

      <TabItem activeValue={activeTab} value={tab.CALCULATION}>
        <TabWrapper>
          <TabBmppCalculation
            module={TypeModule.BMPP}
            process={TypeProcess.BMPP}
            bmppType={bmppType}
            calculationId={calculationId}
            debtorId={id}
            isIndividual={isIndividual}
            isPemda={isPemda}
            viewOnly={false}
            dataMasterDebtor={detailMasterDebtor}
            onDataChange={handleCalculationDataChange}
          />
        </TabWrapper>
      </TabItem>

      {!isPemda && isIndividual && (
        <TabItem activeValue={activeTab} value={tab.SUMMARY}>
          <TabWrapper>
            <TabSummary
              module={TypeModule.BMPP}
              process={TypeProcess.BMPP}
              processId={calculationId}
            />
          </TabWrapper>
        </TabItem>
      )}

      <TabItem activeValue={activeTab} value={tab.EXISTING_FACILITIES}>
        <TabWrapper>
          <TabExistingFacilitiesList
            bmppType={bmppType}
            module={TypeModule.BMPP}
            process={TypeProcess.BMPP}
            debtorName={detailMasterDebtor?.generalInformation?.debtorName}
            processId={calculationId}
            id={id}
            viewOnly={false}
            isPemda={isPemda}
            isIndividual={isIndividual}
            groupOptionsList={tabExistingFacilitiesData.groupOptionsList}
            detailGroup={tabExistingFacilitiesData?.detailGroup}
            calculationId={calculationId}
          />
        </TabWrapper>
      </TabItem>

      <TabItem activeValue={activeTab} value={tab.PROPOSED_FACILITIES}>
        <TabWrapper>
          <TabProposedFacilitiesList
            processId={calculationId}
            debtorName={detailMasterDebtor?.generalInformation?.debtorName}
            id={id}
            tableHeaderDebtor={tabProposedFacilities.tableHeaderDebtor}
            tableHeaderGroup={tabProposedFacilities.tableHeaderGroup}
            isPemda={isPemda}
            isIndividual={isIndividual}
            groupOptionsList={tabProposedFacilitiesData.groupOptionsList}
            detailGroup={tabProposedFacilitiesData?.detailGroup}
            calculationId={calculationId}
          />
        </TabWrapper>
      </TabItem>

    </ColumnWrapper>
  );
};

export default BmppCalculation;
