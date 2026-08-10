'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import useViewAllDocument from './ViewAllDocument.hook';


const ViewAllDocumentPage = () => {
  const theme = useTheme();
  const { isPemda } = useViewAllDocument();
  const { processId } = useIdentity();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />
      <Title title="View All Document" />

      <TableDigitalMemo
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />

      <TableFinancingDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />

      <TableSupportingDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />

      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.REVIEWER_DEPI}
        />
      )}
      <TableEloDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
