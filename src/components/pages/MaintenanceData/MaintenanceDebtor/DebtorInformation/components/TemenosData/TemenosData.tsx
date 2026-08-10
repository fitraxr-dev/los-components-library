import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useOtherCommonInformation from './TemenosData.hooks';


const TemenosData = () => {
  const theme = useTheme();
  const { control } = useOtherCommonInformation();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Temenos Data"></SectionTitle>

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
            name="idLegacy"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="ID Legacy"
                placeholder="Masukkan ID Legacy"
                type="text"
              />
            }
          />

          <Controller
            name="customerGroup"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Kelompok Nasabah"
                placeholder="Masukkan Kelompok Nasabah"
                type="text"
              />
            }
          />

          <Controller
            name="contractCode"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Kode Kontrak"
                placeholder="Masukkan Kode Kontrak"
                type="text"
              />
            }
          />

          <Controller
            name="registrationNumber"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="No Registrasi"
                placeholder="Masukkan No Registrasi"
                type="text"
              />
            }
          />

          <Controller
            name="customerRole"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Peran Nasabah"
                placeholder="Masukkan Peran Nasabah"
                type="text"
              />
            }
          />

          <Controller
            name="destinationBank"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Bank Tujuan"
                placeholder="Masukkan Bank Tujuan"
                type="text"
              />
            }
          />

          <Controller
            name="companyName"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Perusahaan"
                placeholder="Masukkan Nama Perusahaan"
                type="text"
              />
            }
          />

          <Controller
            name="destinationAccountNumber"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="No Rekening Tujuan"
                placeholder="Masukkan No Rekening Tujuan"
                type="text"
              />
            }
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Status"
                placeholder="Masukkan Status"
                type="text"
              />
            }
          />

          <Controller
            name="destinationAccountOwnerName"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Pemilik Rekening Tujuan"
                placeholder="Masukkan Nama Pemilik Rekening Tujuan"
                type="text"
              />
            }
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Kategori"
                placeholder="Masukkan Kategori"
                type="text"
              />
            }
          />

          <Controller
            name="currency"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Mata Uang"
                placeholder="Masukkan Mata Uang"
                type="text"
              />
            }
          />

          <Controller
            name="market"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Market"
                placeholder="Masukkan Market"
                type="text"
              />
            }
          />

          <Controller
            name="economicSector"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Sektor Ekonomi"
                placeholder="Masukkan Sektor Ekonomi"
                type="text"
              />
            }
          />


        </Box>
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default TemenosData;
