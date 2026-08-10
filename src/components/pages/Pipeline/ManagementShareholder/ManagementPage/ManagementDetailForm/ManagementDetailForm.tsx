'use client';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';


import useManagementDetailForm from './ManagementDetailForm.hook';


const ManagementPage = () => {
  const theme = useTheme();
  const {
    cityDropdownList,
    control,
    districtDropdownList,
    handleSave,
    isDetailPage,
    provinceDropdownList,
    router,
    subDistrictDropdownList,
  } = useManagementDetailForm();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Management" />
      <ColumnWrapper sx={{ gap: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Manajemen"
                placeholder="Nama Manajemen"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="title"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Title"
                placeholder="Title"
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
                label="Gender"
                placeholder="Gender"
                type="text"
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
            name="pob"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Place of Birth"
                placeholder="Place of Birth"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="dob"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="DOB"
                placeholder="DOB"
                type="date"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="etnicOrigin"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Etnic Origin"
                placeholder="Etnic Origin"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="idType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="ID Type"
                placeholder="ID Type"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="idNo"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="ID No."
                placeholder="ID No."
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="identityExpiry"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Identity Expiry"
                placeholder="Identity Expiry"
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
            name="nationality"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nationality"
                placeholder=" Nationality"
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
                label="Address"
                placeholder="Address"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="country"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Negara"
                placeholder="Negara"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="province"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Lokasi (Provinsi)"
                placeholder="Lokasi (Provinsi)"
                type="dropdown"
                dropdownList={provinceDropdownList}
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="city"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Lokasi (Kota - Kabupaten)"
                placeholder="Lokasi (Kota - Kabupaten)"
                type="dropdown"
                dropdownList={cityDropdownList}
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
                label="Lokasi (Kecamatan)"
                placeholder="Lokasi (Kecamatan)"
                type="dropdown"
                dropdownList={districtDropdownList}
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
                label="Lokasi (Kelurahan)"
                placeholder="Lokasi (Kelurahan)"
                type="dropdown"
                dropdownList={subDistrictDropdownList}
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="postalCode"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Postal Code"
                placeholder="Postal Code"
                type="text"
                disabled={isDetailPage}
              />
            }
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Telepon"
                placeholder="Telepon"
                type="text"
                disabled={isDetailPage}
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
                placeholder="Status"
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
            name="collectabilityStatusPer"
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
            name="ktpFile"
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
            name="npwpFile"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Upload NPWP"
                placeholder="Upload NPWP"
                type="file"
                showPreviewFile
                disabled={isDetailPage}
              />
            }
          />
        </Box>

      </ColumnWrapper>
      <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        <Button variant="outlined" onClick={() => { router.back(); }}>
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

export default ManagementPage;
