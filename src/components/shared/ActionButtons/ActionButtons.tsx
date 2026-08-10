import React from 'react';

import { accessid } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';


// Define action constants
export const ACTIONS = {
  APPROVE: 'APPROVE',
  CANCEL: 'CANCELED',
  CLOSE: 'CLOSE',
  COMPLETED: 'COMPLETED',
  DECLINE: 'DECLINE',
  REJECT: 'REJECTED',
  RETURN_TO_MAKER: 'RETURN_TO_MAKER',
  RETURN_TO_STAFF: 'RETURN_TO_STAFF',
  SAVE: 'SAVE',
  SUBMIT: 'SUBMIT',
};

export type ActionButtonsProps = {
  actions: Record<string, string>;
  handleSave?: (data?: any) => void;
  handleOpenSubmitModal?: (params: { action: string }) => void;
  isPending?: boolean;
  isSubmitLoading?: boolean;
  isAutoSaveFetching?: boolean;
  viewOnly?: boolean;
  onClose?: () => void;
  sx?: Record<string, any>;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  actions = {},
  handleSave,
  handleOpenSubmitModal,
  isPending = false,
  isSubmitLoading = false,
  isAutoSaveFetching = false,
  viewOnly = false,
  onClose,
  sx = {},
}) => {


  const [state] = useApp();
  const canEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const isKadiv = state.currentRole.includes('KADIV');
  const isChecker = state.currentRole.includes('CHECKER');
  const isMaker = state.currentRole.includes('MAKER');
  const currentStatus = state.stepper.from;


  return (
    <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3, py: 3, ...sx }}>
      {/* Decline Button */}
      {(actions[ACTIONS.CANCEL] || actions[ACTIONS.REJECT] || actions[ACTIONS.DECLINE]) && (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleOpenSubmitModal?.({ action: ACTIONS.DECLINE })}
          disabled={isSubmitLoading}
        >
          Decline
        </Button>
      )}

      {/* Save Button */}
      {actions[ACTIONS.SAVE] && handleSave && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isPending || isSubmitLoading || isAutoSaveFetching}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
      )}

      {/* Return to Staff Button */}
      {actions[ACTIONS.RETURN_TO_STAFF] && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenSubmitModal?.({ action: actions[ACTIONS.RETURN_TO_STAFF] })}
          disabled={isSubmitLoading}
        >
          Return to staff
        </Button>
      )}

      {/* Return to Maker Button */}
      {actions[ACTIONS.RETURN_TO_MAKER] && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenSubmitModal?.({ action: actions[ACTIONS.RETURN_TO_MAKER] })}
          disabled={isSubmitLoading}
        >
          Return to maker
        </Button>
      )}

      {/* Submit/Approve Button */}
      {actions[ACTIONS.SUBMIT] && (
        <Button
          variant="contained"
          color="success"
          onClick={() => handleOpenSubmitModal?.({ action: actions[ACTIONS.SUBMIT] })}
          disabled={isSubmitLoading || (isMaker ? false : (canEdit ? viewOnly : false))}
        >
          {(actions[ACTIONS.SUBMIT] === ACTIONS.APPROVE ||
          actions[ACTIONS.SUBMIT] === ACTIONS.COMPLETED ||
          isKadiv ||
          isChecker || (isMaker && currentStatus === 'WAITING_APPROVAL_KADIV'))
            ? 'Approve'
            : 'Submit'}
        </Button>
      )}

      {(actions[ACTIONS.CLOSE]) && (
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Close
        </Button>
      )}
    </RowWrapper>
  );
};

export default ActionButtons;
