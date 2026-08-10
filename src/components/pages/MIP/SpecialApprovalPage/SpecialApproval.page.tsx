'use client';
import useApp from '@/hooks/useApp';

import useMipCcExpired from '@/components/pages/MIP/shared/hooks/useMipCcExpired';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableSpecialApproval from '@/components/shared/SmiTable/SpecialApproval/TableSpecialApproval';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useSpecialApproval } from './SpecialApproval.hook';


const SpecialApprovalPage = () => {
  const [state] = useApp();
  const {
    bucketMasterId,
    handleSave,
    viewOnly,
    isAutoSaveFetching,
    isSaveLoading,
    isFetchLoading,
    specialApprovalDetail,
    container,
    setShouldGoNext,
    setContainer,
    stepperStatus,
    stepperSteps,
  } = useSpecialApproval();

  useMipCcExpired({
    bucketMasterId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
    stepperStatus,
    steps: stepperSteps,
  });

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Persetujuan Khusus" />
        <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />

        <TableSpecialApproval module={state.pages.mipModule} process={state.pages.mipProcess} />

        <ColumnWrapper sx={{ gap: 3 }}>
          <SectionTitle title="Additional Information" />
          <WordEditor
            isReadOnly={viewOnly}
            container={container}
            setContainer={setContainer}
            isLoading={isFetchLoading || isSaveLoading}
            initialValue={specialApprovalDetail?.description}
          />
        </ColumnWrapper>

        <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
          <Button
            onClick={() => {setShouldGoNext(false); handleSave();}}
            disabled={viewOnly || isAutoSaveFetching}
            isLoading={isSaveLoading}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
          <Button
            onClick={() => {setShouldGoNext(true); handleSave();}}
            disabled={viewOnly}
          >
            Next
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </>
  );
};

export default SpecialApprovalPage;
