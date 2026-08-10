import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useBmpkAntOther from './BmpkAndOther.hooks';


const BmpkAndOther = () => {
  const theme = useTheme();
  const { control } = useBmpkAntOther();
  const viewOnly = true;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="BMPK/BMPD/BMPP/ Individual"></SectionTitle>

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
            name="bmpkAndOther.melampauiBMPKBMPDBMPPIndividual"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Melampaui BMPK/BMPD/BMPP/Individual"
                placeholder="Masukkan Melampaui BMPK/BMPD/BMPP/Individual"
                type="text"
              />
            }
          />

          <Controller
            name="bmpkAndOther.lastModified"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Last Modified"
                placeholder="Masukkan Last Modified"
                type="text"
              />
            }
          />

          <Controller
            name="bmpkAndOther.dataAsOf"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Data As Of"
                placeholder="Masukkan Data As Of"
                type="text"
              />
            }
          />

          <Controller
            name="bmpkAndOther.modifiedBy"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Modified By"
                placeholder="Masukkan Modified By"
                type="text"
              />
            }
          />
        </Box>
      </BaseContainer>

    </ColumnWrapper>
  );
};

export default BmpkAndOther;
