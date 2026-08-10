'use client';
import React, { useState } from 'react';

import { TypeProcess, TypeModule } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';


const ProposalSummaryPage = () => {
  const [container, setContainer] = useState(null);
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />
      <Title
        title="Ringkasan Usulan Fasilitas Pembiayaan"
      />
      <TableDebtorInformation
        module={TypeModule.MIP}
        process={TypeProcess.MIP_REVIEW}
      />

      <WordEditor container={container} setContainer={setContainer} />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button>
          Save & Next
        </Button>
      </RowWrapper>
    </ColumnWrapper >
  );
};

export default ProposalSummaryPage;
