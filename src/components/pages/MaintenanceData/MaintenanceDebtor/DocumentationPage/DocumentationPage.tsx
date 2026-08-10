'use client';
import React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useDocumentationPage from './DocumentationPage.hooks';


const DocumentationPage = () => {
  const { tableHeaderList } = useDocumentationPage();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Documentation "></Title>
      <SectionTitle title="Documentation"></SectionTitle>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeaderList}
          tableData={[]}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default DocumentationPage;
