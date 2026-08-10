'use client';
import React from 'react';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';
import VStack from '@/components/shared/VStack';

import { RADIO_LIST, TABLE_DATA } from './AddendumData.constants';
import useAddendumData from './AddendumData.hooks';


const AddendumData = () => {
  const { TABLE_HEADER, getValues, setValue, watch } = useAddendumData();

  const { description } = getValues();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="PK / Adendum Data" />

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr 1fr' }}>
          <Input label="Nama PK" placeholder="Nama PK" onChange={(val) => setValue('name', val)} />
          <Input label="No PK / No Adendum" placeholder="No PK / No Adendum" onChange={(val) => setValue('noAddendum', val)} />
          <Input label="Tanggal Efektif" placeholder="Tanggal Efektif" type="date" onChange={(val) => setValue('effectiveDate', val)} />
          <Input label="Tanggal PK / Tanggal Adendum" placeholder="Tanggal PK / Tanggal Adendum" type="date" onChange={(val) => setValue('date', val)} />

          <VStack>
            <Input
              label="Deskripsi"
              placeholder="Pilih deskripsi"
              type="dropdown"
              dropdownList={[]}
              value={watch('description')}
              onChange={(val) => setValue('description', val)}
            />

            <VStack top="10px">
              {description?.value === 'NON_KOMERSIAL' && (
                <Input
                  label="Non Komersial"
                  placeholder="Non Komersial"
                  type="text"
                  value={watch('nonCommercialDescription')}
                  onChange={(val) => setValue('nonCommercialDescription', val)}
                />
              )}
            </VStack>

            {description === 'KOMERSIAL' && (
              <Input
                sx={{
                  '& .MuiSvgIcon-root': { fontSize: 12 },
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  mt: 2,
                }}
                type="checkbox"
                size="small"
                checkboxList={[{ label: 'Komersial', value: 'KOMERSIAL' }, { label: 'Non Komersial', value: 'NON_KOMERSIAL' }]}
                value={watch('commercialDescription')}
                onChange={(val) => setValue('commercialDescription', val)}
              />
            )}
          </VStack>

          <Input label="Keterangan Deskripsi" type="area" rows={4} placeholder="Keterangan Deskripsi" />
          <Input label="Non Komersial" placeholder="Non Komersial" />
        </Box>

        <ColumnWrapper>
          <Input label="Syarat Penandatanganan" type="radio" radioList={RADIO_LIST} />
          <BaseContainer>
            <Table tableData={TABLE_DATA} tableHeader={TABLE_HEADER} />
          </BaseContainer>
        </ColumnWrapper>

        <ColumnWrapper>
          <Input label="Syarat Efektif" type="radio" radioList={RADIO_LIST} />
          <BaseContainer>
            <Table tableData={TABLE_DATA} tableHeader={TABLE_HEADER} />
          </BaseContainer>
        </ColumnWrapper>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <Input label="Status Proses Legal" placeholder="Status Proses Legal" />
        </Box>
      </ColumnWrapper>

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button>Next</Button>
      </RowWrapper>
    </>
  );
};

export default AddendumData;
