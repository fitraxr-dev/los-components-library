'use client';
import React from 'react';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import MemoReference from '../components/MemoReference';

import Rating from './components/Rating';
import RiskProfile from './components/RiskProfile';
import { useRatingAndRiskProfilePage } from './RatingAndRiskProfile.hook';


const RatingAndRiskProfilePage = () => {

  const {
    activeTab,
    handleChangeTab,
    handleNext,
  } = useRatingAndRiskProfilePage();

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
        <RiskProfile />
      </TabItem>

      <MemoReference />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button onClick={handleNext}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default RatingAndRiskProfilePage;
