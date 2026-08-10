import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useGeneralInformation from './GeneralInformation.hooks';


const GeneralInformation = () => {
  const theme = useTheme();
  const { control,
    dataSourceDropdownList,
    institutionTypeList,
    sectorDropdownList,
    provinceDropdownList,
    cityDropdownList,
  } = useGeneralInformation();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="General Information"></SectionTitle>

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
            name="generalInformation.customerId"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Customer ID"
                placeholder="Masukkan Customer ID"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.cif"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="CIF"
                placeholder="Masukkan CIF"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.dataSource"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={dataSourceDropdownList}
                label="Data Source"
                placeholder="Masukkan Data Source"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.institutionType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={institutionTypeList}
                label="Institution Type"
                placeholder="Masukkan Institution Type"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.debtorName"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Customer"
                placeholder="Masukkan Nama Customer"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.alias"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Alias"
                placeholder="Masukkan Alias"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.description"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Keterangan Customer"
                placeholder="Masukkan Keterangan Customer"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.newExistingClient"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={[
                  { label: 'New', value: 'New' },
                  { label: 'Existing', value: 'Existing' },
                ]}
                label="New/Existing Client"
                placeholder="Masukkan New/Existing Client"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.sectorInfrastructure"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={sectorDropdownList}
                label="Infrastructure Sector"
                placeholder="Masukkan Infrastructure Sector"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.defineSector"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={[]}
                label="Define Sector"
                placeholder="Masukkan Define Sector"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.debtorType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={[]}
                label="Customer Type"
                placeholder="Masukkan Customer Type"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.debtorCategory"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={[]}
                label="Customer Category"
                placeholder="Masukkan Customer Category"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.alamatKedudukan"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Alamat Kedudukan"
                placeholder="Masukkan Alamat Kedudukan"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.country"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={[]}
                label="Negara"
                placeholder="Masukkan Negara"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.province"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={provinceDropdownList}
                label="Lokasi (Provinsi)"
                placeholder="Masukkan Lokasi (Provinsi)"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.district"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={cityDropdownList}
                label="Lokasi (Kota - Kabupaten)"
                placeholder="Masukkan Lokasi (Kota - Kabupaten)"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.locationDistrict"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Lokasi (Kecamatan)"
                placeholder="Masukkan Lokasi (Kecamatan)"
                type="dropdown"
              />
            }
          />

          <Controller
            name="generalInformation.locationSubDistrict"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Lokasi (Kelurahan)"
                placeholder="Masukkan Lokasi (Kelurahan)"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.postalCode"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Postal Code"
                placeholder="Masukkan Postal Code"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.telephone"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Telepon"
                placeholder="Masukkan Telepon"
                type="number"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="generalInformation.officeSeluler"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Office - Seluler"
                placeholder="Masukkan Office - Seluler"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.email"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Alamat Email"
                placeholder="Masukkan Alamat Email"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.website"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Customer Website"
                placeholder="Masukkan Customer Website"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.contactPerson"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Contact Person"
                placeholder="Masukkan Contact Person"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.positionCp"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Jabatan Contact Person"
                placeholder="Masukkan Jabtan Contact Person"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.emailCp"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Email Contact Person"
                placeholder="Masukkan Email Contact Person"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.officeCp"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nomor Contact Person - Office"
                placeholder="Masukkan Nomor Contact Person - Office"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.status"
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
            name="generalInformation.lastModified"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Last Modified"
                placeholder="Masukkan Last Modified"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.modifiedBy"
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

        </Box>
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default GeneralInformation;
