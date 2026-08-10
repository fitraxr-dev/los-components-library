import React from 'react';

import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';


const TemenosData = () => {
  const { setValue, watch } = useFormContext();

  return (
    <ColumnWrapper sx={{ gap: 2 }}>
      <SectionTitle title="Temenos Data" isOpen>
        <BaseContainer>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <Input
              label="Id Legacy"
              value={watch('idLegacy')}
              onChange={(value) => setValue('idLegacy', value)}
              placeholder="Input Id Legacy"
            />
            <Input
              label="Kelompok Nasabah"
              value={watch('customerGroup')}
              onChange={(value) => setValue('customerGroup', value)}
              placeholder="Input Kelompok Nasabah"
            />
            <Input
              label="Kode Kontrak"
              value={watch('contractCode')}
              onChange={(value) => setValue('contractCode', value)}
              placeholder="Input Kode Kontrak"
            />
            <Input
              label="No Registrasi"
              value={watch('registrationNumber')}
              onChange={(value) => setValue('registrationNumber', value)}
              placeholder="Input No Registrasi"
            />
            <Input
              label="Peran Nasabah"
              value={watch('customerRole')}
              onChange={(value) => setValue('customerRole', value)}
              placeholder="Input Peran Nasabah"
            />
            <Input
              label="Bank Tujuan"
              value={watch('destinationBank')}
              onChange={(value) => setValue('destinationBank', value)}
              placeholder="Input Bank Tujuan"
            />
            <Input
              label="Nama Perusahaan"
              value={watch('companyName')}
              onChange={(value) => setValue('companyName', value)}
              placeholder="Input Nama Perusahaan"
            />
            <Input
              label="No Rekening Tujuan"
              value={watch('destinationAccountNumber')}
              onChange={(value) => setValue('destinationAccountNumber', value)}
              placeholder="Input No Rekening Tujuan"
            />
            <Input
              label="Status"
              value={watch('status')}
              onChange={(value) => setValue('status', value)}
              placeholder="Input Status"
            />
            <Input
              label="Nama Pemilik Rekening Tujuan"
              value={watch('destinationAccountOwner')}
              onChange={(value) => setValue('destinationAccountOwner', value)}
              placeholder="Input Nama Pemilik Rekening Tujuan"
            />
            <Input
              label="Kategori"
              value={watch('category')}
              onChange={(value) => setValue('category', value)}
            />
            <Input
              label="Mata Uang"
              value={watch('currency')}
              onChange={(value) => setValue('currency', value)}
            />
            <Input

              label="Market"
              type="radio"
              radioList={[
                { label: 'Ya', value: 'yes' },
                { label: 'Tidak', value: 'no' }
              ]}
              value={watch('market')}
              onChange={(e) => setValue('market', e.target.value)}
            />
            <Input
              label="Sektor Ekonomi"
              value={watch('economicSector')}
              onChange={(value) => setValue('economicSector', value)}
              placeholder="Input Sektor Ekonomi"
            />
          </Box>
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default TemenosData;
