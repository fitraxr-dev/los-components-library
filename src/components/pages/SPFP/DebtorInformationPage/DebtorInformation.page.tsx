'use client';
import React from 'react';

import { FormProvider } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import AlertRisalahRapatExpired from './components/AlertRisalahRapatExpired';
import DetailDebtorSection from './components/DetailDebtorSection';
import GroupSection from './components/GroupSection';
import SaveButton from './components/SaveButton';
import useDebtorInformation from './DebtorInformation.hook';


const DebtorInformationPage = () => {
  const bucket = useSpfpBucketContext();
  const { viewOnly, setViewOnly } = useViewOnly();
  const [{ userData: { user: { division } } }] = useApp();
  const { recordActivity } = useRecordLog();
  const [state] = useApp();
  const isDpop = (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode?.includes('DPOP');

  const {
    handleViewRisalah,
    handleViewSpfpCreation,
    handleViewSpdp,
    applicationTypeList,
    methods,
    isGroup,
  } = useDebtorInformation();

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `view debtor information page for bucket: ${bucket?.bucketProcessId}`,
    });
  }, [recordActivity, bucket?.bucketProcessId, bucket?.module, bucket?.process]);

  let button;

  switch (bucket.process) {
    case TypeProcess.SPFP:
      button = [
        {
          iconName: 'show',
          label: 'View Risalah Rapat',
          onClick: () => handleViewRisalah(),
        },
      ];
      break;
    case TypeProcess.SPDP:
      button = [
        {
          iconName: 'show',
          label: 'View SPFP Creation',
          onClick: () => handleViewSpfpCreation(),
        },
      ];
      break;
    case TypeProcess.SPFP_FINAL:
      button = [
        {
          iconName: 'show',
          label: 'View Compliance Check',
          onClick: () => handleViewSpdp(),
        },
      ];
      break;
  }

  return (
    <FormProvider {...methods}>
      <ColumnWrapper sx={{ gap: 3 }}>
        {isDpop && (
          <ConfirmationLatest />
        )}
        {bucket.bucketProcessId ? (
          <AlertRisalahRapatExpired
            bucketProcessId={bucket.bucketProcessId}
            module={bucket.module}
            process={bucket.process}
          />
        ) : null}
        <Title title="Informasi Customer" buttons={button} />
        <TableDebtorInformation
          {...bucket}
        />
        <DetailDebtorSection />
        {isGroup && <GroupSection />}
        <SaveButton />
      </ColumnWrapper>
    </FormProvider>
  );
};

export default DebtorInformationPage;
