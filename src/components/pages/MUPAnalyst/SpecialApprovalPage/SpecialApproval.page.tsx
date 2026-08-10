'use client';
import { useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableOthersSpecialApproval from '@/components/shared/SmiTable/SpecialApproval/TableOthersSpecialApproval';
import TableSpecialApproval from '@/components/shared/SmiTable/SpecialApproval/TableSpecialApproval';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useSpecialApproval } from './SpecialApproval.hook';


const SpecialApprovalPage = () => {
  const [container, setContainer] = useState(null);

  const {
    setShouldGoNext,
    handleSave,
    viewOnly,
    isSaveLoading,
    isFetchLoading,
    specialApprovalDetail,
  } = useSpecialApproval();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Persetujuan Khusus" />
        <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

        <TableSpecialApproval module={TypeModule.MUP} process={TypeProcess.MUP} />
        <TableOthersSpecialApproval module={TypeModule.MUP} process={TypeProcess.MUP} />

        <ColumnWrapper sx={{ gap: 3 }}>
          <SectionTitle title="Keterangan" />
          <WordEditor
            isReadOnly={viewOnly}
            container={container}
            setContainer={setContainer}
            isLoading={isFetchLoading || isSaveLoading}
            initialValue={specialApprovalDetail?.description}
            onSave={(blob) => {
              setShouldGoNext(false);
              handleSave(blob);
            }}
          />
        </ColumnWrapper>

        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          <Button
            onClick={() => {
              setShouldGoNext(true);
              convertToDocx(container).then(handleSave);
            }}
          >
            {viewOnly ? 'Next' : 'Save'}
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </>
  );
};

export default SpecialApprovalPage;
