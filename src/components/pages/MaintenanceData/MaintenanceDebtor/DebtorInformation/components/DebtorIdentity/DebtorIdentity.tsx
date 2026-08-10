import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useGeneralInformation from './DebtorIdentity.hooks';

import type { InputFieldType } from '@/components/shared/Input/Input.types';


const DebtorIdentity = () => {
  const theme = useTheme();
  const { control } = useGeneralInformation();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Customer Identity"></SectionTitle>

      <BaseContainer
        sx={{
          boxShadow: 2,
          maxWidth: '100%',
          padding: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >

          <Controller
            name="identity.npwp"
            control={control}
            render={({ field }) => {

              return (
                <Input
                  {...field}
                  label="No. Npwp"
                  placeholder="Masukkan No. Npwp"
                  type="number"
                  maxLength={16}
                  onValueChange={(values) => {
                    field.onChange(values.value);

                  }}
                  error={!!errorNpwp}
                  helperText={errorNpwp}
                />
              );
            }}
          />

          <Controller
            name="identity.lastNotaryDeedDate"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Last Notary Deed Date"
                placeholder="Masukkan Last Notary Deed Date"
                type="date"
              />
            }
          />

          <Controller
            name="identity.noNotaryDeed"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="No. Notary deed"
                placeholder="Masukkan No. Notary deed"
                type="text"
              />
            }
          />

          <Controller
            name="identity.lastModified"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Last Modified"
                placeholder="Masukkan Last Modified"
                type="date"
              />
            }
          />

          <Controller
            name="identity.firstNotaeyDeedDate"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="First Notary Deed Date"
                placeholder="Masukkan First Notary Deed Date"
                type="date"
              />
            }
          />

          <Controller
            name="identity.modifiedBy"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Modified By"
                placeholder="Masukkan Modified By"
                type="text"
              />
            }
          />

          <Controller
            name="identity.lastNotaryDeed"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="No. Last Notary Deed"
                placeholder="Masukkan No. Last Notary Deed"
                type="text"
              />
            }
          />
        </Box>
      </BaseContainer>

    </ColumnWrapper>
  );
};

export default DebtorIdentity;
