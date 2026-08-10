'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import MemoReference from '@/components/shared/SmiSection/MemoReference';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ModalHistoryRating from './components/ModalHistoryRating';
import Rating from './components/Rating';
import { modal } from './RatingAndRiskProfile.constants';
import { useRatingAndRiskProfilePage } from './RatingAndRiskProfile.hook';


const RatingAndRiskProfilePage = () => {
  const theme = useTheme();
  const { processId: identityProcessId } = useIdentity();
  const {
    activeTab,
    handleChangeTab,
    handleSave,
    containerRiskProfile,
    setContainerRiskProfile,
    viewOnly,
    riskProfileData,
    setShouldGoNext,
    handleOpenHistoryModal,
    isRiskProfileLoading,
    processId,
    stepperStatus,
    stepperSteps,
  } = useRatingAndRiskProfilePage();

  useUpdateMipr({
    bucketParent: identityProcessId,
    stepperStatus,
    steps: stepperSteps,
  });

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Tabs
        activeTab={activeTab}
        onChange={handleChangeTab}
        items={[
          {
            label: 'Rating',
          },
          {
            label: 'Profil Resiko',
          },
        ]}
      />
      <TabItem activeValue={activeTab} value={0}>
        <Rating />
      </TabItem>

      <TabItem activeValue={activeTab} value={1}>
        <ColumnWrapper gap={theme.spacing(3)}>

          <RowWrapper justifyContent="space-between" alignItems="center">
            <Title title="Profil Risiko" />
            <Button startIcon="monitor" onClick={handleOpenHistoryModal}>
              View History
            </Button>
          </RowWrapper>
          <TableDebtorInformation module={TypeModule.MIP_REVIEW} process={TypeProcess.MIP_REVIEW} />
          <SectionTitle title="Rating & Profil Risiko" />
          <WordEditor
            isReadOnly={viewOnly}
            container={containerRiskProfile}
            setContainer={setContainerRiskProfile}
            isLoading={isRiskProfileLoading}
            initialValue={riskProfileData}
          />
        </ColumnWrapper>
      </TabItem>

      <MemoReference
        bucketProcessId={processId}
        module={ TypeModule.MIP_REVIEW}
        process={TypeProcess.MIP_REVIEW}
        childProcess={TypeProcess.REVIEWER_DEPI}
      />

      {activeTab === 0 && (
        <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: 3 }}>
          <Button onClick={() => {setShouldGoNext(true); handleSave();}} disabled={viewOnly}>
            Next
          </Button>
        </RowWrapper>
      )}
      {activeTab === 1 && (
        <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: 3 }}>
          <Button onClick={() => {setShouldGoNext(false); handleSave();}} disabled={viewOnly}>
            Save
          </Button>
          <Button onClick={() => {setShouldGoNext(true); handleSave();}} disabled={viewOnly}>
            Next
          </Button>
        </RowWrapper>
      )}

      <ModalDef
        id={modal.HISTORY_RATING}
        component={ModalHistoryRating}
      />
    </ColumnWrapper>

  );
};

export default RatingAndRiskProfilePage;
