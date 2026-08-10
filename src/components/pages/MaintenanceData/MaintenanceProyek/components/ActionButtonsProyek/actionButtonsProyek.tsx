import React from 'react';

import { usePathname } from 'next/navigation';

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

export type ActionButtonsProyekProps = {
  actions: Record<string, string>;
  handleSave?: (data?: any) => void;
  handleOpenSubmitModal?: (params: { action: string }) => void;
  isDeclineDisable?: boolean;
  isReturnToStaffDisable?: boolean;
  isSaveDisable?: boolean;
  isSubmitDisable?: boolean;
  isReturnToMakerLoading?: boolean;
  isDeclineLoading?: boolean;
  isAutoSaveFetching?: boolean;
  isReturnToStaffLoading?: boolean;
  isSaveLoading?: boolean;
  isSubmitLoading?: boolean;
  isReturnToMakerDisable?: boolean;
  viewOnly?: boolean;
  onClose?: () => void;
  sx?: Record<string, any>;
  currentRole?: string[];
};

const ActionButtonsProyek: React.FC<ActionButtonsProyekProps> = ({
  actions = {},
  handleSave,
  handleOpenSubmitModal,
  isDeclineDisable = false,
  isReturnToStaffDisable = false,
  isReturnToMakerDisable = false,
  isSaveDisable = false,
  isAutoSaveFetching = false,
  isSubmitDisable = false,
  isReturnToMakerLoading = false,
  isDeclineLoading = false,
  isReturnToStaffLoading = false,
  isSaveLoading = false,
  isSubmitLoading = false,
  viewOnly = false,
  onClose,
  sx = {},
  currentRole,
}) => {
  const pathname = usePathname();

  // Check if current URL contains 'PRJ'
  const containsPRJ = pathname.includes('PRJ');

  // Determine the action based on role
  const getDeclineAction = () => {
    if (currentRole?.includes('STAFF')) {
      return ACTIONS.CANCEL;
    }
    return ACTIONS.DECLINE;
  };

  return (
    <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3, py: 3, ...sx }}>
      {/* Decline Button */}
      {(actions[ACTIONS.CANCEL] || actions[ACTIONS.REJECT] || actions[ACTIONS.DECLINE]) && (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleOpenSubmitModal?.({ action: getDeclineAction() })}
          isLoading={isDeclineLoading}
          disabled={isDeclineDisable || containsPRJ}
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
          isLoading={isSaveLoading}
          disabled={isSaveDisable || isAutoSaveFetching}
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
          isLoading={isReturnToStaffLoading}
          disabled={isReturnToStaffDisable}
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
          isLoading={isReturnToMakerLoading}
          disabled={isReturnToMakerDisable}
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
          isLoading={isSubmitLoading}
          disabled={isSubmitDisable || containsPRJ}
        >
          {(actions[ACTIONS.SUBMIT] === ACTIONS.APPROVE || actions[ACTIONS.SUBMIT] === ACTIONS.COMPLETED)
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

export default ActionButtonsProyek;
