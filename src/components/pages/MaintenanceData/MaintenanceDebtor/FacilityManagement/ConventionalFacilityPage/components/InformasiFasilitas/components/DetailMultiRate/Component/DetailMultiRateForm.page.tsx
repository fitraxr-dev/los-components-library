import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, Typography, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal/SectionModal';

import { modal } from '../DetailMultiRate.constant';

import useDetailMultiRateForm, { formatToSixDecimal } from './DetailMultiRateForm.hooks';


const DetailMultiRateForm = NiceModal.create((props: any) => {

  const modalId = modal.MODAL_ADD;
  const { visible } = useModal(modalId);

  const {
    control,
    data,
    theme,
    watch,
    handleSave,
    errors,
    isValid,
  } = useDetailMultiRateForm(props);

  console.log(control._formValues);

  return (
    <SectionModal
      title={!!data ? 'Edit Detail Multi Rate' : 'Add Detail Multi Rate'}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
    >
      <Box sx={{ display: 'grid', gridGap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)', mb: theme.spacing(3) }}>
        <Controller
          name="period"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              inputProps={{ type: 'number' }}
              label="Period (Year)"
              isMandatory
              placeholder="Input Period (Year)"
              error={!!errors.period}
              helperText={errors.period?.message}
              onKeyDown={(e: any) => {
                if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          )}
        />
        <Controller
          name="baseRate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Base Rate (%)"
              placeholder="Base Rate (%)"
              error={!!errors.baseRate}
              helperText={errors.baseRate?.message}
              inputProps={{
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                  // Allow max 6 decimal digits
                  const val = (e.target as HTMLInputElement).value;
                  const decPart = val.includes('.') ? val.split('.')[1] : '';
                  if (decPart.length >= 6 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) && !/^[0-9]$/.test(e.key) === false) {
                    // only block digit keys when already 6 decimals
                  }
                },
                step: 'any',
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                const formatted = formatToSixDecimal(e.target.value);
                field.onChange(formatted);
                field.onBlur();
              }}
            />
          )}
        />
        <Controller
          name="margin"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Margin Rate (%)"
              isMandatory
              placeholder="Input Margin Rate (%)"
              error={!!errors.margin}
              helperText={errors.margin?.message}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                const formatted = formatToSixDecimal(e.target.value);
                field.onChange(formatted);
                field.onBlur();
              }}
            />
          )}
        />
        <Controller
          name="totalEffectiveRate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Total Effective Rate (%)"
              isMandatory
              disabled
              placeholder="Input Total Effective Rate (%)"
              error={!!errors.totalEffectiveRate}
              helperText={errors.totalEffectiveRate?.message}
            />
          )}
        />
      </Box>
      <RowWrapper sx={{ gap: theme.spacing(3), justifyContent: 'end', mb: 2 }}>
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid}>
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default DetailMultiRateForm;
