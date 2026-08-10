'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

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
  const {
    handleNext,
    handleSave,
    isAutoSaveFetching,
    isSaveLoading,
    isFetchLoading,
    specialApprovalDetail,
    container,
    setContainer,
    canViewSpecialApproval,
    isViewOnlyMode,
  } = useSpecialApproval();

  if (!canViewSpecialApproval) {
    return null;
  }

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Persetujuan Khusus" />

      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

      <TableSpecialApproval module={TypeModule.MUP} process={TypeProcess.MUP} />

      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Additional Information" />

        <WordEditor
          isReadOnly={isViewOnlyMode}
          container={container}
          setContainer={setContainer}
          isLoading={isFetchLoading || isSaveLoading}
          initialValue={specialApprovalDetail?.description}
        />
      </ColumnWrapper>

      <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
        {!isViewOnlyMode ? (
          <>
            <Button onClick={() => handleSave(false)} disabled={isAutoSaveFetching}>
              {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
            </Button>
            <Button onClick={() => handleSave(true)}>Next</Button>
          </>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default SpecialApprovalPage;
