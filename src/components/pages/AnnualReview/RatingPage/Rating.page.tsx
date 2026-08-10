'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { TypeModule } from '@/enums/Module';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import DRDInterface from './components/DRDInterface';
import HistoryTable from './components/HistoryTable';
import TableDocumentDrd from './components/TableDocumentDRD';
import { MODAL_ID, ratingTypeOptions } from './Rating.constants';
import { useRating } from './Rating.hook';


const RatingPage = () => {
  const theme = useTheme();


  const {
    constrainingFactorsContainer,
    isAutoSaveFetching,
    handleSaveOnly,
    handleSaveAndNext,
    handleNext,
    isSaveLoading,
    listRatingCategory,
    masintonChange,
    masintonForm,
    noteContainer,
    ratingDetail,
    setConstrainingFactorsContainer,
    setNoteContainer,
    setSupportingFactorsContainer,
    supportingFactorsContainer,
    handleSendMemoMkpirToDrd,
    handleSendToDrd,
    isPemda,
    isDrdExist,
    viewOnly,
    isFormValid,
    isDocumentTableValid,
    isDocHistoryVisible,
    canUpdate,
    isShowSendAndDRDInterface,
    isStatusDrd,
    isDisabledMkpir,
    handleOpenModalConfirmSelector,
    isDisabledSentToDrd,
    typeProcess,
    listButton,
  } = useRating();
  const { isDepiDivision } = useAnnualReviewContext();

  const {
    othersRatingType,
    rating,
    categoryLabel,
    ratingType,
    ratingPeriod,
    description,
    memoNumberHistory,
    memoDateHistory,
  } = masintonForm;


  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        {isDepiDivision && <ConfirmationLatest />}
        <RowWrapper sx={{ justifyContent: 'space-between' }}>
          <Title title="Rating" />
          <RowWrapper>
            {listButton.map((el) => (
              <Button
                key={el.label}
                sx={{ ml: 2, px: 3, py: 2 }}
                startIcon={el?.iconName}
                onClick={el.onClick ?? null}
                isLoading={el.isLoading}
                {...(el.disabled && { disabled: true })}
                color={el.color}
              >
                {el.label}
              </Button>
            ))}
          </RowWrapper>
        </RowWrapper>

        <TableDebtorInformation
          module={TypeModule.ANNUAL_REVIEW}
          process={typeProcess}
        />

        <SectionTitle title="Rating Management" isOpen>
          <ColumnWrapper sx={{ gap: 3, mt: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              {isDocHistoryVisible && (
                <>
                  <Input
                    disabled
                    label="Nomor Dokumen"
                    placeholder="Nomor Dokumen"
                    type="text"
                    value={memoNumberHistory.value}
                  />

                  <Input
                    disabled
                    label="Tanggal Dokumen"
                    placeholder="Tanggal Dokumen"
                    type="text"
                    value={memoDateHistory.value}
                  />
                </>
              )}

              <Input
                label="Rating"
                placeholder="Choose rating"
                type="dropdown"
                dropdownList={listRatingCategory}
                onChange={(val) => masintonChange('rating', val)}
                value={rating.value}
                isMandatory
                error={rating.error}
                helperText={rating.error && rating.errorMessage}
                disabled={viewOnly || !canUpdate}
              />

              <Input
                disabled
                label="Kategori"
                placeholder="Kategori"
                type="text"
                value={categoryLabel.value}
                aria-disabled={viewOnly || !canUpdate}
              />

              <Input
                type="radio"
                label="Rating Type"
                isMandatory
                position="horizontal"
                value={ratingType.value}
                onChange={(val) => masintonChange('ratingType', val.target.value)}
                radioList={ratingTypeOptions}
                error={ratingType.error}
                helperText={ratingType.error && ratingType.errorMessage}
                disabled={viewOnly || !canUpdate}
              />

              <Input
                type="date"
                label="Rating Period"
                format="YYYY"
                openTo="year"
                views={['year']}
                view="year"
                onChange={(val) => masintonChange('ratingPeriod', val?.toISOString())}
                value={ratingPeriod.value}
                isMandatory
                error={ratingPeriod.error}
                helperText={ratingPeriod.error && ratingPeriod.errorMessage}
                disabled={viewOnly || !canUpdate}
              />

              {ratingType.value === 'others' && (
                <Input
                  label="Others"
                  placeholder="Input Rating Type"
                  type="text"
                  onChange={(val) => masintonChange('othersRatingType', val)}
                  value={othersRatingType.value}
                  isMandatory
                  error={othersRatingType.error}
                  helperText={othersRatingType.error && othersRatingType.errorMessage}
                  disabled={viewOnly || !canUpdate}
                />
              )}
            </Box>

            <Input
              label="Keterangan"
              type="area"
              rows={4}
              onChange={(val) => masintonChange('description', val)}
              value={description.value}
              disabled={viewOnly || !canUpdate}
            />

            <TableDocumentDrd isPemda={isPemda} />
            <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
              <>
                {isStatusDrd &&
                  <>
                    <Button
                      onClick={handleSendMemoMkpirToDrd}
                      variant="contained"
                      color="primary"
                      disabled={isDisabledMkpir}
                    >
                      Send Memo Re-rating to DRD
                    </Button>
                    <Button
                      onClick={handleOpenModalConfirmSelector}
                      variant="contained"
                      color="info"
                    >
                      Next Process
                    </Button>
                  </>
                }

                {isShowSendAndDRDInterface &&
                  <Button
                    onClick={handleSendToDrd}
                    variant="contained"
                    color="success"
                    disabled={isDisabledSentToDrd || !isDrdExist}
                  >
                    Send to DRD
                  </Button>
                }
              </>

            </RowWrapper>
          </ColumnWrapper>
        </SectionTitle>


        <ColumnWrapper sx={{ gap: 3 }}>
          <SectionTitle title="Supporting Factors" />
          <WordEditor
            id="supportingFactorsDepi"
            container={supportingFactorsContainer}
            setContainer={setSupportingFactorsContainer}
            initialValue={ratingDetail?.supportingFactor}
            isReadOnly={viewOnly || !canUpdate}
          />
        </ColumnWrapper>

        <ColumnWrapper sx={{ gap: 3 }}>
          <SectionTitle title="Constraining Factors" />
          <WordEditor
            id="constrainingFactorsDepi"
            container={constrainingFactorsContainer}
            setContainer={setConstrainingFactorsContainer}
            initialValue={ratingDetail?.constrainingFactor}
            isReadOnly={viewOnly || !canUpdate}
          />
        </ColumnWrapper>

        <ColumnWrapper sx={{ gap: 3 }}>
          <SectionTitle title="Hal - Hal yang perlu diperhatikan" />
          <WordEditor
            id="remarksDepi"
            container={noteContainer}
            setContainer={setNoteContainer}
            initialValue={ratingDetail?.note}
            isReadOnly={viewOnly || !canUpdate}
          />
        </ColumnWrapper>

        <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
          <>
            {viewOnly || !canUpdate ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <>
                <Button
                  isLoading={isSaveLoading}
                  onClick={handleSaveOnly}
                  disabled={!isFormValid || !isDocumentTableValid || isSaveLoading || isAutoSaveFetching}
                >
                  {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
                </Button>
                <Button
                  isLoading={isSaveLoading}
                  onClick={handleSaveAndNext}
                  disabled={!isFormValid || !isDocumentTableValid || isSaveLoading}
                >
                  Next
                </Button>
              </>
            )}
          </>
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef id={MODAL_ID.DRD_INTERFACE_MODAL} component={DRDInterface} />
      <ModalDef id={MODAL_ID.HISTORY_MODAL} component={HistoryTable} />

    </>
  );
};

export default RatingPage;
