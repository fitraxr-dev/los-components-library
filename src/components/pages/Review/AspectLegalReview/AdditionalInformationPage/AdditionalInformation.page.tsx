'use client';

import { TypeProcess, TypeModule } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
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
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const {
    formattedActionButton,
    handleButton,
    handleSaveAdditionalInfo,
    additionalInformationDetail,
    isAutoSaveFetching,
    isSaveLoading,
    isEdit,
    handleEdit,
    setContainer,
    handleBackToTable,
    containerAdditionalInformation,
    canUpdateAdditionalInfo,
  } = useAdditionalInformation();

  const renderActionButtons = () => {
    return formattedActionButton ? Object.entries(formattedActionButton).map((dt: [string, string]) => {
      return handleButton(dt[0], dt[1]);
    }) : null;
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />
      <RowWrapper>
        <Title title="Additional Information" />
      </RowWrapper>
      <TableDebtorInformation
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />

      <SectionTitle title="Additional Information" />
      <WordEditor
        isReadOnly={viewOnly || !canUpdateAdditionalInfo}
        container={containerAdditionalInformation}
        setContainer={setContainer}
        initialValue={additionalInformationDetail?.description}
      />

      <TableUploadDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />

      <RowWrapper sx={{ gap: 1, justifyContent: 'end', mt: 3, py: 3 }}>
        {isEdit && canUpdateAdditionalInfo && (
          <Button
            isLoading={isSaveLoading}
            onClick={handleEdit}
          >
            Change Review
          </Button>
        )}
        {!viewOnly && canUpdateAdditionalInfo ? (
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
