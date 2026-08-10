import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useTableDocumentRefina from './TableDocumentRefina.hook';


const TableDocumentRefina = () => {

  const {
    tableHeader,
    documentRefinaList,
  } = useTableDocumentRefina();

  return (
    <>
      <SectionTitle title="Document Refina" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          isLoading={false}
          tableHeader={tableHeader}
          tableData={documentRefinaList}
        />
      </BaseContainer>
    </>
  );
};

export default TableDocumentRefina;
