'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketChildList from '@/hooks/services/useGetBucketChildList';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';


const ViewAllDocumentPage = () => {
  const { parentId, childId, processId } = useIdentity();

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.LEGAL_SIGNING,
  });

  const isPemda = Object.values<string>(DebtorNamesetResponseDtoRegionalGovernEnum).includes(
    debtorInfoData?.institutionType || ''
  );

  const { data: childList, isFetching: isLoading } = useGetBucketChildList({
    filter: {
      bucketParent: parentId,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.PROCESSING_TYPE_PK,
    },
    page: {
      itemPerPage: 20,
      noPage: 1,
    },
  });

  const pkptBucketProcessIds = childList?.contents
    .filter((item) => item.bucketProcessId.startsWith('PKPT-'))
    .map((item) => item.bucketProcessId);

  const formattedString = pkptBucketProcessIds?.sort()
    .reverse()
    .join('|');

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="View All Document" />

      <TableDigitalMemo
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.LEGAL_SIGNING}
      />

      <TableFinancingDocument
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.PROCESSING_TYPE_PK}
        title="Document Pembiayaan"
        id={formattedString ?? childId}
      />

      <TableSupportingDocument
        title="Supporting Document"
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.PROCESSING_TYPE_PK}
        id={formattedString ?? childId}
      />

      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.ENGAGEMENT_AGREEMENT}
          process={TypeProcess.LEGAL_SIGNING}
        />
      )}

      <TableEloDocument
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.LEGAL_SIGNING}
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
