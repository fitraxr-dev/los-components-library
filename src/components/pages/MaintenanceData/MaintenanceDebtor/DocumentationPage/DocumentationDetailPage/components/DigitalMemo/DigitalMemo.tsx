import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { TableHeaderList } from '../../DocumentationDetailPage.constants';


const DigitalMemo = () => {
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Digital Memo"></SectionTitle>

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={TableHeaderList}
          tableData={[]}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default DigitalMemo;
