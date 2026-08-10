'use client';
import React from 'react';

import { Box, TableCell, Tooltip } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDate, formatDateTime } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import { tableHeader } from './DetailPerikatanPembiayaan.constants';
import useDetailPerikatanPembiayaan from './DetailPerikatanPembiayaan.hooks';


const PerikatanPembiayaan = () => {

  const {
    control,
    theme,
    facilityListContents,
    pageSize,
    pageNo,
    setPageNo,
    setPageSize,
    contents,
    description,
    hasOther,
    commercialDescriptionList,
    totalOrder,
  } = useDetailPerikatanPembiayaan();

  const dataAsOf = contents?.[0]?.dataAsOf;

  return (
    <Box>
      <Title title="Perikatan Pembiayaan atau Akad" sx={{ mb: theme.spacing(3) }} />

      <SectionTitle title="Detail" sx={{ fontWeight: 700 }} isOpen>
        <Box
          sx={{
            alignItems: 'start',
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            mt: theme.spacing(3),
          }}
        >
          {/* --- KOLOM KIRI --- */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
            <Controller
              name="pkName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled
                  type="text"
                  label="Nama PK / Addendum"
                  value={field.value ? field.value.split('-')[0] : '-'}
                />
              )}
            />
            <Controller
              name="contractType"
              control={control}
              render={({ field }) => {
                field.value = field.value === 'ADD' ? 'Addendum' : field.value;
                return (
                  <Input {...field} disabled type="text" label="Tipe Perjanjian (PK/Addendum)" />
                );}
              }
            />
            <Controller
              name="pkDate"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled type="text" label="Tanggal PK/Addendum" value={field.value ? formatDate(field.value) : '-'} />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled type="text" label="Deskripsi" />
              )}
            />
            {description?.toUpperCase() === 'KOMERSIAL' ? (
              <Controller
                name="commercialDescription"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled
                    type="checkbox"
                    label="Keterangan Deskripsi"
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 12 },
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      mt: 0,
                    }}
                    checkboxList={commercialDescriptionList}
                    value={Array.isArray(field.value) ? field.value : []}
                  />
                )}
              />
            ) : (
              <Controller
                name="nonCommercialDescription"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled type="text" label="Keterangan Deskripsi" value={field.value ?? '-'} />
                )}
              />
            )}
            {hasOther && (
              <Controller
                name="otherCommercialDescription"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled type="text" label="Other Description" />
                )}
              />
            )}
          </Box>

          {/* --- KOLOM KANAN --- */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
            <Controller
              name="pkNo"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled type="text" label="No. PK / No. Addendum" />
              )}
            />
            <Controller
              name="sequence"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled type="text" label="Sequence" />
              )}
            />
            <Controller
              name="effectiveDate"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled type="text" label="Tanggal Efektif" value={field.value ? formatDate(field.value) : '-'} />
              )}
            />
            <Controller
              name="informationDesc"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled type="area" label="Keterangan" />
              )}
            />

          </Box>
        </Box>

        {/* Bagian Bawah: Field Y/N Dibuat Sejajar (Baris Baru) */}
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            mt: theme.spacing(3),
            pb: theme.spacing(2),
          }}
        >
          <Controller
            name="signingCondition"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled
                type="text"
                label="Ada Syarat Penandatanganan (Y/N)"
                value={field.value === true ? 'Ya' : field.value === false ? 'Tidak' : '-'}
              />
            )}
          />
          <Controller
            name="effectiveCondition"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled
                type="text"
                label="Ada Syarat Efektif (Y/N)"
                value={field.value === true ? 'Ya' : field.value === false ? 'Tidak' : '-'}
              />
            )}
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Detail Fasilitas" isOpen>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : { dataAsOf ? formatDateTime(dataAsOf) : '-' }
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={contents ?? []}
            renderAdditonalRow={() => (
              <>
                <TableCell colSpan={13}>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    Total
                  </TextStyle>
                </TableCell>
                <TableCell>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    {totalOrder}
                  </TextStyle>
                </TableCell>
              </>
            )}
          />
        </BaseContainer>
      </SectionTitle>

    </Box>
  );
};

export default PerikatanPembiayaan;
