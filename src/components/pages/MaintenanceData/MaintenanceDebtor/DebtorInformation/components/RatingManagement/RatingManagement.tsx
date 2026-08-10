import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { TableHeaderList } from './RatingManagement.constants';
import useRatingManagement from './RatingManagement.hooks';


const RatingManagement = () => {
  const { data } = useRatingManagement();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Rating Management" />

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={TableHeaderList}
          tableData={data?.contents}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default RatingManagement;
