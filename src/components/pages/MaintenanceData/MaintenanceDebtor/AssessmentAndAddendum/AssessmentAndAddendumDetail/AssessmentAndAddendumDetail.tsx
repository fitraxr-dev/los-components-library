'use client';
import React from 'react';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import Detail from './components/Detail';
import DetailFacility from './components/DetailFacility';


const AssessmentAndAddendumDetail = () => {
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Perjanjian & Addendum" />
      <Detail />
      <DetailFacility />

    </ColumnWrapper>
  );
};

export default AssessmentAndAddendumDetail;
