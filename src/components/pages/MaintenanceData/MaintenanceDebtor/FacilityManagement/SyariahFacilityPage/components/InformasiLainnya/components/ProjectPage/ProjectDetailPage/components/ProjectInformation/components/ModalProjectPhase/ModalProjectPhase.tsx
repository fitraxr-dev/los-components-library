import NiceModal from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useModalProjectPhase from './ModalProjectPhase.hook';


const ModalProjectPhase = NiceModal.create(() => {
  const { visible, modalId, control, theme } = useModalProjectPhase();
  return (
    <SectionModal
      title="Add Project Phase"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '50vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Controller
          name="projectPhase"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <Input
              {...field}
              type="area"
              label="Project Phase"
              placeholder="Input Project Phase"
              rows={4}
              isMandatory
            />
          )}
        />
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="statusasof"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                type="date"
                label="Status as Of"
                placeholder="Input Status as Of"
                isMandatory
              />
            )}
          />
        </Box>
      </ColumnWrapper>
      <RowWrapper gap={2} justifyContent="end">
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          onClick={() => closeNiceModal(modalId)}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalProjectPhase;
