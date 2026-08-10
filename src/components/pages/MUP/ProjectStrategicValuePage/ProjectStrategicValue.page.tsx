'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { useProjectStrategicValue } from './ProjectStrategicValue.hook';


const ProjectStrategicValue = () => {
  const {
    container,
    setContainer,
    financingDetail,
    handleSave,
    isSubmitting,
    viewOnly,
    setShouldGoNext,
  } = useProjectStrategicValue();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Nilai Strategis Proyek/Pembiayaan Yang Dibiayai" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
      <WordEditor
        container={container}
        setContainer={setContainer}
        isReadOnly={viewOnly}
        initialValue={financingDetail?.description}
        isLoading={isSubmitting}
        onSave={(blob) => {
          setShouldGoNext(false);
          handleSave(blob);
        }}
      />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          isLoading={isSubmitting}
          onClick={() => {
            setShouldGoNext(true);
            convertToDocx(container).then(handleSave);
          }}
        >
          {viewOnly ? 'Next' : 'Save'}
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ProjectStrategicValue;
