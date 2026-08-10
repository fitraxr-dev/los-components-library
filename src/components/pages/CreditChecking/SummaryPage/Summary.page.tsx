'use client';

import { roles } from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import { useSummary } from './Summary.hook';


const SummaryPage = () => {
  const { isDpop } = useCreditCheckingContext();
  const [{ currentRole }] = useApp();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const {
    disclaimerContainer,
    handleSave,
    notesContainer,
    setDisclaimerContainer,
    setNotesContainer,
    saveSummaryLoading,
    data,
    isRequestModule,
    renderActionButtons,
    currentListPage,
    isWordEditorEmpty,
    setIsWordEditorEmpty,
    bucketDetail,
  } = useSummary();

  const isAnalyst = currentRole?.includes(roles.ANALYST) || currentRole?.includes(roles.TL_ANALYST);
  const isDisabledSaveButton = (!viewOnly && isWordEditorEmpty.notes) || viewOnly;

  const renderButton = () => {
    if (viewOnly) {
      return (
        <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => router.push(currentListPage)}
          >
            Close
          </Button>
        </RowWrapper>
      );
    }

    return (
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {!isAnalyst && (
          <Button
            disabled={isDisabledSaveButton}
            isLoading={saveSummaryLoading}
            onClick={handleSave}
          >
            Save
          </Button>
        )}
        {...renderActionButtons()}
      </RowWrapper>
    );
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <RowWrapper sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title title="Credit Checking Summary" />
        <Input
          type="dropdown"
          placeholder="Choose Customer"
          value={bucketDetail.debtorName}
          dropdownList={[{
            label: bucketDetail?.debtorName,
            value: bucketDetail?.debtorName,
          }]}
          containerSx={{ width: '25%' }}
          disabled
        />
      </RowWrapper>
      <TableDebtorInformation
        module={TypeModule.CREDIT_CHECKING}
        process={
          isRequestModule
            ? TypeProcess.CREDIT_CHECKING
            : TypeProcess.CREDIT_CHECKING_DPOP
        }
      />
      {/* <SectionTitle title="Disclaimer" isMandatory />
      <WordEditor
        id="disclaimer"
        isReadOnly={isAnalyst || viewOnly}
        container={disclaimerContainer}
        setContainer={setDisclaimerContainer}
        isLoading={saveSummaryLoading}
        initialValue={data?.content?.disclaimer}
        isWordEditorEmpty={isWordEditorEmpty}
        setIsWordEditorEmpty={setIsWordEditorEmpty}
      /> */}

      <SectionTitle title="Catatan" isMandatory />
      <WordEditor
        id="notes"
        isReadOnly={isAnalyst || viewOnly}
        container={notesContainer}
        setContainer={setNotesContainer}
        isLoading={saveSummaryLoading}
        initialValue={data?.content?.notes}
        isWordEditorEmpty={isWordEditorEmpty}
        setIsWordEditorEmpty={setIsWordEditorEmpty}
      />

      <TableUploadDocument
        module={TypeModule.CREDIT_CHECKING}
        process={
          isRequestModule
            ? TypeProcess.CREDIT_CHECKING
            : TypeProcess.CREDIT_CHECKING_DPOP
        }
      />
      {renderButton()}
    </ColumnWrapper>
  );
};

export default SummaryPage;
