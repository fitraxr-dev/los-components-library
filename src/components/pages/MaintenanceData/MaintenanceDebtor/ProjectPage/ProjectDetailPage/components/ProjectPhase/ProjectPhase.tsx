import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import EditProjectPhase from '../EditProjectPhase/EditProjectPhase';

import useProjectPhase from './ProjectPhase.hooks';


const ProjectPhase = () => {
  const { tableHeaderList, data } = useProjectPhase();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Project Phase" />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table tableHeader={tableHeaderList} tableData={data?.contents} />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef id="EDIT_PROJECT_PHASE" component={EditProjectPhase} />
    </>
  );
};

export default ProjectPhase;
