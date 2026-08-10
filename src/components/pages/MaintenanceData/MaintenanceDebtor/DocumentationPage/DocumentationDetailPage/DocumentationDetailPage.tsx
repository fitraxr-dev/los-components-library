import React from 'react';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import DigitalMemo from './components/DigitalMemo';
import FinancingDocument from './components/FinancingDocument';
import SupportingDocument from './components/SupportingDocument';


const DocumentationDetailPage = () => {
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Project" />
      <DigitalMemo />
      <FinancingDocument />
      <SupportingDocument />

    </ColumnWrapper>
  );
};

export default DocumentationDetailPage;
