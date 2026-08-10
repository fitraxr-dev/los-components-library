import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import useContractor from './Contractor.hooks';


const Contractor = () => {
  const theme = useTheme();
  const { control } = useContractor();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Contractor" isOpen>
        <Box paddingY={theme.spacing(3)} gap={theme.spacing(3)} display="flex" flexDirection="column">


          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Controller
              name="contractor.name"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Nama Kontraktor"
                  placeholder="Masukkan Nama Kontraktor"
                  type="text"
                />
              }
            />

            <Controller
              name="contractor.website"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Website Kontraktor"
                  placeholder="Masukkan Website Kontraktor"
                  type="text"
                />
              }
            />
          </Box>

          <Controller
            name="contractor.address"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Alamat Kantor Kontraktor"
                placeholder="Masukkan Alamat Kantor Kontraktor"
                type="area"
                rows={4}
              />
            }
          />

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >

            <Controller
              name="contractor.contactName"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Nama Kontak Kontraktor"
                  placeholder="Masukkan Nama Kontak Kontraktor"
                  type="text"
                />
              }
            />

            <Controller
              name="contractor.email"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Email Kontak Kontraktor"
                  placeholder="Masukkan Email Kontak Kontraktor"
                  type="text"
                />
              }
            />

            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.custom.gray30}
                >
                  Telepon
                </TextStyle>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.error.main}
                >
                  *
                </TextStyle>
              </RowWrapper>
              <Box display="flex" gap={theme.spacing(2)}>
                <Controller
                  name="contractor.phone.phoneCode"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label=""
                      placeholder="Kode"
                      type="text"
                      disabled
                    />
                  }
                />
                <Controller
                  name="contractor.phone.phoneNumber"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label=""
                      placeholder="Nomor Telepon"
                      type="text"
                      containerSx={{
                        width: '80%',
                      }}
                      disabled
                    />
                  }
                />
                <Controller
                  name="contractor.phone.phoneExt"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label=""
                      placeholder="Ext"
                      type="text"
                      disabled
                    />
                  }
                />
              </Box>
            </Box>

            <Controller
              name="contractor.classification"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Klasifikasi Usaha Kontraktor"
                  placeholder="Masukkan Klasifikasi Usaha Kontraktor"
                  type="text"
                />
              }
            />

          </Box>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Controller
              name="contractor.modifiedBy"
              control={control}
              disabled
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
              name="contractor.modifiedDate"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Last Modified"
                  placeholder="Masukkan Last Modified"
                  type="text"
                />
              }
            />
          </Box>

        </Box>

      </SectionTitle>
    </ColumnWrapper>
  );
};

export default Contractor;
