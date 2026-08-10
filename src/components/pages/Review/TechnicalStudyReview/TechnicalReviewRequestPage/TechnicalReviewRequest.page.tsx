'use client';
import { useState } from 'react';

import { useTheme } from '@mui/material';

import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import {
  useTechnicalStudyReviewContext,
} from '@/components/layouts/TechnicalStudyReviewLayout/TechnicalStudyReview.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';
import useDebtorInformation from '../DebtorInformationPage/DebtorInformation.hook';

import { TYPE_RADIO_VALUES } from './TechnicalReviewRequest.constants';
import { useTechnicalReviewRequest, ActionButtonType } from './TechnicalReviewRequest.hooks';


const TechnicalReviewRequestPage = () => {
  const theme = useTheme();
  const [state] = useApp();

  const { isSpecialistDelst } = useDebtorInformation();
  const {
    container,
    typeSubmissionData,
    type,
    notes,
    setType,
    handleSave,
    technicalReviewDetail,
    setNotes,
    handleActionButton,
    handleDecline,
    handleEdit,
    isSubmitLoading,
    setContainer,
    sortedObject,
    handleButton,
  } = useTechnicalReviewRequest();

  const { stepper, goToNextStep } =
    useTechnicalStudyReviewContext();

  const { viewOnly } = useViewOnly();

  const renderButton = () => {
    if (!sortedObject || Object.keys(sortedObject).length === 0) return null;
    return (
      <>
        {Object.entries(sortedObject).map(([key, value]) => (
          <span key={key}>{handleButton(key, value as string)}</span>
        ))}
      </>
    );
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <RowWrapper sx={{ alignItems: 'center', gap: 2 }}>
        <Title title="Permintaan Kajian Teknis" />
        {stepper?.steps?.[1]?.action?.hasOwnProperty('EDIT') && (
          <IconButton iconName="edit-2" onClick={() => handleEdit()} />
        )}
      </RowWrapper>
      <TableDebtorInformation module={state.pages.module} process={state.pages.process} />
      <SectionTitle title="Tipe Permohonan" isOpen sx={{ mb: 2 }}>
        <ColumnWrapper sx={{ gap: 2 }}>
          <Input
            type="radio"
            label="Tipe Permohonan"
            isMandatory={true}
            radioList={typeSubmissionData}
            disabled={viewOnly}
            sxOptions={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(3, 1fr)',
              width: 1 / 2,
            }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <Input
            type="area"
            label="Keterangan"
            placeholder="Input Keterangan"
            disabled={viewOnly}
            rows={4}
            value={notes}
            onChange={(val) => setNotes(val)}
          />
        </ColumnWrapper>
      </SectionTitle>

      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={false}
        initialValue={technicalReviewDetail?.additionalInformation}
      />
      <TableUploadDocument
        module={state.pages.module}
        process={state.pages.process}
        showModalSelector={true}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {isSpecialistDelst ? (
          <Button onClick={goToNextStep}>Next</Button>
        ) : null}
        {renderButton()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TechnicalReviewRequestPage;
