import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useDetail from './Detail.hooks';

import type { InputFieldType } from '@/components/shared/Input/Input.types';


const Detail = () => {
  const theme = useTheme();
  const { control } = useDetail();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Detail"></SectionTitle>

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
            name="noPK"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="No. PK/ No. Addendum"
                placeholder="No. PK/ No. Addendum"
                type="text"
              />
            }
          />

          <Controller
            name="typeAgreement"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Tipe Perjanjian (PK/Addendum)"
                placeholder="Tipe Perjanjian (PK/Addendum)"
                type="text"
              />
            }
          />

          <Controller
            name="sequence"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Sequence"
                placeholder="Sequence"
                type="text"
              />
            }
          />

          <Controller
            name="dateAgreement"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Tanggal PK/Addendum"
                placeholder="Tanggal PK/Addendum"
                type="text"
              />
            }
          />

          <Controller
            name="effectiveDate"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Tanggal Efektif"
                placeholder="Tanggal Efektif"
                type="text"
              />
            }
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Deskripsi"
                placeholder="Deskripsi"
                type="text"
              />
            }
          />

          <Controller
            name="descriptionNote"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Keterangan Deskripsi"
                placeholder="Keterangan Deskripsi"
                type="text"
              />
            }
          />

          <Controller
            name="signatureCondition"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Ada Syarat Penandatanganan (Y/N)"
                placeholder="Ada Syarat Penandatanganan (Y/N)"
                type="text"
              />
            }
          />

          <Controller
            name="effectiveCondition"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Ada Syarat Efektif (Y/N)"
                placeholder="Ada Syarat Efektif (Y/N)"
                type="text"
              />
            }
          />

        </Box>
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default Detail;
