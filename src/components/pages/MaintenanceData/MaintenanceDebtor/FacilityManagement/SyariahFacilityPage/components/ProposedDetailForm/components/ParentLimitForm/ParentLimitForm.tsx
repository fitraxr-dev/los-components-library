'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';


import { formatDate } from '@/helpers/date';
import useCustomRouter from '@/hooks/useCustomRouter';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


import { useParentLimitForm } from './ParentLimitForm.hook';

import type { ParentLimitFormProps } from './ParentLimitForm.constants';


const ParentLimitForm = ({
  isViewOnly = false,
  onSaveSuccess,
}: ParentLimitFormProps) => {
  const theme = useTheme();
  const router = useCustomRouter();

  const {
    parentLimitData,
    handleChange,
    handleSave,
    isDetail,
    isAutoSaveFetching,
    countryOptions,
    isLoadingCountry,
    sifatOptions,
    isLoadingSifat,
    useTypeOptions,
    isLoadingType,
    districtOptions,
    isLoadingDistrict,
    golonganOptions,
    isLoadingGolongan,
    orientasiOptions,
    isLoadingOrientasi,
    companyOptions,
    currencyOptions,
    handleCancel,
    isHidden,
    isSaveDisabled,
    canUpdateParentLimit,
    findDataDelta,
    intervalFrequencyOptions,
  } = useParentLimitForm({
    onSuccessCallback: () => {
      if (onSaveSuccess) {
        onSaveSuccess();
      } else {
        router.back();
      }
    },
  });

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <BaseContainer
          sx={{
            boxShadow: 2,
            maxWidth: '100%',
            mt: theme.spacing(3),
            padding: theme.spacing(2),
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Input
              type="text"
              label="Tracer ID"
              placeholder="Tracer ID"
              value={parentLimitData.tracerId.value}
              onChange={(value) => handleChange('tracerId', value)}
              containerSx={{ flex: 1 }}
              disabled
              hasDataMaster={findDataDelta('tracerIdNewLOS')}
            />

            <Input
              type="text"
              label="ID Limit"
              placeholder="ID Limit"
              value={parentLimitData.idLimit.value}
              onChange={(value) => handleChange('idLimit', value)}
              containerSx={{ flex: 1 }}
              disabled
              hasDataMaster={findDataDelta('limitId')}
            />

            <Input
              isMandatory
              type="text"
              label="ID Pipeline"
              placeholder="ID Pipeline"
              value={parentLimitData.idPipeline.value}
              onChange={(value) => handleChange('idPipeline', value)}
              containerSx={{ flex: 1 }}
              disabled
              error={parentLimitData.idPipeline.error}
              helperText={parentLimitData.idPipeline.error && parentLimitData.idPipeline.errorMessage}
              hasDataMaster={findDataDelta('pipelineId')}
            />
            <Autocomplete
              isMandatory
              label="Mata Uang"
              placeholder="Mata Uang"
              dropdownList={currencyOptions}
              value={parentLimitData.mataUang.value || null}
              onChange={(val) => handleChange('mataUang', val || '')}
              isLoading={false}
              disabled
              error={parentLimitData.mataUang.error}
              helperText={parentLimitData.mataUang.error && parentLimitData.mataUang.errorMessage}
              hasDataMaster={findDataDelta('currency', currencyOptions)}
            />

            <Input
              isMandatory
              disabled
              type="number"
              label="Nominal Fasilitas Limit"
              placeholder="Nominal Fasilitas Limit"
              value={String(parentLimitData.nominalFasilitasLimit.value)}
              onValueChange={(values) => handleChange('nominalFasilitasLimit', values?.floatValue || '')}
              containerSx={{ flex: 1 }}
              error={parentLimitData.nominalFasilitasLimit.error}
              helperText={
                parentLimitData.nominalFasilitasLimit.error &&
                parentLimitData.nominalFasilitasLimit.errorMessage
              }
              thousandSeparator=","
              decimalScale={2}
              hasDataMaster={findDataDelta('limitAmount')}
            />
            {parentLimitData.mataUang.value.value !== 'IDR' &&
              <Input
                isMandatory
                disabled
                type="number"
                label="Nominal Fasilitas Limit (dalam Rp)"
                placeholder="Nominal Fasilitas Limit (dalam Rp)"
                value={String(parentLimitData.nominalFasilitasLimitInIDR.value)}
                onValueChange={(values) => handleChange('nominalFasilitasLimitInIDR', values?.floatValue ?? 0)}
                containerSx={{ flex: 1 }}
                error={parentLimitData.nominalFasilitasLimitInIDR.error}
                helperText={
                  parentLimitData.nominalFasilitasLimitInIDR.error &&
                  parentLimitData.nominalFasilitasLimitInIDR.errorMessage
                }
                thousandSeparator=","
                decimalScale={2}
              />
            }
            <Input
              isMandatory
              type="date"
              label="Tanggal Berlaku"
              placeholder="Pilih Tanggal Berlaku"
              value={parentLimitData.tanggalBerlaku.value}
              onChange={(value) => handleChange('tanggalBerlaku', value ? value.toISOString() : '')}
              containerSx={{ flex: 1 }}
              disabled={isViewOnly || isDetail}
              error={parentLimitData.tanggalBerlaku.error}
              helperText={parentLimitData.tanggalBerlaku.error && parentLimitData.tanggalBerlaku.errorMessage}
              hasDataMaster={findDataDelta('effectiveDate')}
            />

            <Input
              isMandatory
              type="number"
              label="Maksimal Penggunaan"
              placeholder="Maksimal Penggunaan"
              value={String(parentLimitData.maksimalPenggunaan.value)}
              onValueChange={(values) => handleChange('maksimalPenggunaan', values?.floatValue || '')}
              containerSx={{ flex: 1 }}
              error={parentLimitData.maksimalPenggunaan.error}
              helperText={parentLimitData.maksimalPenggunaan.error && parentLimitData.maksimalPenggunaan.errorMessage}
              hasDataMaster={findDataDelta('maxUsage')}
              disabled={isViewOnly || isDetail}
            />
            <Input
              isMandatory
              type="date"
              label="Tanggal Input Limit"
              placeholder="Pilih Tanggal Input Limit"
              value={parentLimitData.tanggalInputLimit.value}
              onChange={(value) => handleChange('tanggalInputLimit', value ? value.toISOString() : '')}
              containerSx={{ flex: 1 }}
              disabled={isViewOnly || isDetail}
              error={parentLimitData.tanggalInputLimit.error}
              helperText={parentLimitData.tanggalInputLimit.error && parentLimitData.tanggalInputLimit.errorMessage}
              hasDataMaster={findDataDelta('limitInputDate')}
            />

            <Input
              isMandatory
              type="date"
              label="Tanggal Berakhir"
              placeholder="Pilih Tanggal Berakhir"
              value={parentLimitData.tanggalBerakhir.value}
              onChange={(value) => handleChange('tanggalBerakhir', value ? value.toISOString() : '')}
              containerSx={{ flex: 1 }}
              disabled={isViewOnly || isDetail}
              error={parentLimitData.tanggalBerakhir.error}
              helperText={parentLimitData.tanggalBerakhir.error && parentLimitData.tanggalBerakhir.errorMessage}
              hasDataMaster={findDataDelta('expiryDate')}
            />
            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={!(isViewOnly || isDetail) ? theme.palette.text.primary : theme.palette.disabled.main}
                >
                  Frekuensi Review
                </TextStyle>
              </RowWrapper>
              <RowWrapper gap={1}>
                <Box sx={{ flex: 1 }}>
                  <Autocomplete
                    placeholder="Interval"
                    dropdownList={intervalFrequencyOptions}
                    value={parentLimitData.intervalFrekuensiReview?.value || null}
                    onChange={(val) => handleChange('intervalFrekuensiReview', val)}
                    isLoading={false}
                    disabled={isViewOnly || isDetail}
                    hasDataMaster={findDataDelta('reviewFrequency')}
                  />
                </Box>
                {!!parentLimitData.intervalFrekuensiReview?.value?.value && (
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={parentLimitData.dateFrekuensiReview.value}
                    onChange={(value) => handleChange('dateFrekuensiReview', value ? formatDate(value, 'YYYYMMDD') : null)}
                    containerSx={{ flex: 1 }}
                    disabled={isViewOnly || isDetail}
                  />
                )}

                {
                  (parentLimitData.intervalFrekuensiReview?.value?.value === 'M' || parentLimitData.intervalFrekuensiReview?.value?.value === 'WEEK') && (
                    <Input
                      type="number"
                      placeholder="Frekuensi"
                      value={String(parentLimitData.frekuensiReview.value)}
                      onValueChange={(values) => handleChange('frekuensiReview', values?.floatValue)}
                      containerSx={{ flex: 1 }}
                      disabled={isViewOnly || isDetail}
                    />)
                }
                {parentLimitData.intervalFrekuensiReview?.value?.value === 'M' && (
                  <Autocomplete
                    placeholder="Tanggal"
                    dropdownList={(() => {
                      let list = [];
                      for (let i = 1; i <= 31; i++) {
                        list.push({ label: i.toString(), value: i.toString() });
                      }
                      return list;
                    })()}
                    value={parentLimitData.onlyDateFrekuensiReview.value || null}
                    onChange={(val) => handleChange('onlyDateFrekuensiReview', val)}
                    isLoading={false}
                    containerSx={{ flex: 1 }}
                    disabled={isViewOnly || isDetail}
                  />
                )}
              </RowWrapper>
            </Box>

            <Input
              type="number"
              label="CIF Kelompok"
              placeholder="CIF Kelompok"
              value={String(parentLimitData.cifKelompok.value)}
              onValueChange={(values) => handleChange('cifKelompok', values?.floatValue)}
              containerSx={{ flex: 1 }}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('groupCIF')}
            />
            <Input
              disabled
              type="number"
              label="Nilai Fasilitas Online"
              placeholder="Nilai Fasilitas Online"
              value={String(parentLimitData.nilaiFasilitasOnline.value)}
              onValueChange={(values) => handleChange('nilaiFasilitasOnline', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
              hasDataMaster={findDataDelta('onlineFacilityValue')}
            />

            <Input
              disabled
              type="number"
              label="Total Outstanding"
              placeholder="Total Outstanding"
              value={String(parentLimitData.totalOutstanding.value || 0)}
              onValueChange={(values) => handleChange('totalOutstanding', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
              hasDataMaster={findDataDelta('totalOutstanding')}
            />
            <Input
              disabled
              type="number"
              label="Nilai Kelonggaran Tarik"
              placeholder="Nilai Kelonggaran Tarik"
              value={String(parentLimitData.nilaiKelonggaranTarik.value)}
              onValueChange={(values) => handleChange('nilaiKelonggaranTarik', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
              hasDataMaster={findDataDelta('availableDrawdown')}
            />

            <Input
              type="area"
              label="Catatan"
              placeholder="Catatan"
              value={parentLimitData.catatan.value}
              onChange={(value) => handleChange('catatan', value)}
              containerSx={{ flex: 1 }}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('notesI')}
            />


            <Autocomplete
              label="Country Of Risk"
              placeholder="Country Of Risk"
              dropdownList={countryOptions}
              value={parentLimitData.countryOfRisk.value || null}
              onChange={(val) => handleChange('countryOfRisk', val || '')}
              isLoading={isLoadingCountry}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('countryOfRisk', countryOptions)}
            />

            <Input
              type="number"
              label="Country Percent"
              placeholder="Country Percent"
              value={parentLimitData.countryPercent.value ?? null}
              onValueChange={(values) => {
                const floatValue = values?.floatValue;
                if (floatValue !== undefined && floatValue > 100) {
                  handleChange('countryPercent', 100);
                } else {
                  handleChange('countryPercent', floatValue);
                }
              }}
              isAllowed={(values) => {
                const { value } = values;
                return value.length <= 3;
              }}
              containerSx={{ flex: 1 }}
              disabled
              error={parentLimitData.countryPercent.value > 100}
              helperText={parentLimitData.countryPercent.value > 100 ? 'Country Percent tidak boleh lebih dari 100' : ''}
              hasDataMaster={findDataDelta('countryPercent')}
            />
            <Input
              type="checkbox"
              label="Online Update"
              value={parentLimitData.onlineUpdate.value ? ['onlineUpdate'] : []}
              onChange={(newValue) => handleChange('onlineUpdate', newValue.includes('onlineUpdate'))}
              containerSx={{ flex: 1 }}
              checkboxList={[
                { label: '', value: 'onlineUpdate' },
              ]}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('onlineUpdateDate')}
            />

            <Autocomplete
              isMandatory
              label="Cabang Pembukaan"
              placeholder="Cabang Pembukaan"
              dropdownList={companyOptions}
              value={parentLimitData.cabangPembukaan.value || null}
              onChange={(val) => handleChange('cabangPembukaan', val || '')}
              isLoading={false}
              disabled={isViewOnly || isDetail}
              error={parentLimitData.cabangPembukaan.error}
              helperText={parentLimitData.cabangPembukaan.error && parentLimitData.cabangPembukaan.errorMessage}
              hasDataMaster={findDataDelta('limitBookingBranch', companyOptions)}
            />
            <Input
              type="text"
              label="Liability Number (Nomor CIF)"
              placeholder="Liability Number (Nomor CIF)"
              value={parentLimitData.liabilityNumber.value}
              onChange={(value) => handleChange('liabilityNumber', value)}
              containerSx={{ flex: 1 }}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('liabilityNumber')}
            />

            <Input
              type="text"
              label="Keterangan BMPK"
              placeholder="Keterangan BMPK"
              value={parentLimitData.keteranganBMPK.value}
              onChange={(value) => handleChange('keteranganBMPK', value)}
              containerSx={{ flex: 1 }}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('bmppDescription')}
            />
            <Input
              type="number"
              label="Sebelum Restrukturisasi - Plafon"
              placeholder="Sebelum Restrukturisasi - Plafon"
              value={String(parentLimitData.sebelumRestrukturisasi.value)}
              onValueChange={(values) => handleChange('sebelumRestrukturisasi', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('preRestructuringPlafond')}
            />

            <Autocomplete
              label="Dati II Lokasi Proyek"
              placeholder="Dati II Lokasi Proyek"
              dropdownList={districtOptions}
              value={parentLimitData.datiLokasiProyek.value || null}
              onChange={(val) => handleChange('datiLokasiProyek', val || '')}
              isLoading={isLoadingDistrict}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('datiIILokasiProyek', districtOptions)}
            />
            <Input
              type="radio"
              label="Baru Perpanjang"
              value={parentLimitData.baruPerpanjang.value ? 'true' : 'false'}
              onChange={(e: any) => handleChange('baruPerpanjang', e.target.value === 'true')}
              containerSx={{ flex: 1 }}
              disabled={isViewOnly || isDetail}
              radioList={[
                { label: 'Ya', value: 'true' },
                { label: 'Tidak', value: 'false' },
              ]}
              position="horizontal"
              hasDataMaster={findDataDelta('newExtend')}
            />

            <Autocomplete
              label="Golongan Kredit"
              placeholder="Golongan Kredit"
              dropdownList={golonganOptions}
              value={parentLimitData.golonganKredit.value || null}
              onChange={(val) => handleChange('golonganKredit', val || '')}
              isLoading={isLoadingGolongan}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('creditClassification', golonganOptions)}
            />
            <Autocomplete
              label="Jenis Penggunaan"
              placeholder="Jenis Penggunaan"
              dropdownList={useTypeOptions}
              value={parentLimitData.jenisPenggunaan.value || null}
              onChange={(val) => handleChange('jenisPenggunaan', val || '')}
              isLoading={isLoadingType}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('usageType', useTypeOptions)}
            />

            <Autocomplete
              label="Orientasi Penggunaan"
              placeholder="Orientasi Penggunaan"
              dropdownList={orientasiOptions}
              value={parentLimitData.orientasiPenggunaan.value || null}
              onChange={(val) => handleChange('orientasiPenggunaan', val || '')}
              isLoading={isLoadingOrientasi}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('usageOrientation', orientasiOptions)}
            />
            <Autocomplete
              label="Sifat Piutang"
              placeholder="Sifat Piutang"
              dropdownList={sifatOptions}
              value={parentLimitData.sifatPiutang.value || null}
              onChange={(val) => handleChange('sifatPiutang', val || '')}
              isLoading={isLoadingSifat}
              disabled={isViewOnly || isDetail}
              hasDataMaster={findDataDelta('receivableNature', sifatOptions)}
            />

            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Input
                type="checkbox"
                value={parentLimitData.penandaBMPK.value ? ['penandaBMPK'] : []}
                onChange={(newValue) => handleChange('penandaBMPK', newValue.includes('penandaBMPK'))}
                containerSx={{ flex: 1 }}
                checkboxList={[
                  { label: 'Penanda BMPK', value: 'penandaBMPK' },
                ]}
                disabled={isViewOnly || isDetail}
                hasDataMaster={findDataDelta('bmpkMarker', [{ label: 'Ya', value: 'Y' }, { label: 'Tidak', value: 'N' }])}
              />
              <Input
                type="checkbox"
                value={parentLimitData.availableMarker.value ? ['availableMarker'] : []}
                onChange={(newValue) => handleChange('availableMarker', newValue.includes('availableMarker'))}
                containerSx={{ flex: 1 }}
                checkboxList={[
                  { label: 'Available Marker', value: 'availableMarker' },
                ]}
                disabled={isViewOnly || isDetail}
                hasDataMaster={findDataDelta('availableMarker', [{ label: 'Ya', value: 'Y' }, { label: 'Tidak', value: 'N' }])}
              />
            </Box>
          </Box>
        </BaseContainer>
      </ColumnWrapper>
      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>
          {(isHidden || isDetail) ? 'Close' : 'Cancel'}
        </Button>
        {(!isViewOnly && !isHidden) && (
          <>
            {!isDetail &&
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSave(false)}
                sx={{ mr: 2 }}
                disabled={isAutoSaveFetching || isSaveDisabled}
              >
                {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
              </Button>
            }
          </>
        )}
      </RowWrapper>
    </>
  );
};

export default ParentLimitForm;
