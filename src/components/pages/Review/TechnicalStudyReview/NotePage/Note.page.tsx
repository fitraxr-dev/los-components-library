'use client';
import { useState } from 'react';

import { RETURN_TO_STAFF } from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import {
  useTechnicalStudyReviewContext,
} from '@/components/layouts/TechnicalStudyReviewLayout/TechnicalStudyReview.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';


import { useNote } from './Note.hook';

import type { ActionButtonType } from './Note.hook';


const NotePage = () => {
  const [container, setContainer] = useState(null);
  const [state] = useApp();

  const { stepper, goToNextStep } = useTechnicalStudyReviewContext();
  const { viewOnly } = useViewOnly();

  const { isSubmitLoading, noteDetail, handleSave, handleActionButton, isDebtorInvalid } =
    useNote();

  const action = stepper?.steps?.[2]?.action;

  const actionButtons: [string, string][] = action
    ? Object.entries(action)
    : [];
  const ignoredActions = [
    'CANCELED',
    'DECLINED',
    'SPECIALIST',
    'NOT_EDIT_SUBMIT',
    'EDIT',
    'TABLE_UPLOAD_DOCUMENT_DOWNLOAD'
  ];
  const hasIgnoredAction = actionButtons.some(([key, _value]) =>
    ignoredActions.includes(key)
  );

  const renderButton = () => {
    if (!action) {
      return null;
    }

    const actionButtonEntries: [string, string][] = Object.entries(action);

    const buttonColor = {
      APPROVE: 'success',
      APPROVE_ASK_FOR_INFO: 'lightYellow',
      ASK_FOR_INFO: 'lightYellow',
      DECLINE: 'error',
      RETURN_TO_MAKER: 'darkBlue',
      RETURN_TO_SPECIALIST: 'darkBlue',
      RETURN_TO_STAFF: 'darkBlue',
      SUBMIT: 'success',
    };

    const buttonText = {
      APPROVE: 'Approve',
      APPROVE_ASK_FOR_INFO: 'Approve Ask For Info',
      ASK_FOR_INFO: 'Ask For Info',
      DECLINE: 'Decline',
      RETURN_TO_MAKER: 'Return to Maker',
      RETURN_TO_SPECIALIST: 'Return to Specialist',
      RETURN_TO_STAFF: 'Return to Specialist',
      SUBMIT: 'Submit',
    };

    const orderedButtons = actionButtonEntries.reduce(
      (acc, [key, value]) => {
        if (key === 'APPROVE' || key === 'APPROVE_ASK_FOR_INFO') {
          acc.push([key, value]);
        } else {
          acc.unshift([key, value]);
        }
        return acc;
      },
      []
    );

    return (
      <>
        {orderedButtons.map(([key, value]) => {
          if (!buttonText[key]) {
            return null;
          }

          const shouldDisable = key !== 'DECLINE' && isDebtorInvalid;

          return (
            <Button
              key={key}
              isLoading={isSubmitLoading}
              disabled={shouldDisable}
              color={buttonColor[key]}
              variant="contained"
              onClick={() => {
                handleActionButton(value as ActionButtonType);
              }}
            >
              {buttonText[key]}
            </Button>
          );
        })}
      </>
    );
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <Title title="Catatan" />
      <TableDebtorInformation module={state.pages.module} process={state.pages.process} />
      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        isLoading={false}
        initialValue={noteDetail?.notes}
      />
      <TableUploadDocument
        showModalSelector={true}
        module={state.pages.module}
        process={state.pages.process}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        <Button
          disabled={false}
          color="primary"
          variant="contained"
          onClick={() => {
            if (viewOnly) {
              goToNextStep();
            } else {
              convertToDocx(container).then(handleSave);
            }
          }}
        >
          {viewOnly ? 'Next' : 'Save'}
        </Button>
        {renderButton()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default NotePage;
