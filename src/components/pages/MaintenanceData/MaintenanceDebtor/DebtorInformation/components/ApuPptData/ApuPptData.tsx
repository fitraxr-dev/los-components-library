import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useApuPptData from './ApuPptData.hooks';


const ApuPptData = () => {
  const theme = useTheme();
  const { control } = useApuPptData();
  const viewOnly = true;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="APU PPT Data"></SectionTitle>

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
            name="apuPptResponse.permitNumber"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Nomor Izin Dari Instansi Berwenang"
                placeholder="Masukkan Nomor Izin Dari Instansi Berwenang"
                type="text"
              />
            }
          />

          <Controller
            name="apuPptResponse.sourceOfFunds"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Sumber Dana"
                placeholder="Masukkan Sumber Dana"
                type="text"
              />
            }
          />

          <Controller
            name="apuPptResponse.businessField"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Bidang Usaha / Kegiatan Usaha"
                placeholder="Masukkan Bidang Usaha / Kegiatan Usaha"
                type="text"
              />
            }
          />

          <Controller
            name="apuPptResponse.businessGoals"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Maksud & Tujuan Hubungan Usaha"
                placeholder="Masukkan Maksud & Tujuan Hubungan Usaha"
                type="text"
              />
            }
          />

          <Controller
            name="apuPptResponse.placeAndDateEstablishment"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Tempat & Tanggal Pendirian"
                placeholder="Masukkan Tempat & Tanggal Pendirian"
                type="text"
              />
            }
          />

          <Controller
            name="apuPptResponse.income"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Penghasilan"
                placeholder="Masukkan Penghasilan"
                type="text"
              />
            }
          />

          <Controller
            name="apuPptResponse.formOfBusinessField"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Bentuk Usaha"
                placeholder="Masukkan Bentuk Usaha"
                type="text"
              />
            }
          />

          <Controller
            name="apuPptResponse.account"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Rekening Yang Dimiliki"
                placeholder="Masukkan Rekening Yang Dimiliki"
                type="text"
              />
            }
          />

          <Controller
            name="apuPptResponse.stockExchange"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Terdaftar Dalam Bursa Efek"
                placeholder="Masukkan Terdaftar Dalam Bursa Efek"
                type="text"
              />
            }
          />

          <Controller
            name="apuPptResponse.lastModified"
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
            name="apuPptResponse.ultimateBeneficialOwner"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Pemilik Manfaat Utama / Ultimate Beneficial Owner"
                placeholder="Masukkan Pemilik Manfaat Utama / Ultimate Beneficial Owner"
                type="text"
              />
            }
          />

          <Controller
            name="apuPptResponse.modifiedBy"
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

export default ApuPptData;
