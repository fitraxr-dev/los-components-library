'use client';
import { useEffect } from 'react';

import { DPOP_DIVISION } from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableBusinessGroup from '@/components/shared/SmiTable/TableBusinessGroup';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';

import ConfirmationLatest from '../ConfirmationLatest/ConfirmationLatest';

import DetailDebtorSection from './components/DetailDebtorSection';
import SaveButton from './components/SaveButton';
import TitleDebtor from './components/TitleDebtor';


const DebtorInformation = (props: SmiComponentProps) => {
  const { module, process, id } = props;
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { data: debtorInfoData, isLoading, isFetching } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: module,
    process: process,
  });
  const isGroup = debtorInfoData?.isGroup;
  const { divisionCode } = useDivision();
  const isDpopDivision = divisionCode.includes(DPOP_DIVISION);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module,
        process,
        remarks: 'view debtor information page',
      });
    }
  }, [isLoading, isFetching, processId, module, process, recordActivity]);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isDpopDivision && (
        <ConfirmationLatest />
      )}
      <TitleDebtor
        process={process}
      />
      <TableDebtorInformation
        module={module}
        process={process}
      />
      <DetailDebtorSection module={module} process={process} />
      {/* <BusinessGroupSection module={module} process={process} id={id} /> */}
      {isGroup && (
        <TableBusinessGroup module={module} process={process} />
      )}
      <SaveButton />
    </ColumnWrapper>
  );
};

export default DebtorInformation;
