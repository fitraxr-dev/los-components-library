import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { TableHeaderList, TableHeaderList2 } from './GroupMember.constants';
import useGroupMember from './GroupMember.hooks';


const GroupMember = () => {
  const { data, isLoading } = useGroupMember();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Group Member" />

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={TableHeaderList}
          tableData={data}
        />
      </BaseContainer>

      <Title title="BMPK/BMPD/BMPP :"></Title>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={TableHeaderList2}
          tableData={[]}
          isLoading={isLoading}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default GroupMember;
