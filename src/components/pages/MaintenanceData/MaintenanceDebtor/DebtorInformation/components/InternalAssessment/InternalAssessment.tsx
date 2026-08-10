import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { TableHeaderList } from './InternalAssessment.constants';
import useInternalAssessment from './InternalAssessment.hooks';


const InternalAssessment = () => {
  const { data } = useInternalAssessment();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Internal Assessment"></SectionTitle>

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table tableHeader={TableHeaderList} tableData={data?.contents} />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default InternalAssessment;
