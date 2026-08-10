'use client';
import NiceModal from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useAddEditProjectPhase from './AddEditProjectPhase.hooks';


interface Data {
  id: number;
  name: string;
  statusAsOf: string;
}

interface AddEditProjectPhaseProps {
  action: 'Add' | 'Edit';
  projectCode: string;
  data?: Data;
  listPayload: any;
}

const AddEditProjectPhase = NiceModal.create((props: AddEditProjectPhaseProps) => {
  const {
    maxDate,
    modal,
    modalId,
    theme,
    control,
    isSaveLoading,
    isValid,
    handleSubmit,
    action,
    handleSave,
  } = useAddEditProjectPhase(props);

  return (
    <SectionModal
      title={action === 'Add' ? 'Add Project Phase' : 'Edit Project Phase'}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
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
        <Box sx={{ gridColumn: 'span 2' }}>
          <Controller
            name="projectPhase"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Project Phase"
                placeholder="Input Project Phase"
                type="area"
                isMandatory
              />
            }
          />
        </Box>
        <Controller
          name="statusAsOf"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Status as Of"
              placeholder="Choose Status as Of"
              type="date"
              isMandatory
              maxDate={String(maxDate)}
            />
          }
        />
      </Box>
      <RowWrapper marginTop={5} justifyContent="end" gap={2}>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
        <Button
          isLoading={isSaveLoading}
          onClick={handleSubmit(handleSave)}
          disabled={!isValid}
        >
          Save
        </Button>
      </RowWrapper>


    </SectionModal>
  );
});

export default AddEditProjectPhase;
