'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import DRDInterface from './components/DRDInterface';
import HistoryRatingModal from './components/HistoryRating';
import TableDocumentDrd from './components/TableDocumentDRD';
import { MODAL_ID, ratingTypeOptions } from './Rating.constants';
import { useRating } from './Rating.hook';


const RatingPage = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const {
    constrainingFactorsContainer,
    handleSaveOnly,
    handleSaveAndNext,
    handleNext,
    isAutoSaveFetching,
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
    handleDownloadDocDrd,
    isPemda,
    viewOnly,
    isDrdExist,
    isDownloadLoading,
    isDownloadDisabled,
    isFormValid,
    isDocumentTableValid,
    canUpdate,
    isShowSendAndDRDInterface,
    isStatusDrd,
    isDisabledMkpir,
    handleOpenModalConfirmSelector,
    isDisabledSentToDrd,
    handleOpenHistoryModal,
    handleOpenDrdInterface,
  } = useRating();

  const {
    othersRatingType,
    rating,
    categoryLabel,
    ratingType,
    ratingPeriod,
    description,
  } = masintonForm;


  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <AlertDifferentData
          bucketProcessId={processId}
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.REVIEWER_DEPI}
          isReviewer={true}
          refetchInterval={5000}
        />
        <ConfirmationLatest
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.REVIEWER_DEPI}
        />
        <RowWrapper sx={{ justifyContent: 'space-between' }}>
          <Title title="Rating" />
          <RowWrapper py={3} gap={2} justifyContent="end">
            <>
              {isShowSendAndDRDInterface && (
                <Button
                  startIcon="filter-3"
                  startIconSx={{ fontSize: 18 }}
                  onClick={handleOpenDrdInterface}
                  color="warning"
                >
                  View DRD Interface
                </Button>
              )}
              <Button
                onClick={handleDownloadDocDrd}
                color="success"
                startIcon="download"
                startIconSx={{ fontSize: 18 }}
                isLoading={isDownloadLoading}
                disabled={isDownloadLoading || isDownloadDisabled || !isDrdExist}
              >
                Download Document DRD
              </Button>
            </>
            <Button
              startIcon="filter-3"
              startIconSx={{ fontSize: 18 }}
              onClick={handleOpenHistoryModal}
            >
              View Rating History
            </Button>
          </RowWrapper>
        </RowWrapper>

        <TableDebtorInformation
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.REVIEWER_DEPI}
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
                disableFutureDates={false}
                maxDate="2099-12-31"
                placeholder="Pilih Rating Period"
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
                      Send Memo MKPIR to DRD
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
      <ModalDef id={MODAL_ID.HISTORY_MODAL} component={HistoryRatingModal} />
    </>
  );
};

export default RatingPage;
