'use client';
import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeDivision } from '@/enums/Division';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';


const ViewAllDocPage = () => {
  const { setViewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const [{ stepper, pages, userData: { user: { division } } }] = useApp();
  const { processId } = useIdentity();

  const path = usePathname();
  const processUrl = path.split('/')[4];
  const delstProcesses = ['assignment', 'monitoring', 'review'];

  useEffect(() => {
    if (division && division.some((division) => division.divisionCode === TypeDivision.DELST_DIVISION)
      && delstProcesses.includes(processUrl)) {
      setViewOnly(true);
    }
  }, [stepper, division, processUrl, setViewOnly]);

  const { data: debtorInfo } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: pages.module,
    process: pages.process,
  });

  // Record activity when view all document page is loaded
  useEffect(() => {
    if (debtorInfo) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: pages.module,
        process: pages.process,
        remarks: 'view all documents page in technical study review',
      });
    }
  }, [debtorInfo, processId, pages.module, pages.process, recordActivity]);

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfo?.institutionType);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <Title title="View All Document" />

      <TableDigitalMemo
        module={pages.module}
        process={pages.process}
      />

      <TableFinancingDocument
        module={pages.module}
        process={pages.process}
        showModalSelector
      />

      <TableSupportingDocument
        module={pages.module}
        process={pages.process}
        showModalSelector
      />

      {isPemda && (
        <TableRefinaDocument
          module={pages.module}
          process={pages.process}
        />
      )}

      <TableEloDocument
        module={pages.module}
        process={pages.process}
        showModalSelector
      />
    </ColumnWrapper>
  );
};


export default ViewAllDocPage;
