'use client';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import useShareHolderDetailForm from './ShareHolderDetailForm.hook';


const ShareHolderDetailForm = () => {
  const theme = useTheme();
  const {
    control,
    isDetailPage,
    router,
    handleSave,
    pageBreadCrumb,
  } = useShareHolderDetailForm();

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
            name="level"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Level"
                placeholder="Level"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="shareholderType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Tipe Shareholder"
                placeholder="Tipe Shareholder"
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
            name="shares"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Lembar Saham"
                placeholder="Lembar Saham"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="shareValue"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nilai Perlembar"
                placeholder="Nilai Perlembar"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="percentage"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Persentase"
                placeholder="Persentase"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="currency"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Currency"
                placeholder="Currency"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="nominal"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nominal"
                placeholder="Nominal"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="businessEntityOwner"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Pemilik Badan Usaha"
                placeholder="Pemilil Badan Usaha"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Jenis Kelamin"
                placeholder="Jenis Kelamin"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="businessEntityOwnerRadio"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Pemilik Badan Usaha"
                placeholder="Pemilik Badan Usaha"
                type="radio"
                radioList={[
                  { label: 'Ya', value: 'yes' },
                  { label: 'Tidak', value: 'no' }
                ]}
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="village"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Kelurahan"
                placeholder="Kelurahan"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Alamat"
                placeholder="Alamat"
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
            name="district"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Kecamatan"
                placeholder="Kecamatan"
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
            name="ktpUpload"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Upload KTP"
                placeholder="Upload KTP"
                type="file"
                disabled={isDetailPage}
                showPreviewFile
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
                showPreviewFile
              />
            }
          />

          <Controller
            name="deedofIncorporationUpload"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Upload Akta Pendirian"
                placeholder="Upload Akta Pendirian"
                type="file"
                disabled={isDetailPage}
                showPreviewFile
              />
            }
          />

          <Controller
            name="applicationLetterUpload"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Upload Surat Permohonan"
                placeholder="Upload Surat Permohonan"
                type="file"
                disabled={isDetailPage}
                showPreviewFile
              />
            }
          />

          <Controller
            name="latestManagementDocumentUpload"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Upload Dokumen Pengurus Terakhir"
                placeholder="Upload Dokumen Pengurus Terakhir"
                type="file"
                disabled={isDetailPage}
                showPreviewFile
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
