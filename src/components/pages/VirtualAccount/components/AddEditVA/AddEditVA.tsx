'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../ListPage/List.constants';

import useAddEditVa from './AddEditVA.hooks';


interface Data {
  id?: number;
  bank?: string;
  currency?: string;
  customerType?: string;
  vaType?: string;
}

interface AddEditVaProps {
  action: 'Add' | 'Edit';
  data?: Data;
}

const AddEditVa = NiceModal.create((props: AddEditVaProps) => {
  const {
    theme,
    control,
    isSaveLoading,
    isAutoSaveFetching,
    isValid,
    handleSubmit,
    action,
    handleSave,
    bankOptions,
    currencyOptions,
    vaTypeOptions,
    customerTypeOptions,
    isCurrencyEnabled,
    isCustomerTypeEnabled,
    isVaTypeEnabled,
  } = useAddEditVa(props);
  const { visible } = useModal(modal.ADD_EDIT_VA);


  const modalTitle = action === 'Edit' ? 'Edit Virtual Account' : 'Create Virtual Account';

  return (
    <SectionModal
      title={modalTitle}
      isOpen={visible}
      onClose={() => closeNiceModal(modal.ADD_EDIT_VA)}
      customFooter={() => null}
      containerSx={{ minWidth: '70vw' }}
    >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
          py: 2,
        }}
      >
        {/* Bank */}
        <Controller
          name="bank"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Bank"
              placeholder="Choose Bank"
              type="dropdown-search"
              isMandatory
              dropdownList={bankOptions}
            />
          )}
        />
        {/* Currency */}
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={!isCurrencyEnabled}
              label="Currency"
              placeholder="Choose Currency"
              type="dropdown-search"
              isMandatory
              dropdownList={currencyOptions}
            />
          )}
        />
        {/* VA Type */}
        <Controller
          name="vaType"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={!isVaTypeEnabled}
              label="VA Type"
              placeholder="Choose VA Type"
              type="dropdown-search"
              isMandatory
              dropdownList={vaTypeOptions}
            />
          )}
        />
        {/* Customer Type */}
        <Controller
          name="customerType"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={!isCustomerTypeEnabled}
              label="Customer Type"
              placeholder="Choose Customer Type"
              type="dropdown-search"
              isMandatory
              dropdownList={customerTypeOptions}
            />
          )}
        />
      </Box>
      <RowWrapper marginTop={5} justifyContent="end" gap={2}>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modal.ADD_EDIT_VA)}
        >
          Close
        </Button>
        <Button
          isLoading={isSaveLoading}
          onClick={handleSubmit(handleSave)}
          disabled={!isValid || isSaveLoading || isAutoSaveFetching}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default AddEditVa;
