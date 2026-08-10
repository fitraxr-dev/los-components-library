import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useTableDocumentELO from './TableDocumentELO.hook';


const TableDocumentELO = () => {

  const {
    tableHeader,
    documentELOList,
  } = useTableDocumentELO();

  return (
    <>
      <SectionTitle title="Document ELO" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          isLoading={false}
          tableHeader={tableHeader}
          tableData={documentELOList}
        />
      </BaseContainer>
    </>
  );
};

export default TableDocumentELO;
