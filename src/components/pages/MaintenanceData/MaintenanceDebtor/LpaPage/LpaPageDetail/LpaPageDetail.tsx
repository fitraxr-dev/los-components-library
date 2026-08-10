'use client';
import React, { useState } from 'react';

import { Box, TableCell, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDate, formatDateTime } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { TableHeaderObjectAssessment } from './LpaPageDetail.constant';
import useLpaPageDetail from './LpaPageDetail.hooks';

import './DetailAgunan';


const LpaPageDetail = () => {
  const theme = useTheme();
  const {
    control,
    HeaderAgunan,
    HeaderRekonsiliasi,
    watch,
    totalApproachValueData,
    getCollateralData,
    totalMaxReconciliationInput,
    reconciliationCalculated,
    container,
    setContainer,
    approachMethodology,
  } = useLpaPageDetail();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="LPA" />

      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >

        <Controller
          disabled
          name="kjpp"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="KJPP"
              placeholder="[KJPP]"
              type="text"
            />
          }
        />

        <Controller
          disabled
          name="reportNo"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Nomor Laporan"
              placeholder="[Nomor Laporan]"
              type="text"
            />
          }
        />

        <Controller
          disabled
          name="reportDate"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              value={field.value ? formatDate(field.value) : ''}
              label="Tanggal Laporan"
              placeholder="[Tanggal Laporan]"
            />
          }
        />

        <Controller
          disabled
          name="assessmentDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ? formatDate(field.value) : ''}
              disabled
              label="Tanggal Penilaian"
              placeholder="[Tanggal Penilaian]"
            />
          )
          }
        />

        <Controller
          disabled
          name="siteVisitDate"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              value={field.value ? formatDate(field.value) : ''}
              disabled
              label="Tanggal Inspeksi (Site Visit)"
              placeholder="[Tanggal Inspeksi (Site Visit)]"
            />
          }
        />

        <Controller
          disabled
          name="assessmentPurpose"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Tujuan Penilaian"
              placeholder="[Tujuan Penilaian]"
              type="text"
            />
          }
        />
      </Box>


      <ColumnWrapper
        sx={{
          alignItems: 'center',
          backgroundColor: theme.palette.custom.blueGray,
          borderRadius: theme.spacing(2),
          padding: theme.spacing(2),
        }}
      >
        <TextStyle
          variant="body4"
          weight={500}
          color={theme.palette.primary.main}
        >
          Pendekatan yang digunakan
        </TextStyle>
        <Input
          type="checkbox"
          checkboxList={[
            { label: 'Pendekatan Pendapatan', value: 'PENDEKATAN_PENDAPATAN' },
            { label: 'Pendekatan Biaya', value: 'PENDEKATAN_BIAYA' },
            { label: 'Pendekatan Pasar', value: 'PENDEKATAN_PASAR' },
          ]}
          inputSx={{ color: theme.palette.primary.main, fontWeight: 500 }}
          value={approachMethodology}
          // onChange={(data) => handleCheckApproachMethodology(data)}
          disabled={true}
        />
      </ColumnWrapper>

      <Controller
        disabled
        name="reconciliation"
        control={control}
        render={({ field }) =>
          <Input
            {...field}
            label="Rekonsiliasi"
            placeholder="[Metode Reconciliasi]"
            type="radio"
            radioList={[
              { label: 'Ya', value: true },
              { label: 'Tidak', value: false }
            ]}
            onChange={(data) => console.log(data)}
            inputSx={{ color: theme.palette.primary.main, fontWeight: 500 }}
          />
        }
      />

      <Controller
        disabled
        name="remarkReconciliation"
        control={control}
        render={({ field }) =>
          <Input
            {...field}
            label="Keterangan"
            placeholder="[Keterangan]"
            type="area"
            rows={4}
            onChange={(data) => console.log(data)}
          />
        }
      />

      <Box sx={{ backgroundColor: '#F0F3FB', borderRadius: theme.spacing(2), justifyItems: 'center', my: theme.spacing(2), padding: theme.spacing(2), py: theme.spacing(2), textAlign: 'center' }}>
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.primary.main}
        >
          Termasuk Daftar KJPP Rekanan SMI?
        </TextStyle>
        <Controller
          disabled
          name="isIncludedInKjppPartner"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              type="radio"
              radioList={[
                { label: 'Ya', value: true },
                { label: 'Tidak', value: false },
              ]}
              onChange={(data) => console.log(data)}
            />
          }
        />
      </Box>

      <Controller
        disabled
        name="remarkIncludedInKjppPartner"
        control={control}
        render={({ field }) =>
          <Input
            {...field}
            label="Keterangan"
            placeholder="[Keterangan]"
            type="area"
            rows={4}
            onChange={(data) => console.log(data)}
          />
        }
      />

      {/* </BaseContainer> */}

      <SectionTitle title="Detail Agunan" isOpen>
        <Table
          tableData={getCollateralData?.contents ?? []}
          tableHeader={HeaderAgunan}
        />
      </SectionTitle>

      <SectionTitle title="Summary Nilai Agunan" isOpen>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            mt: theme.spacing(3),
          }}
        >
          <Controller
            disabled
            name="summaryMarketValue"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Total Nilai Pasar"
                placeholder="[Total Nilai Pasar]"
                type="text"
              />
            }
          />
          <Controller
            disabled
            name="summaryLiquidation"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Total Indikasi Nilai Likuidasi"
                placeholder="[Total Indikasi Nilai Likuidasi]"
                type="text"
              />
            }
          />
          <Controller
            disabled
            name="roundedMarketValue"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Total Nilai Pasar Pembulatan"
                placeholder="[Total Nilai Pasar Pembulat]"
                type="text"
              />
            }
          />
          <Controller
            disabled
            name="roundedLiquidation"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Total Indikasi Nilai Likuidasi Pembulat"
                placeholder="[Total Indikasi Nilai Likuidasi Pembulat]"
                type="text"
              />
            }
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Total Nilai dari Objek Penilaian" isOpen>
        <Table
          tableData={totalApproachValueData}
          tableHeader={TableHeaderObjectAssessment}
        />
      </SectionTitle>

      <SectionTitle title="Rekonsiliasi Pendekatan Pendapatan, Biaya, dan Pasar" isOpen>
        <Table
          tableData={totalApproachValueData}
          tableHeader={HeaderRekonsiliasi}
          renderAdditonalRow={() => (
            <>
              <TableCell colSpan={2}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.main}
                >
                  Total Nilai Rekonsiliasi Pendapatan, Biaya dan Pasar
                </TextStyle>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.error.main}
                >
                  {totalMaxReconciliationInput > 100 ? 'Total Bobot melebihi dari 100 persen' : null}
                </TextStyle>
              </TableCell>
              <TableCell>
                <RowWrapper justifyContent="space-between">
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    Total Nilai Pasar
                  </TextStyle>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    {formatCurrency(Object.keys(reconciliationCalculated).reduce(
                      (total, key) => (total + reconciliationCalculated[key].marketValue), 0
                    ).toFixed(2)) ?? null}
                  </TextStyle>
                </RowWrapper>
              </TableCell>
              <TableCell>
                <RowWrapper justifyContent="space-between">
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    Total Indikasi Nilai Likuidasi
                  </TextStyle>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    {formatCurrency(Object.keys(reconciliationCalculated).reduce(
                      (total, key) => (total + reconciliationCalculated[key].liquidationValue), 0
                    ).toFixed(2)) ?? null}
                  </TextStyle>
                </RowWrapper>
              </TableCell>
            </>
          )}
        />
      </SectionTitle>

      <TextStyle variant="body4" weight={600} color={theme.palette.primary.main}>
        Informasi Pendekatan Yang Digunakan
      </TextStyle>
      <WordEditor
        container={container}
        setContainer={setContainer}
        initialValue={watch('approachInformation')}
        isReadOnly={true}
      />
    </ColumnWrapper>
  );
};

export default LpaPageDetail;
