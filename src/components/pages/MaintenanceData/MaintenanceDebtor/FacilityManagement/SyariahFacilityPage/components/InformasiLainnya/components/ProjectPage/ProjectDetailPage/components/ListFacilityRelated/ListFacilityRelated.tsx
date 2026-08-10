'use client';
import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { TableHeaderList } from './ListFacilityRelated.constants';
import useListFacilityRelated from './ListFacilityRelated.hooks';


const ListFacilityRelated = () => {
  const { data } = useListFacilityRelated();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="List Facility Related"></SectionTitle>

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={TableHeaderList}
          tableData={data?.contents}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default ListFacilityRelated;
