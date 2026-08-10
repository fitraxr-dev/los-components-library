'use client';

import { create } from '@ebay/nice-modal-react';
import { Box, Typography, useTheme } from '@mui/material';


import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


import useSubmissionDraftModal from './SubmissionDraftModal.hook';


const SubmissionDraftModal = create(() => {
  const theme = useTheme();

  const {
    handleClose,
    handleSave,
    isLoading,
    masintonChange,
    masintonForm,
    visible,
    optionMappingPkAdendum,
    isLoadingMappingPk,
    isDisabled,
  } = useSubmissionDraftModal();

  const {
    agreementMapping,
    agreementType,
  } = masintonForm;

  return (
    <SectionModal
      title="ADD New PK"
      containerSx={{ minWidth: '45vw' }}
      isOpen={visible}
      customFooter={() => null}
    >
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
        Nama PK
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Input
          type="radio"
          label="Tipe Perjanjian"
          isMandatory
          position="horizontal"
          value={agreementType.value}
          onChange={(val) => masintonChange('agreementType', val.target.value)}
          radioList={[
            { label: 'PK', value: 'PK' },
            { label: 'Adendum', value: 'ADD' }
          ]}
          error={agreementType.error}
          helperText={agreementType.error && agreementType.errorMessage}
        />

        <Input
          disabled={isDisabled}
          label="Mapping PK/Adendum"
          placeholder="Choose mapping PK/Adendum"
          isMandatory
          type="dropdown"
          value={agreementMapping.value}
          onChange={(val) => masintonChange('agreementMapping', val)}
          dropdownList={optionMappingPkAdendum}
          error={agreementMapping.error}
          helperText={agreementMapping.error && agreementMapping.errorMessage}
        />
      </Box>
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} isLoading={isLoading || isLoadingMappingPk}>
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default SubmissionDraftModal;
