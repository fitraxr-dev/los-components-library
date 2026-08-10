import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useProjectPhase from './ProjectPhase.hooks';


const ProjectPhase = () => {
  const { TableHeaderList, data } = useProjectPhase();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Project Phase" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table tableHeader={TableHeaderList} tableData={data?.contents} />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default ProjectPhase;
