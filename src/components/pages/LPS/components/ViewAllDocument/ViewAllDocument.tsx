'use client';
import { TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../ConfirmationLatest/ConfirmationLatest';


const ViewAllDocument = (props: SmiComponentProps) => {
  const { module, process } = props;
  const { processId, parentId } = useIdentity();
  const isDpop = TypeProcess.LPS_BAST_DPOP === process;
  const [{ pages }] = useApp();


  /**
   * Helper function to get the ID for tables
   * LPS BAST DPOP - Using parentId
   * LPS Core - Using sibling processId
   * LPS BAST Bisnis - Using processId
   */
  const getId = () => {
    if (isDpop) return parentId;
    return props.id !== null ? props.id : processId;
  };

  const { data: debtorInfo } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: pages.module,
    process: pages.process,
  });

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfo?.institutionType);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isDpop && (
        <ConfirmationLatest />
      )}
      <Title title="View All Document" />

      {/* Digital Memo Table */}
      <TableDigitalMemo
        module={module}
        process={TypeProcess.LPS_BAST}
        id={getId()}
      />

      {/* Financing and Supporting Documents */}
      <TableFinancingDocument
        module={module}
        process={TypeProcess.LPS_BAST}
        id={getId()}
      />
      <TableSupportingDocument
        module={module}
        process={TypeProcess.LPS_BAST}
        id={getId()}
      />

      {/* ELO and Refina Tables */}
      {isPemda && (
        <TableRefinaDocument
          module={module}
          process={TypeProcess.LPS_BAST}
        />
      )}
      <TableEloDocument
        module={module}
        process={TypeProcess.LPS_BAST}
        showModalSelector={true}
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocument;
