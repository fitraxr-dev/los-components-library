'use client';

import { TypeProcess, TypeModule } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import { useAdditionalInformation } from './AdditionalInformation.hook';


const AdditionalInformationPage = () => {
  const { processId } = useIdentity();

  const {
    formattedActionButton,
    handleButton,
    handleSaveAdditionalInfo,
    handleBackToTable,
    disclaimer,
    setDisclaimer,
    viewOnly,
    isAutoSaveFetching,
    isSaveLoading,
    additionalInformationDetail,
    handleEdit,
    isEdit,
    canUpdateEligibilityReview,
    setContainer,
    containerAdditionalInformation,
  } = useAdditionalInformation();

  const renderActionButtons = () => {
    return formattedActionButton ? Object.entries(formattedActionButton).map((dt: [string, string], index: number) => {
      return handleButton(dt[0], dt[1]);
    }) : null;
  };

  return (
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
      <RowWrapper>
        <Title title="Additional Information" />
      </RowWrapper>
      <TableDebtorInformation
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />

      <SectionTitle title="Additional Information" />
      <WordEditor
        isReadOnly={viewOnly || !canUpdateEligibilityReview}
        container={containerAdditionalInformation}
        setContainer={setContainer}
        initialValue={additionalInformationDetail?.description}
      />

      <Input
        disabled={viewOnly || !canUpdateEligibilityReview}
        label="Disclaimer"
        type="area"
        rows={4}
        placeholder="Input Disclaimer"
        value={disclaimer}
        onChange={(val) => setDisclaimer(val)}
      />

      <TableUploadDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />

      <RowWrapper sx={{ gap: 1, justifyContent: 'end', mt: 3, py: 3 }}>
        {isEdit && canUpdateEligibilityReview && (
          <Button
            isLoading={isSaveLoading}
            onClick={handleEdit}
          >
            Change Review
          </Button>
        )}
        {!viewOnly && canUpdateEligibilityReview ? (
          <Button
            disabled={isAutoSaveFetching}
            isLoading={isSaveLoading}
            onClick={() => {
              convertToDocx(containerAdditionalInformation)
                .then(handleSaveAdditionalInfo);
            }}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        ) : (
          Object.keys(formattedActionButton).length !== 0 ? null : <Button onClick={handleBackToTable}>Close</Button>
        )}

        {renderActionButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default AdditionalInformationPage;
