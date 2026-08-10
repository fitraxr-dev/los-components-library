'use client';
import * as React from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useViewAllDocument from './ViewAllDocument.hook';


const ViewAllDocumentPage = () => {
  const bucket = useSpfpBucketContext();
  const [state] = useApp();
  const isDpop = (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode?.includes('DPOP');
  const { processId } = useIdentity();
  const { theme, isPemda } = useViewAllDocument();
  const { recordActivity } = useRecordLog();

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `view all document page for bucket: ${bucket?.bucketProcessId}`,
    });
  }, [recordActivity, bucket?.bucketProcessId, bucket?.module, bucket?.process]);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isDpop && (
        <ConfirmationLatest />
      )}
      <Title title="View All Document" />

      <TableDigitalMemo
        {...bucket}
      />

      <TableFinancingDocument
        title="Document Pembiayaan"
        documentParent={DocumentCreationRequestDtoDocumentParentEnum.FINANCINGDOCUMENT}
        {...bucket}
        showModalSelector
      />

      <TableSupportingDocument
        title="Supporting Document"
        documentParent={DocumentCreationRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT}
        {...bucket}
        showModalSelector
      />

      {isPemda && (
        <TableRefinaDocument
          {...bucket}
        />
      )}

      <TableEloDocument
        title="Document ELO"
        {...bucket}
        documentParent={DocumentCreationRequestDtoDocumentParentEnum.ELO}
        showModalSelector
      />

    </ColumnWrapper>
  );
};


export default ViewAllDocumentPage;
