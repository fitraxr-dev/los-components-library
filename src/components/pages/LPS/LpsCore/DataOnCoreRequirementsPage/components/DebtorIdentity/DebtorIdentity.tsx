import React from 'react';

import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { formatDate, formatDateTime } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';


const DebtorIdentity = () => {
  const { setValue, watch } = useFormContext();

  return (
    <ColumnWrapper sx={{ gap: 2 }}>
      <SectionTitle title="Customer Identity" isOpen>
        <BaseContainer>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <Input
              label="NPWP No."
              value={watch('npwp')}
              onChange={(value) => setValue('npwp', value)}
              placeholder="NPWP No."
              isMandatory
              disabled
            />
            <Input
              label="Notary Deed No."
              value={watch('notaryDeedNumber')}
              onChange={(value) => setValue('notaryDeedNumber', value)}
              placeholder="Notary Deed No."
              isMandatory
              disabled
            />
            <Input
              label="Tanggal Pendirian"
              value={watch('establishmentDate') ? formatDate(watch('establishmentDate')) : null}
              onChange={(value) => setValue('establishmentDate', value)}
              placeholder="Tanggal Pendirian"
              isMandatory
              disabled
            />
            <Input
              label="Tempat Pendirian"
              value={watch('establishmentPlace')}
              onChange={(value) => setValue('establishmentPlace', value)}
              placeholder="Tempat Pendirian"
              isMandatory
              disabled
            />
          </Box>

        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default DebtorIdentity;
