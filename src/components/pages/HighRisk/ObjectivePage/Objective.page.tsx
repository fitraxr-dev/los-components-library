'use client';
import { useState } from 'react';

import { Button } from '@mui/material';

import { TypeProcess, TypeModule } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';


const ObjectivePage = () => {
  const [container, setContainer] = useState(null);
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Tujuan" />
      <TableDebtorInformation
        module={TypeModule.MIP}
        process={TypeProcess.MIP_REVIEW}
      />

      <WordEditor container={container} setContainer={setContainer} />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button onClick={() => {}}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};


export default ObjectivePage;
