'use client';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import useOtherRelatedDetailForm from './OtherRelatedDetailForm.hook';


const ShareHolderDetailForm = () => {
  const theme = useTheme();
  const {
    control,
    isDetailPage,
    router,
    handleSave,
    pageBreadCrumb,
  } = useOtherRelatedDetailForm();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title={pageBreadCrumb.label} />
      <ColumnWrapper sx={{ gap: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            name="type"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Tipe"
                placeholder="Tipe"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nama"
                placeholder="Nama"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="npwp"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="NPWP"
                placeholder="NPWP"
                type="text"
                maxLength={16}
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="position"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Jabatan"
                placeholder="Jabatan"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="nik"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="NIK"
                placeholder="NIK"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="collectability"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Collectability"
                placeholder="Collectability"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="statusCollectabilityPer"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Status Collectability per"
                placeholder="Status Collectability per"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="lastModified"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Last Modified"
                placeholder="Last Modified"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="modifiedBy"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Modified By"
                placeholder="Modified By"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="ktpUpload"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Upload KTP"
                placeholder="Upload KTP"
                type="file"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="npwpUpload"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Upload NPWP"
                placeholder="Upload NPWP"
                type="file"
                disabled={isDetailPage}
              />
            }
          />
        </Box>

      </ColumnWrapper>
      <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        <Button variant="outlined" onClick={() => {router.back();}}>
          Close
        </Button>
        {!isDetailPage &&
          <Button onClick={handleSave}>
            Save
          </Button>
        }
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ShareHolderDetailForm;
