'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useNotes from './Notes.hook';


const NotesPage = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const { process } = useApuPpt();


  const {
    container,
    setContainer,
    listOptions,
    selectedCDD,
    setSelectedCDD,
    detailNotesData,
    initialSectionFormat,
    isDetailNotesLoading,
    renderActionButtons,
  } = useNotes();


  return (
    <ColumnWrapper>
      <ConfirmationLatest />
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Catatan" />
        <TableDebtorInformation
          module={TypeModule.APU_PPT}
          process={process}
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <TextStyle
            variant="body4"
            weight={600}
            sx={{
              ':after': {
                color: 'red',
                content: '"*"',
              },
            }}
          >
            Penerapan CDD
          </TextStyle>
          <Input
            type="radio"
            radioList={listOptions}
            value={selectedCDD}
            onChange={(e) => setSelectedCDD(e.target.value)}
            disabled={viewOnly}
            position="vertical"
            sxOptions={{
              '& .MuiFormControlLabel-label': {
                width: '100%',
              },
              '& .MuiFormControlLabel-root': {
                margin: 0,
                marginBottom: theme.spacing(1),
                width: '100%',
              },
              width: '100%',
            }}

          />
        </BaseContainer>

        <ColumnWrapper gap={theme.spacing(3)}>
          <SectionTitle title="Additional Information" />
          <WordEditor
            isReadOnly={viewOnly}
            isLoading={isDetailNotesLoading}
            container={container}
            setContainer={setContainer}
            initialValue={detailNotesData?.description}
            initialSectionFormat={initialSectionFormat}
          />
        </ColumnWrapper>

        <TableUploadDocument module={TypeModule.APU_PPT} process={process} showModalSelector />

        <RowWrapper gap={theme.spacing(3)} justifyContent="end" marginY={theme.spacing(2)}>
          {renderActionButtons()}
        </RowWrapper>
      </ColumnWrapper>
    </ColumnWrapper>
  );
};

export default NotesPage;
