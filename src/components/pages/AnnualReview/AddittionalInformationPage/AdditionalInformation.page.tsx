'use client';


import { useTheme } from '@mui/material';

import { TypeModule } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';


import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import { useAdditionalInformation } from './AdditionalInformation.hook';


const AdditionalInformationPage = () => {
  const theme = useTheme();

  const {
    renderActionButtons,
    additionalInformationDetail,
    setContainer,
    container,
    isLoading,
    viewOnly,
    isSynfunsionDisabled,
    isAnnualReviewAnalyst,
    isAnnualReviewBisnis,
    isDepiDivision,
    isAnalyst,
    isDocumentConfirmed,
    setIsDocumentConfirmed,
    typeProcess,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
    disclaimer,
    setDisclaimer,
    isPreview,
    isHistoryRating,
    titleHeader,
  } = useAdditionalInformation();

  return (
    <ColumnWrapper>
      {isDepiDivision && <ConfirmationLatest />}
      <ColumnWrapper sx={{ gap: 3 }}>
        <RowWrapper >
          {/*
            <Title
              title={
                (isAnalyst || isBusinessDivision)
                  ? 'Pembahasan Annual Review'
                  : 'Additional Information'
              }
            />
          */}
          <Title title={titleHeader} />
        </RowWrapper>
        <TableDebtorInformation
          module={TypeModule.ANNUAL_REVIEW}
          process={typeProcess}
        />

        {/*
          <SectionTitle
            title={
              (isAnalyst || isBusinessDivision)
                ? 'Pembahasan Annual Review'
                : 'Additional Information'
            }
            isOpen
          >
        */}
        <SectionTitle title={titleHeader} isOpen>
          <WordEditor
            id="additionalWord"
            isReadOnly={isSynfunsionDisabled || viewOnly || isAnalyst}
            container={container}
            setContainer={setContainer}
            isLoading={isLoading}
            isWordEditorEmpty={isWordEditorEmpty}
            setIsWordEditorEmpty={setIsWordEditorEmpty}
            initialValue={additionalInformationDetail?.description}
          />
        </SectionTitle>

        {(isDepiDivision && !isPreview) && (
          <>
            <Input
              label="Disclaimer"
              placeholder="Input Disclaimer"
              type="area"
              minRows={4}
              value={disclaimer}
              onChange={setDisclaimer}
              disabled={viewOnly || isAnalyst || isSynfunsionDisabled}
            />
            <TableUploadDocument
              module={TypeModule.ANNUAL_REVIEW}
              process={typeProcess}
              canAddWhenViewOnly={isHistoryRating}
            />
          </>
        )}
        {((isAnnualReviewBisnis || isAnnualReviewAnalyst) && !isPreview) && (
          <Input
            type="radio"
            label={
              isAnnualReviewBisnis
                ? 'Apakah Dokumen ' + titleHeader + ' sudah dikonfirmasi oleh Analyst?'
                : 'Apakah Dokumen ' + titleHeader + ' sudah dikonfirmasi?'
            }
            disabled={viewOnly || !isAnalyst}
            value={isDocumentConfirmed}
            onChange={(val) => setIsDocumentConfirmed(val.target.value === 'true')}
            radioList={[
              { label: 'Ya', value: true },
              { label: 'Tidak', value: false }
            ]}
            sx={{ flex: 1 }}
            isMandatory
          />
        )}
        {(!isPreview) && (
          <RowWrapper sx={{ gap: theme.spacing(3), justifyContent: 'end', marginY: theme.spacing(3) }}>
            {renderActionButtons()}
          </RowWrapper>
        )}
      </ColumnWrapper>

    </ColumnWrapper>
  );
};

export default AdditionalInformationPage;
