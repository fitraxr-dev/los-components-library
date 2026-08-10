'use client';
import { useState } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { convertToDocx } from '@/helpers/synfusion';
import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import DeclineModal from './components/DeclineModal';
import { modal } from './Proposal.constants';
import { useProposal } from './Proposal.hook';


const ProposalPage = () => {
  const { viewOnly } = useViewOnly();
  const [state, _] = useApp();
  const { processId: identityProcessId } = useIdentity();
  const [container, setContainer] = useState(null);

  const {
    processId,
    handleOpenDeclineModal,
    handleSave,
    handleSubmit,
    isAutoSaveFetching,
    isFetchLoading,
    isSaveLoading,
    proposalDetail,
    goToNextStep,
    submitProposalLoading,
    stepperStatus,
    stepperSteps,
  } = useProposal(container);

  useUpdateMipr({
    bucketParent: identityProcessId,
    stepperStatus,
    steps: stepperSteps,
  });


  const isAnalyst = state?.currentRole.includes(roles.ANALYST) || state.currentRole.includes(roles.TL_ANALYST);
  const isKadiv = state?.currentRole.includes(roles.KADIV);
  const isTL = state.currentRole.includes(roles.TL);


  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Usulan" />
        <TableDebtorInformation module={state.pages.mipModule} process={state.pages.mipProcess} />

        <WordEditor
          isReadOnly={isAnalyst || viewOnly}
          container={container}
          setContainer={setContainer}
          isLoading={isFetchLoading || isSaveLoading}
          initialValue={proposalDetail?.description}
        />

        <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
          {!isAnalyst && (
            <Button
              disabled={viewOnly}
              color="error"
              variant="outlined"
              onClick={handleOpenDeclineModal}
            >
              Decline
            </Button>
          )}
          {!isAnalyst && (
            <Button
              disabled={viewOnly || isAutoSaveFetching}
              isLoading={isSaveLoading}
              onClick={() => {
                if (viewOnly) {
                  goToNextStep();
                } else {
                  convertToDocx(container).then(handleSave);
                }
              }}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
          )}

          {(isTL || isKadiv) &&
            <Button disabled={viewOnly || !(isKadiv || isTL)} onClick={() => handleSubmit({ action: 'RETURN_STAFF', process: 'MIP_REVIEW' })} >Return to Staff</Button>
          }
          {isKadiv &&
            <Button disabled={viewOnly || !isKadiv} onClick={() => handleSubmit({ action: 'RETURN_TL', process: 'MIP_REVIEW' })} color="info">Return to TL</Button>
          }
          <Button
            // disabled={submitDisabled || viewOnly}
            disabled={viewOnly} // TODO: hapus pas bmpp selesai
            color="success"
            onClick={() => !submitProposalLoading ? handleSubmit({ action: 'SUBMIT', process: 'MIP_REVIEW' }) : null}
            isLoading={submitProposalLoading}
          >
            {isKadiv || isTL ? 'Approve' : 'Submit'}
          </Button>
        </RowWrapper>

      </ColumnWrapper>


      <ModalDef
        id={modal.DECLINE}
        component={DeclineModal}
      />
    </>
  );
};

export default ProposalPage;
