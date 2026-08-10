import { useEffect } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { CANCELED, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


type DeclineModalProps = {
  onSave: ({ comment, radioValue }: { comment: string; radioValue: string }) => void;
  isLoading?: boolean;
};

type FormValues = {
  comment: string;
};

const DeclineModal = NiceModal.create((props: DeclineModalProps) => {
  const theme = useTheme();
  const modalId = MODAL.DECLINE;
  const { visible } = useModal(modalId);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    setFocus,
  } = useForm<FormValues>({
    defaultValues: { comment: '' },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (visible) setTimeout(() => setFocus('comment'), 0);
  }, [visible, setFocus]);

  const disabled = !isValid || props?.isLoading || isSubmitting;

  const submitWith = (radioValue: string) =>
    handleSubmit((data: FormValues) => props.onSave({ comment: data.comment.trim(), radioValue }))();

  return (
    <SectionModal
      title="Comment"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '40vw' }}
    >
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <Controller
          name="comment"
          control={control}
          rules={{ required: 'Comment is required' }}
          render={({ field: { ...field }, fieldState }) => (
            <Input
              label="Comment"
              placeholder="Input Comment"
              type="area"
              multiline
              rows={5}
              disabled={props?.isLoading}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              isMandatory
              {...field}
            />
          )}
        />

        <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 1 }}>
          <Button variant="outlined" onClick={() => closeNiceModal(modalId)} disabled={props?.isLoading}>
            Close
          </Button>
          <Button
            color="error"
            onClick={() => submitWith(CANCELED)}
            disabled={disabled}
            isLoading={props?.isLoading}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => submitWith(REJECTED)}
            disabled={disabled}
            isLoading={props?.isLoading}
          >
            Reject
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default DeclineModal;
