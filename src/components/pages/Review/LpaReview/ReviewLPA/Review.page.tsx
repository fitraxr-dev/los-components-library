'use client';

import { ModalDef } from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';
import useGetCurrentModule from '../hooks/useGetCurrentModule';

import ModalAddInformationLpa from './components/ModalAddInformationLpa/ModalAddInformationLpa';
import ModalDetailInformationLpa from './components/ModalDetailInformationLpa';
import TableLPAInformation from './components/TableLPAInformation';
import { MODAL_ID } from './Review.constants';
import { useReview } from './Review.hook';


const Review = () => {
  const [state] = useApp();
  const { module: currentModule, process: currentProcess } = useGetCurrentModule();

  const {
    processModule,
    handleSubmit,
    setValue,
    watchFields,
    register,
    theme,
    container,
    isFetchLoading,
    isSaveLoading,
    reviewDetail,
    setContainer,
    typeSubmissionData,
    viewOnly,
    handleButton,
    handleClose,
    handleSaveReview,
    sortedObject,
    goToNextStep,
    processId,
    isEdit,
    handleEdit,
    changeBgInput,
    findDataMaster,
    getDataLabel,
    needCheckMaster,
    lpaDiffs,
    handleShowUrgencyWarning,
    hasShownUrgencyWarning,
    stepper,
  } = useReview();


  const renderActionButtons = () => {
    return sortedObject ? Object.entries(sortedObject).map((dt: [string, string], index: number) => {
      return (handleButton(dt[0], dt[1]));
    }) : null;
  };


  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <ConfirmationLatest />
        <RowWrapper>
          {processModule !== 'lpa-review' ? <Title title="Permohonan Review LPA" /> : <Title title="Kajian LPA KJPP" />}
          {isEdit ? <IconButton iconName="edit-2" onClick={() => handleEdit()} /> : null}
        </RowWrapper>
        <TableDebtorInformation
          module={TypeModule.LPA}
          process={processModule === 'lpa-review' ? TypeProcess.LPA_REVIEW : TypeProcess.LPA}
        />
        <SectionTitle title="Tipe Permohonan" isMandatory isOpen sx={{ mb: 2 }}>
          <ColumnWrapper gap={2}>
            <Input
              disabled={viewOnly}
              type="radio"
              radioList={typeSubmissionData}
              {...(register('typeSubmission') as any)}
              value={watchFields.typeSubmission}
              onChange={(e) => {
                const newValue = e.target.value;
                setValue('typeSubmission', newValue);
                if (newValue === 'IMMEDIATE' && !hasShownUrgencyWarning) {
                  handleShowUrgencyWarning();
                }
              }}
              sxOptions={{
                backgroundColor: changeBgInput('typeSubmission'),
                borderRadius: changeBgInput('typeSubmission') !== '#FFFFFF' ? theme.spacing(1) : 0,
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(3, 1fr)',
                padding: changeBgInput('typeSubmission') !== '#FFFFFF' ? theme.spacing(1) : 0,
                width: 1 / 2,
              }}
            />
            {needCheckMaster && findDataMaster('typeSubmission') && (
              <TextStyle weight={500}>
                {getDataLabel()}: {findDataMaster('typeSubmission') || '-'}
              </TextStyle>
            )}
            <Input
              disabled={viewOnly}
              label="Keterangan"
              type="area"
              rows={4}
              {...(register('remarks') as any)}
              value={watchFields.remarks}
              onChange={(val) => setValue('remarks', val)}
              inputSx={{
                backgroundColor: changeBgInput('remarks'),
              }}
            />
            {needCheckMaster && findDataMaster('remarks') && (
              <TextStyle weight={500}>
                {getDataLabel()}: {findDataMaster('remarks') || '-'}
              </TextStyle>
            )}
          </ColumnWrapper>
        </SectionTitle>


        <TableLPAInformation processId={processId} lpaDiffs={lpaDiffs} />

        <SectionTitle title="Additional Information" />
        <WordEditor
          isReadOnly={viewOnly}
          container={container}
          setContainer={setContainer}
          isLoading={isFetchLoading || isSaveLoading}
          initialValue={reviewDetail?.description}
        />

        <TableUploadDocument
          module={currentModule}
          process={currentProcess}
          showModalSelector={true}
          excludeProcess={true}
          checkDataMigrate={true}
        />

        {(viewOnly && (stepper?.from !== 'RETURN_TO_TL_ASK_FOR_INFO' && stepper?.from !== 'ASK_FOR_INFO'
          && stepper?.from !== 'RETURN_TO_STAFF_ASK_FOR_INFO' && stepper?.from !== 'WAITING_ASK_FOR_INFO_TL'
          && stepper?.from !== 'WAITING_ASK_FOR_INFO_KADIV'
        )) && (
          <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
            <Button
              onClick={goToNextStep}
            >
              Next
            </Button>
          </RowWrapper>
        )}
        <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
          {renderActionButtons()}
        </RowWrapper>
      </ColumnWrapper>
      <ModalDef id={MODAL_ID.ADD_LPA} component={ModalAddInformationLpa} />
      <ModalDef id={MODAL_ID.LPA_DETAIL} component={ModalDetailInformationLpa} />
    </>
  );
};

export default Review;
