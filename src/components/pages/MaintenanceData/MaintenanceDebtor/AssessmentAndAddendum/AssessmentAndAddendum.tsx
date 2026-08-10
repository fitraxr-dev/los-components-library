'use client';
import React from 'react';


import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useAssessmentAndAddendum from './AssessmentAndAddendum.hooks';


const AssessmentAndAddendum = () => {
  const { tableHeaderList } = useAssessmentAndAddendum();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Perjanjian & Addendum "></Title>
      <SectionTitle title="Perjanjian & Addendum"></SectionTitle>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeaderList}
          tableData={[]}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default AssessmentAndAddendum;
