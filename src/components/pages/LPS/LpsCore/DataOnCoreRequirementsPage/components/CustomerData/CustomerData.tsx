import React from 'react';

import { Box, useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';


const CustomerData = () => {
  const theme = useTheme();
  const { setValue, watch } = useFormContext();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Customer Information" isOpen>
        <BaseContainer
          sx={{
            display: 'grid',
            gap: theme.spacing(2),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Input
            label="CIF"
            value={watch('cif')}
            placeholder="CIF"
            onChange={(value) => setValue('cif', value)}
            disabled
          />
          <Input
            label="Nama Customer"
            value={watch('debtorName')}
            onChange={(value) => setValue('debtorName', value)}
            placeholder="Nama Customer"
            isMandatory
            disabled
          />
          <Input
            label="Alias"
            value={watch('aliasName')}
            onChange={(value) => setValue('aliasName', value)}
            placeholder="Nama Alias"
            disabled
          />
          <Input
            label="Detail Hubungan Dengan PT SMI"
            value={watch('relation')}
            onChange={(value) => setValue('relation', value)}
            placeholder="Detail Hubungan Dengan PT SMI"
            isMandatory
            disabled
          />
          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.disabled.main}
              >
                Customer Category
              </TextStyle>
            </RowWrapper>
            <Box display="flex" gap={theme.spacing(2)}>
              <Input
                label=""
                value={watch('debtorTypeLabel')}
                onChange={(value) => setValue('debtorTypeLabel', value)}
                placeholder="Kategori Customer"
                disabled
                containerSx={{ flex: 1 }}
              />
              <Input
                label=""
                value={watch('debtorPurposeLabel')}
                onChange={(value) => setValue('debtorPurposeLabel', value)}
                placeholder="Bentuk dan Tujuan"
                containerSx={{ flex: 1 }}
                disabled
              />
            </Box>
          </Box>
          <Input
            label="Jenis Sektor Usaha"
            value={watch('businessCategory')}
            onChange={(value) => setValue('businessCategory', value)}
            placeholder="Jenis Sektor Usaha"
            isMandatory
            disabled
          />
          <Input
            label="Contact Person"
            value={watch('contactPerson')}
            onChange={(value) => setValue('contactPerson', value)}
            placeholder="Contact Person"
            isMandatory
            disabled
          />
          <Input
            label="Jabatan Contact Person"
            value={watch('positionContactPerson')}
            onChange={(value) => setValue('positionContactPerson', value)}
            placeholder="Jabatan Contact Person"
            isMandatory
            disabled
          />
          <Input
            label="Infrastructure Sector"
            value={watch('infrastructureSector')}
            onChange={(value) => setValue('infrastructureSector', value)}
            placeholder="Infrastructure Sector"
            isMandatory
            disabled
          />
          <Input
            label="Kode Cabang"
            value={watch('branchCode')}
            onChange={(value) => setValue('branchCode', value)}
            placeholder="Kode Cabang"
            isMandatory
            disabled
          />
        </BaseContainer>
      </SectionTitle>

      <SectionTitle title="Customer Address" isOpen>
        <BaseContainer>
          <Box py={theme.spacing(3)}>
            <Input
              type="area"
              label="Alamat Kedudukan"
              value={watch('address')}
              minRows={4}
              onChange={(value) => setValue('address', value)}
              placeholder="Alamat Kedudukan"
              isMandatory
              disabled
            />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Input
              label="Negara"
              value={watch('country')}
              onChange={(value) => setValue('country', value)}
              placeholder="Negara"
              isMandatory
              disabled
            />
            <Input
              label="Lokasi (Provinsi)"
              value={watch('province')}
              onChange={(value) => setValue('province', value)}
              placeholder="Lokasi (Provinsi)"
              isMandatory
              disabled
            />
            <Input
              label="Lokasi (Kota - Kabupaten)"
              value={watch('city')}
              onChange={(value) => setValue('city', value)}
              placeholder="Lokasi (Kota - Kabupaten)"
              isMandatory
              disabled
            />
            <Input
              label="Lokasi (Kecamatan)"
              value={watch('district')}
              onChange={(value) => setValue('district', value)}
              placeholder="Lokasi (Kecamatan)"
              isMandatory
              disabled
            />
            <Input
              label="Lokasi (Kelurahan)"
              value={watch('subDistrict')}
              onChange={(value) => setValue('subDistrict', value)}
              placeholder="Lokasi (Kelurahan)"
              isMandatory
              disabled
            />
            <Input
              label="Postal Code"
              value={watch('postalCode')}
              onChange={(value) => setValue('postalCode', value)}
              placeholder="Postal Code"
              isMandatory
              disabled
            />
            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.disabled.main}
                >
                  Telepon
                  <span style={{ color: 'red' }}>*</span>
                </TextStyle>
              </RowWrapper>
              <Box display="flex" gap={theme.spacing(2)}>
                <Input
                  label=""
                  value={watch('telephone.areaCode')}
                  onChange={(value) => setValue('telephone.areaCode', value)}
                  placeholder="Kode"
                  disabled
                />
                <Input
                  label=""
                  value={watch('telephone.number')}
                  onChange={(value) => setValue('telephone.number', value)}
                  placeholder="Nomor Telepon"
                  containerSx={{
                    width: '80%',
                  }}
                  disabled
                />
                <Input
                  label=""
                  value={watch('telephone.ext')}
                  onChange={(value) => setValue('telephone.ext', value)}
                  placeholder="Ext"
                  disabled
                />
              </Box>
            </Box>
            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.disabled.main}
                >
                  Office - Seluler
                </TextStyle>
              </RowWrapper>
              <Box display="flex" gap={theme.spacing(2)}>
                <Input
                  label=""
                  value={watch('officeCellular.areaCode')}
                  onChange={(value) => setValue('officeCellular.areaCode', value)}
                  placeholder="Kode"
                  containerSx={{
                    width: '70%',
                  }}
                  disabled
                />
                <Input
                  label=""
                  value={watch('officeCellular.number')}
                  onChange={(value) => setValue('officeCellular.number', value)}
                  placeholder="Office - Seluler"
                  containerSx={{
                    width: '100%',
                  }}
                  disabled
                />
              </Box>
            </Box>
          </Box>
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default CustomerData;
