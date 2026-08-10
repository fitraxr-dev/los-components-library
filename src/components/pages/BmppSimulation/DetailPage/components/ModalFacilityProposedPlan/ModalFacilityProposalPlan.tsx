import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import { modal } from '../../Detail.constants';

import useModalFacilityProposalPlan from './ModalFacilityProposalPlan.hook';

import type { ModalFacilityProposalPlanProps } from './ModalFacilityProposalPlan.types';


const ModalFacilityProposalPlan = create((props: ModalFacilityProposalPlanProps) => {
  const theme = useTheme();
  const modalId = modal.facilityProposalPlan;
  const { visible } = useModal(modalId);

  const { control, handleSubmit, watch, setValue } = useForm({
    mode: 'onChange',
  });

  const {
    handleOnSave,
    isSaveLoading,
  } = useModalFacilityProposalPlan({ ...props, setValue });

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '25vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Title title="Rencana Usulan Fasilitas" sx={{ mb: theme.spacing(2), mx: 'auto' }} />
        <Box>
          <RowWrapper
            sx={{
              borderColor: theme.palette.custom.gray30,
            }}
          >
            <TextStyle variant="body4" weight={600}>
              Nominal
            </TextStyle>
          </RowWrapper>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(2),
            gridTemplateColumns: '0.3fr 1fr',
            marginBottom: theme.spacing(2),
          }}
        >
          <Controller
            control={control}
            name="currency"
            render={({ field: { ref, onChange, ...field } }) => (
              <Input
                {...field}
                ref={ref}
                type="text"
                placeholder="IDR"
                containerSx={{ flex: 1 }}
                value="IDR"
                disabled
              />
            )}
          />
          <Controller
            control={control}
            name="nominalInIdr"
            render={({ field: { ref, onChange, ...field }, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                value={props.nominalInIdr}
                ref={ref}
                type="number"
                placeholder="Input Nominal"
                containerSx={{ flex: 1 }}
                error={invalid}
                decimalScale={3}
                thousandSeparator=","
                onValueChange={(values: { formattedValue: string }) => {
                  onChange(values?.formattedValue);
                }}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(2),
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modal.facilityProposalPlan)}
          >
            Cancel
          </Button>
          <Button
            isLoading={isSaveLoading}
            disabled={!watch('nominalInIdr') || isSaveLoading}
            onClick={handleSubmit(handleOnSave)}
          >
            Save
          </Button>
        </Box>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalFacilityProposalPlan;
