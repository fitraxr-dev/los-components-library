import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import useProjectOwner from './ProjectOwner.hooks';


const ProjectOwner = () => {
  const theme = useTheme();
  const { control } = useProjectOwner();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Project Owner" isOpen>
        <Box paddingY={theme.spacing(3)} gap={theme.spacing(3)} display="flex" flexDirection="column">
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >

            <Controller
              name="owner.name"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Pemilik Proyek"
                  placeholder="Pemilik Proyek"
                  type="text"
                />
              }
            />


            <Controller
              name="owner.contactName"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Nama Kontak Pemiliki Proyek"
                  placeholder="Nama Kontak Pemiliki Proyek"
                  type="text"
                />
              }
            />
          </Box>

          <Controller
            name="owner.address"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Alamat Kantor Pemilik Proyek"
                placeholder="Alamat Kantor Pemilik Proyek"
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
              name="owner.website"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Website Pemilik Proyek"
                  placeholder="Website Pemilik Proyek"
                  type="text"
                />
              }
            />

            <Controller
              name="owner.email"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Email Kontak Pemiliki Proyek"
                  placeholder="Email Kontak Pemiliki Proyek"
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
                  name="owner.phone.phoneCode"
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
                  name="owner.phone.phoneNumber"
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
                  name="owner.phone.phoneExt"
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
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Controller
              name="owner.modifiedDate"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Last Modified"
                  placeholder="Last Modified"
                  type="text"
                />
              }
            />

            <Controller
              name="owner.modifiedBy"
              control={control}
              disabled
              render={({ field }) =>
                <Input
                  {...field}
                  label="Modified By"
                  placeholder="Modified By"
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

export default ProjectOwner;
