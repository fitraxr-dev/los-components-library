'use client';
import React from 'react';

import { ActivityType } from '@/enums/Activity';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDraftMemoDigital from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoDigital';
import TableDraftMemoFinancingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoFinancingDocument';
import TableDraftMemoHistory from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory';
import TableDraftMemoSupportingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useDraftMemo from './DraftMemo.hook';

import type {
  DraftMemoButtonProps,
} from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory/TableDraftMemoHistory.types';


const DraftMemo = () => {
  const { handleOpenGenerateDraftModal, viewOnly } = useDraftMemo();
  const bucket = useSpfpBucketContext();
  const { recordActivity } = useRecordLog();
  const [state] = useApp();
  const isDpop = (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode?.includes('DPOP');

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `view draft memo page for bucket: ${bucket?.bucketProcessId}`,
    });
  }, [recordActivity, bucket?.bucketProcessId, bucket?.module, bucket?.process]);


  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftModal,
  }];

  const historyProcess = React.useMemo(() => {
    if (bucket?.process === 'SPFP_DPOP') {
      return 'SPFP_DPOP|SPFP_VERIFICATION_DPOP';
    }
    return bucket?.process;
  }, [bucket?.process]);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isDpop && (
        <ConfirmationLatest />
      )}
      <Title title="Draft Memo" />

      <TableDraftMemoDigital
        {...bucket}
      />

      <TableDraftMemoFinancingDocument
        {...bucket}
      />

      <TableDraftMemoSupportingDocument
        {...bucket}
      />

      <TableDraftMemoHistory
        {...bucket}
        process={historyProcess}
        buttons={button}
      />
    </ColumnWrapper>
  );
};

export default DraftMemo;
