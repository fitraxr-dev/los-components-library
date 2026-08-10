import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal/SectionModal';

import { modal } from '../BusinessHolidayCountry.constant';

import useBusinessHolidayCountryForm from './BusinessHolidayCountryForm.hooks';


const BusinessHolidayCountryForm = NiceModal.create((props: any) => {

  const modalId = modal.MODAL_ADD;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  const {
    control,
    errors,
    isValid,
    handleSave,
    calendarList,
    isCalendarListSuccess,
  } = useBusinessHolidayCountryForm(props);

  return (
    <SectionModal
      title="Business Holiday Country"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
    >
      <Box sx={{ display: 'grid', gridGap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)', mb: theme.spacing(3) }}>
        <Controller
          name="calenderCode"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Calendar Code"
              disabled
              isMandatory
              placeholder="Input Calendar Code"
              error={!!errors.calenderCode}
              helperText={errors.calenderCode?.message}
            />
          )}
        />
        <Controller
          name="calenderName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="dropdown"
              label="Calendar Name"
              dropdownList={calendarList}
              isMandatory
              placeholder="Input Calendar Name"
              error={!!errors.calenderName}
              helperText={errors.calenderName?.message}
            />
          )}
        />
      </Box>
      <RowWrapper sx={{ gap: theme.spacing(3), justifyContent: 'end', mb: 2 }}>
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid || !isCalendarListSuccess}>
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default BusinessHolidayCountryForm;
