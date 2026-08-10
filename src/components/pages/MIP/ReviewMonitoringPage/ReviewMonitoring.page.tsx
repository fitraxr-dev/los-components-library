'use client';
import { useTheme } from '@mui/material';

import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useReviewMonitoring from './ReviewMonitoring.hook';


const ReviewMonitoringPage = () => {
  const { viewOnly } = useViewOnly();
  const [state, _] = useApp();
  const theme = useTheme();
  const { processId } = useIdentity();
  const {
    isFetching,
    tableHeader,
    list,
    listButton,
    stepperStatus,
    stepperSteps,
  } = useReviewMonitoring();

  useUpdateMipr({
    bucketParent: processId,
    stepperStatus,
    steps: stepperSteps,
  });
  // const stepper = state.stepper;

  // const isCancelled = stepper.from === 'MIP_REVIEW_CANCELLED';

  const renderButtons = () => (
    <RowWrapper>
      {listButton.map((el) => (
        <Button
          key={el.label}
          sx={{ ml: 2, px: 4, py: 1.5 }}
          variant={el?.variant}
          onClick={el.onClick ?? null}
          isLoading={el.isLoading}
          color={el.color}
        >
          {el.label}
        </Button>
      ))}
    </RowWrapper>
  );

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title
        title="MIP Review Monitoring"
        buttons={[]}
      />
      <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />
      <BaseContainer
        sx={{
          boxShadow: 2,
          p: 2,
        }}
      >
        <Table
          tableHeader={tableHeader}
          isLoading={isFetching}
          tableData={list}
        />
      </BaseContainer>

      {!isFetching &&
        <RowWrapper gap={theme.spacing(3)} justifyContent="end">

          {(listButton.length ? renderButtons() : null)}
        </RowWrapper>
      }
    </ColumnWrapper>
  );
};

export default ReviewMonitoringPage;
