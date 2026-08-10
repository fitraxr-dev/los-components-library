'use client';
import { CircularProgress } from '@mui/material';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';

import useSaveButtons from './SaveButtons.hook';

import type { SaveButtonProps } from './SaveButtons.types';


const SaveButtons = (props: SaveButtonProps) => {

  const { modifiedObject, renderActionButtons, handleClose, isFetching, handleConfirmCollaboration } = useSaveButtons();
  const { userIsRegistered, currentStatus, isConfirmed } = props;

  const WAITING_USER_COLLABORATION = 'RR_WAITING_UC';

  // console.log('user is registered: ', userIsRegistered, currentStatus, isConfirmed);

  const renderButton = () => {
    if (currentStatus !== WAITING_USER_COLLABORATION) {
      return renderActionButtons();
    } else if (userIsRegistered === undefined || isConfirmed === true) {
      return (<Button onClick={handleClose}>Close</Button>);
    } else { return (
      <>
        <Button
          onClick={() => handleConfirmCollaboration()}
          variant="contained"
          color="success"
        >
          Confirm
        </Button>
      </>); }

  };

  return (
    <RowWrapper sx={{ gap: 4, justifyContent: 'end' }}>
      {isFetching ? <CircularProgress /> : renderButton()}
    </RowWrapper>
  );
};

export default SaveButtons;
