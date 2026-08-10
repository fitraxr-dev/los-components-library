import React, { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import ModalTransition from '../ModalTransition';

import type { ModalCommentProps } from './ModalComment.types';

/**
 * ModalComment component is a part of the NiceModal library and allows users to add or view comments.
 *
 * @component
 * @example
 * // Example of using the ModalComment component to add a comment
 * NiceModal.show(MODAL.GLOBAL.COMMENT, {
 *   viewOnly: false,
 *   onSave: () => {},
 *   initialComment: 'Hello world',
 * });
 *
 * @param {Object} options - Options for configuring the ConfirmModal.
 * @param {boolean} [options.viewOnly=false] - Flag indicating whether the modal is in view-only mode.
 * @param {Function} [options.onSave] - Callback function triggered when the user clicks the "Save" button.
 * @param {string} [options.initialComment] - The initial comment to be displayed in the input field.
 * @returns {JSX.Element} JSX.Element
 */

const ModalComment = NiceModal.create(({
  title = 'Comment',
  viewOnly,
  onSave,
  initialComment,
  radioLabel,
  radioOptions,
  addedSection,
  submitText = 'Save',
  isLoading,
  label = 'Comment',
  isRadioMandatory = false,
  submitButtonColor = 'primary',
}: ModalCommentProps) => {
  const theme = useTheme();
  const [value, setValue] = useState(initialComment || '');
  const [radioValue, setRadioValue] = useState(null);

  const modal = useModal();
  const modalId = MODAL.GLOBAL.COMMENT;

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          maxHeight: '60vh',
          maxWidth: '73vw',
          minWidth: '60vw',
          padding: theme.spacing(4),
        },
      }}
    >
      <RowWrapper
        sx={{
          borderBottom: 1,
          borderColor: theme.palette.custom.gray30,
          borderWidth: '0.02vw',
          justifyContent: 'center',
          marginBottom: theme.spacing(4),
        }}
      >
        <TextStyle
          variant="body1"
          weight={600}
          color={theme.palette.primary.main}
          sx={{
            py: 2,
          }}
        >
          {title}
        </TextStyle>
      </RowWrapper>

      {addedSection}

      {radioOptions?.length && (
        <Input
          type="radio"
          value={radioValue}
          onChange={(e) => setRadioValue(e.target.value)}
          label={radioLabel ?? ''}
          radioList={radioOptions?.map((el) => ({
            label: el?.label,
            value: el?.value,
          }))}
          sx={{ flex: 1, mb: 4 }}
          isMandatory={isRadioMandatory}
        />
      )}

      <Input
        type="area"
        label={label}
        placeholder="Comment"
        rows={6}
        multiline
        value={value}
        onChange={(val) => setValue(val)}
        {...(viewOnly && { disabled: true })}
      />
      {viewOnly ? (
        <RowWrapper sx={{ justifyContent: 'end', mt: 4 }}>
          <>
            <Button
              variant="outlined"
              onClick={() => closeNiceModal(modalId)}
              sx={{ height: '3vw', width: '8vw' }}
            >
              Close
            </Button>
          </>
        </RowWrapper>
      ) : (
        <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave({
              comment: value,
              radioValue,
            })}
            color={submitButtonColor}
            disabled={!value || (radioOptions?.length && !radioValue)}
            isLoading={isLoading}
          >
            {submitText}
          </Button>
        </RowWrapper>
      )}
    </Dialog>
  );


});
export default ModalComment;
