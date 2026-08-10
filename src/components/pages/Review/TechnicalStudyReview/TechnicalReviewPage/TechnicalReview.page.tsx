'use client';
import { useState } from 'react';

import { useTheme } from '@mui/material';

import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import { useTechnicalReview } from './TechnicalReview.hook';


const TechnicalReviewPage = () => {
  const theme = useTheme();
  const [container, setContainer] = useState(null);

  const {
    changeBgInput,
    findDataMaster,
    getDataLabel,
    getInitialValueWithPreviousData,
    handleSave,
    isFetchingLoading,
    needCheckMaster,
    notes,
    options,
    setNotes,
    setOptions,
    setShouldGoNext,
    type,
    setType,
    typeSubmissionData,
    isKadivDelst,
    technicalReviewDetail } = useTechnicalReview();

  const { viewOnly } = useViewOnly();
  const [state] = useApp();

  return (
    <ColumnWrapper gap={3}>
      <ConfirmationLatest />
      <RowWrapper sx={{ alignItems: 'center', gap: 2 }}>
        <Title title="Kajian Teknis" />
      </RowWrapper>
      <TableDebtorInformation module={state.pages.module} process={state.pages.process} />
      <SectionTitle title="Tipe Permohonan" isMandatory={true} sx={{ mb: 3 }} isOpen>
        <ColumnWrapper gap={2}>
          <ColumnWrapper gap={1}>
            <Input
              type="radio"
              radioList={typeSubmissionData}
              disabled={isKadivDelst || viewOnly}
              sxOptions={{
                backgroundColor: changeBgInput('submissionType'),
                borderRadius: changeBgInput('submissionType') !== '#FFFFFF' ? theme.spacing(1) : 0,
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(3, 1fr)',
                padding: changeBgInput('submissionType') !== '#FFFFFF' ? theme.spacing(1) : 0,
                width: 1 / 2,
              }}
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            {needCheckMaster && findDataMaster('submissionType') && (
              <TextStyle weight={500}>
                {getDataLabel()}: {findDataMaster('submissionType') || '-'}
              </TextStyle>
            )}
          </ColumnWrapper>
          <ColumnWrapper gap={1}>
            <Input
              type="area"
              label="Keterangan"
              placeholder="Input Keterangan"
              disabled={isKadivDelst || viewOnly}
              rows={4}
              value={notes}
              onChange={(val) => setNotes(val)}
              sx={{
                backgroundColor: changeBgInput('notes'),
              }}
            />
            {needCheckMaster && findDataMaster('notes') && (
              <TextStyle weight={500}>
                {getDataLabel()}: {findDataMaster('notes') || '-'}
              </TextStyle>
            )}
          </ColumnWrapper>
        </ColumnWrapper>
      </SectionTitle>
      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={false}
        initialValue={getInitialValueWithPreviousData()}
        paperProps={{
          sx: {
            backgroundColor: changeBgInput('additionalInformation'),
          },
        }}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {viewOnly ? (
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setShouldGoNext(true);
              convertToDocx(container).then(handleSave);
            }}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setShouldGoNext(false);
                convertToDocx(container).then(handleSave);
              }}
            >
              Save
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setShouldGoNext(true);
                convertToDocx(container).then(handleSave);
              }}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TechnicalReviewPage;
