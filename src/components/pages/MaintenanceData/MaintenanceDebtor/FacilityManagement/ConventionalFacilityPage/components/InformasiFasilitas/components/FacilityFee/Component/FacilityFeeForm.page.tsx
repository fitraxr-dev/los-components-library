import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal/SectionModal';

import { modal } from '../FacilityFee.constant';

import useFacilityFeeForm from './FacilityFeeForm.hooks';


const FacilityFeeForm = NiceModal.create((props: any) => {

  const modalId = modal.MODAL_ADD;
  const { visible } = useModal(modalId);

  const {
    control,
    watch,
    theme,
    errors,
    isValid,
    handleSave,
    feeTypeList,
    inputType,
    setValue,
  } = useFacilityFeeForm(props);

  return (
    <SectionModal
      title="Facility Fee"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
    >
      <Box sx={{ display: 'grid', gridGap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)', mb: theme.spacing(3) }}>
        <Controller
          name="typeOfFee"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="dropdown"
              label="Type of Fee"
              dropdownList={feeTypeList}
              isMandatory
              placeholder="Select Type of Fee"
              onChange={(e: any) => {
                field.onChange(e);
                const val = e?.target ? e.target.value : e;
                const dataTemp = feeTypeList?.find((item: any) => item.value === val);
                if (dataTemp) {
                  const resolvedInputType = dataTemp?.inputType === 'P' ? 'percentage' : 'amount';
                  setValue('inputType', resolvedInputType as any, { shouldDirty: true, shouldValidate: true });
                  setValue('basicType', dataTemp?.basisType as any, { shouldDirty: true, shouldValidate: true });
                }
              }}
              error={!!errors.typeOfFee}
              helperText={errors.typeOfFee?.message}
            />
          )}
        />
        <Controller
          name="inputType"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="radio"
              radioList={[
                { label: 'Amount', value: 'amount' },
                { label: 'Percentage', value: 'percentage' },
              ]}
              label="Input Type"
              isMandatory
              placeholder="Input Input Type"
              error={!!errors.inputType}
              helperText={errors.inputType?.message}
            />
          )}
        />
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Amount"
              isMandatory
              disabled={inputType !== 'amount'}
              placeholder="Input Amount"
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          )}
        />
        <Controller
          name="percentage"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Percentage (%)"
              isMandatory
              disabled={inputType !== 'percentage'}
              placeholder="Input Percentage"
              isAllowed={(values: any) => {
                const { floatValue } = values;
                return floatValue === undefined || floatValue <= 100;
              }}
              error={!!errors.percentage}
              helperText={errors.percentage?.message}
            />
          )}
        />
        <Controller
          name="basicType"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="radio"
              radioList={[
                { label: 'Accrual Basis', value: '1' },
                { label: 'Cash Basis', value: '0' },
              ]}
              label="Basis Type"
              isMandatory
              placeholder="Input Basis Type"
              disabled
              error={!!errors.basicType}
              helperText={errors.basicType?.message}
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

export default FacilityFeeForm;
