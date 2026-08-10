import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { TableHeaderList } from './CoBorrower.constants';
import useCoBorrower from './CoBorrower.hooks';


const CoBorrower = () => {
  const { data } = useCoBorrower();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Co Borrower"></SectionTitle>

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table tableHeader={TableHeaderList} tableData={data?.contents} />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default CoBorrower;
