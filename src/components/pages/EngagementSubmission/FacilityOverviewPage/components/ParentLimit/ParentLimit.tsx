'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import Modules from '@/enums/Modules';
import { formatDate } from '@/helpers/date';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import { useParentLimit } from './ParentLimit.hook';


interface ParentLimitProps {
  facilityId?: string | null;
  recordId?: string | null;
  financingFacilityId?: string | null;
  onNextTab?: () => void;
}

const ParentLimit = ({
  facilityId,
  recordId,
  financingFacilityId,
  onNextTab,
}: ParentLimitProps) => {
  const theme = useTheme();
  const router = useCustomRouter();

  const {
    parentLimitData,
    handleChange,
    handleSave,
    isAutoSaveFetching,
    isSaving,
    isLoadingParentLimit,
    viewOnly,
    parentTypeOptions,
    idLimitIndukOptions,
    isFromLimitInduk,
    isMandatory,
    isDetail,
    intervalFrequencyOptions,
  } = useParentLimit({
    facilityId,
    financingFacilityId,
    onSuccessCallback: () => {
      if (onNextTab) {
        onNextTab();
      } else {
        router.back();
      }
    },
    recordId,
  });

  const isDisabled = viewOnly || isDetail;

  const { data: countryOptions = [], isLoading: isLoadingCountry } = useGetParameterList(Modules.COUNTRY);
  const { data: sifatOptions = [], isLoading: isLoadingSifat } = useGetParameterList(Modules.LOAN_TYPE);
  const { data: useTypeOptions = [], isLoading: isLoadingType } = useGetParameterList(Modules.TYPE_OF_USE);
  const { data: districtOptions = [], isLoading: isLoadingDistrict } = useGetParameterList(Modules.DISTRICT);
  const { data: golonganOptions = [], isLoading: isLoadingGolongan } = useGetParameterList(
    Modules.GOLONGAN_KREDIT
  );
  const { data: orientasiOptions = [], isLoading: isLoadingOrientasi } = useGetParameterList(
    Modules.ORIENTASI_PENGGUNAAN
  );
  const companyOptions = [
    { label: 'Head Office', value: 'ID0010001' },
    { label: 'Head Office - SMI', value: 'ID0010002' },
  ];
  const currencyOptions = [
    { label: 'IDR', value: 'IDR' },
    { label: 'USD', value: 'USD' },
  ];

  const handleCancel = () => {
    router.back();
  };

  const handleNext = () => {
    handleSave();
  };

  return (
    <>
      <ColumnWrapper sx={{ gap: { sm: 3, xs: 2 }, mt: { sm: 3, xs: 2 } }}>
        <Title title="Parent Limit" />
        <BaseContainer
          sx={{
            boxShadow: 2,
            maxWidth: '100%',
            mt: theme.spacing(3),
            padding: { sm: theme.spacing(2), xs: theme.spacing(1) },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: {
                sm: 'repeat(2, 1fr)',
                xs: '1fr',
              },
            }}
          >
            {!isFromLimitInduk && (
              <>
                <Autocomplete
                  isMandatory
                  label="Parent Limit Type"
                  placeholder="Parent Limit Type"
                  dropdownList={parentTypeOptions}
                  value={parentLimitData.parentType.value || null}
                  onChange={(val) => handleChange('parentType', val)}
                  isLoading={false}
                  disabled={isDisabled}
                  error={parentLimitData.parentType.error}
                  helperText={parentLimitData.parentType.error && parentLimitData.parentType.errorMessage}
                />
                {parentLimitData.parentType.value?.value === 'EXISTING' && (
                  <Autocomplete
                    isMandatory
                    label="ID Limit Induk"
                    placeholder="ID Limit Induk"
                    dropdownList={idLimitIndukOptions}
                    value={parentLimitData.idLimitInduk.value || null}
                    onChange={(val) => handleChange('idLimitInduk', val)}
                    isLoading={isLoadingParentLimit}
                    disabled={isDisabled || isLoadingParentLimit}
                    error={parentLimitData.idLimitInduk.error}
                    helperText={parentLimitData.idLimitInduk.error && parentLimitData.idLimitInduk.errorMessage}
                  />
                )}
              </>
            )}
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
            />
            <Autocomplete
              isMandatory
              label="Mata Uang"
              placeholder="Mata Uang"
              dropdownList={currencyOptions}
              value={parentLimitData.mataUang.value || null}
              onChange={(val) => handleChange('mataUang', val)}
              isLoading={false}
              disabled
              error={parentLimitData.mataUang.error}
              helperText={parentLimitData.mataUang.error && parentLimitData.mataUang.errorMessage}
            />


            <Input
              isMandatory
              disabled
              type="number"
              label="Nominal Fasilitas Limit"
              placeholder="Nominal Fasilitas Limit"
              value={String(parentLimitData.nominalFasilitasLimit.value)}
              onValueChange={(values) => handleChange('nominalFasilitasLimit', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
              error={parentLimitData.nominalFasilitasLimit.error}
              helperText={
                parentLimitData.nominalFasilitasLimit.error &&
                parentLimitData.nominalFasilitasLimit.errorMessage
              }
              thousandSeparator=","
              decimalScale={2}
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
              onChange={(value) => handleChange('tanggalBerlaku', value ? value.toISOString() : null)}
              containerSx={{ flex: 1 }}
              disabled={isDisabled}
              error={parentLimitData.tanggalBerlaku.error}
              helperText={parentLimitData.tanggalBerlaku.error && parentLimitData.tanggalBerlaku.errorMessage}
            />


            <Input
              isMandatory
              type="number"
              label="Maksimal Penggunaan"
              placeholder="Maksimal Penggunaan"
              value={String(parentLimitData.maksimalPenggunaan.value)}
              onValueChange={(values) => handleChange('maksimalPenggunaan', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
              disabled={isDisabled}
              error={parentLimitData.maksimalPenggunaan.error}
              helperText={parentLimitData.maksimalPenggunaan.error && parentLimitData.maksimalPenggunaan.errorMessage}
            />
            <Input
              isMandatory
              type="date"
              label="Tanggal Input Limit"
              placeholder="Pilih Tanggal Input Limit"
              value={parentLimitData.tanggalInputLimit.value}
              onChange={(value) => handleChange('tanggalInputLimit', value ? value.toISOString() : null)}
              containerSx={{ flex: 1 }}
              disabled={isDisabled}
              error={parentLimitData.tanggalInputLimit.error}
              helperText={parentLimitData.tanggalInputLimit.error && parentLimitData.tanggalInputLimit.errorMessage}
            />


            <Input
              isMandatory
              type="date"
              label="Tanggal Berakhir"
              placeholder="Pilih Tanggal Berakhir"
              value={parentLimitData.tanggalBerakhir.value}
              onChange={(value) => handleChange('tanggalBerakhir', value ? value.toISOString() : null)}
              containerSx={{ flex: 1 }}
              disabled={isDisabled}
              error={parentLimitData.tanggalBerakhir.error}
              helperText={parentLimitData.tanggalBerakhir.error && parentLimitData.tanggalBerakhir.errorMessage}
            />
            {/* <Input
              type="text"
              label="Frekuensi Review"
              placeholder="Frekuensi Review"
              value={parentLimitData.frekuensiReview.value}
              onChange={(value) => handleChange('frekuensiReview', value)}
              containerSx={{ flex: 1 }}
              disabled={isDisabled}
            /> */}

            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={!isDisabled ? theme.palette.text.primary : theme.palette.disabled.main}
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
                    disabled={isDisabled}
                  />
                </Box>
                {!!parentLimitData.intervalFrekuensiReview?.value?.value && (
                  <Input
                    type="date"
                    placeholder="Start Date Frekuensi Review"
                    value={parentLimitData.dateFrekuensiReview.value}
                    onChange={(value) => handleChange('dateFrekuensiReview', value ? formatDate(value, 'YYYYMMDD') : null)}
                    containerSx={{ flex: 1 }}
                    disabled={isDisabled}
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
                      disabled={isDisabled}
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
                    disabled={isDisabled}
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
              disabled={isDisabled}
            />
            <Input
              disabled
              type="number"
              label="Nilai Fasilitas Online"
              placeholder="Nilai Fasilitas Online"
              value={String(parentLimitData.nilaiFasilitasOnline.value)}
              onValueChange={(values) => handleChange('nilaiFasilitasOnline', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
            />


            <Input
              disabled
              type="number"
              label="Total Outstanding"
              placeholder="Total Outstanding"
              value={String(parentLimitData.totalOutstanding.value || '')}
              onValueChange={(values) => handleChange('totalOutstanding', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
            />
            <Input
              disabled
              type="number"
              label="Nilai Kelonggaran Tarik"
              placeholder="Nilai Kelonggaran Tarik"
              value={String(parentLimitData.nilaiKelonggaranTarik.value)}
              onValueChange={(values) => handleChange('nilaiKelonggaranTarik', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
            />


            <Input
              type="checkbox"
              label="Penanda BMPK"
              value={parentLimitData.penandaBMPK.value ? ['penandaBMPK'] : []}
              onChange={(newValue) => handleChange('penandaBMPK', newValue.includes('penandaBMPK'))}
              containerSx={{ flex: 1 }}
              checkboxList={[
                { label: '', value: 'penandaBMPK' },
              ]}
              disabled={isDisabled}
            />
            <Input
              type="area"
              label="Catatan"
              placeholder="Catatan"
              value={parentLimitData.catatan.value}
              onChange={(value) => handleChange('catatan', value)}
              containerSx={{ flex: 1 }}
              disabled={isDisabled}
            />


            <Input
              type="checkbox"
              label="Available Marker"
              value={parentLimitData.availableMarker.value ? ['availableMarker'] : []}
              onChange={(newValue) => handleChange('availableMarker', newValue.includes('availableMarker'))}
              containerSx={{ flex: 1 }}
              checkboxList={[
                { label: '', value: 'availableMarker' },
              ]}
              disabled={isDisabled}
            />
            <Autocomplete
              label="Country Of Risk"
              placeholder="Country Of Risk"
              dropdownList={countryOptions}
              value={parentLimitData.countryOfRisk.value || null}
              onChange={(val) => handleChange('countryOfRisk', val)}
              isLoading={isLoadingCountry}
              disabled={isDisabled}
            />


            <Input
              type="number"
              label="Country Percent"
              placeholder="Country Percent"
              value={String(parentLimitData.countryPercent.value)}
              onValueChange={(values) => handleChange('countryPercent', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
              disabled
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
              disabled={isDisabled}
            />


            <Autocomplete
              isMandatory
              label="Cabang Pembukaan"
              placeholder="Cabang Pembukaan"
              dropdownList={companyOptions}
              value={parentLimitData.cabangPembukaan.value || null}
              onChange={(val) => handleChange('cabangPembukaan', val)}
              isLoading={false}
              disabled
              error={parentLimitData.cabangPembukaan.error}
              helperText={parentLimitData.cabangPembukaan.error && parentLimitData.cabangPembukaan.errorMessage}
            />
            <Input
              type="text"
              label="Liability Number (Nomor CIF)"
              placeholder="Liability Number (Nomor CIF)"
              value={parentLimitData.cifParent.value}
              onChange={(value) => handleChange('cifParent', value)}
              containerSx={{ flex: 1 }}
              disabled={isDisabled}
            />


            <Input
              type="text"
              label="Keterangan BMPK"
              placeholder="Keterangan BMPK"
              value={parentLimitData.keteranganBMPK.value}
              onChange={(value) => handleChange('keteranganBMPK', value)}
              containerSx={{ flex: 1 }}
              disabled={isDisabled}
            />
            <Input
              type="number"
              label="Sebelum Restrukturisasi - Plafon"
              placeholder="Sebelum Restrukturisasi - Plafon"
              value={String(parentLimitData.sebelumRestrukturisasi.value)}
              onValueChange={(values) => handleChange('sebelumRestrukturisasi', values?.floatValue ?? 0)}
              containerSx={{ flex: 1 }}
              disabled={isDisabled}
            />


            <Autocomplete
              label="Dati II Lokasi Proyek"
              placeholder="Dati II Lokasi Proyek"
              dropdownList={districtOptions}
              value={parentLimitData.datiLokasiProyek.value || null}
              onChange={(val) => handleChange('datiLokasiProyek', val)}
              isLoading={isLoadingDistrict}
              disabled={isDisabled}
            />
            <Input
              type="checkbox"
              label="Baru Perpanjang"
              value={parentLimitData.baruPerpanjang.value ? ['baruPerpanjang'] : []}
              onChange={(newValue) => handleChange('baruPerpanjang', newValue.includes('baruPerpanjang'))}
              containerSx={{ flex: 1 }}
              checkboxList={[
                { label: '', value: 'baruPerpanjang' },
              ]}
              disabled={isDisabled}
            />


            <Autocomplete
              label="Golongan Kredit"
              placeholder="Golongan Kredit"
              dropdownList={golonganOptions}
              value={parentLimitData.golonganKredit.value || null}
              onChange={(val) => handleChange('golonganKredit', val)}
              isLoading={isLoadingGolongan}
              disabled={isDisabled}
            />
            <Autocomplete
              label="Jenis Penggunaan"
              placeholder="Jenis Penggunaan"
              dropdownList={useTypeOptions}
              value={parentLimitData.jenisPenggunaan.value || null}
              onChange={(val) => handleChange('jenisPenggunaan', val)}
              isLoading={isLoadingType}
              disabled={isDisabled}
            />


            <Autocomplete
              label="Orientasi Penggunaan"
              placeholder="Orientasi Penggunaan"
              dropdownList={orientasiOptions}
              value={parentLimitData.orientasiPenggunaan.value || null}
              onChange={(val) => handleChange('orientasiPenggunaan', val)}
              isLoading={isLoadingOrientasi}
              disabled={isDisabled}
            />
            <Autocomplete
              label="Sifat Piutang"
              placeholder="Sifat Piutang"
              dropdownList={sifatOptions}
              value={parentLimitData.sifatPiutang.value || null}
              onChange={(val) => handleChange('sifatPiutang', val)}
              isLoading={isLoadingSifat}
              disabled={isDisabled}
            />
          </Box>
        </BaseContainer>
      </ColumnWrapper>
      <RowWrapper
        sx={{
          gap: { sm: 0, xs: 2 },
          justifyContent: { sm: 'end', xs: 'end' },
          py: 3,
        }}
      >
        {/* <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            mr: { sm: 2, xs: 0 },
            width: { sm: 'auto', xs: '20%' },
          }}
        >
          Cancel
        </Button> */}
        {!viewOnly && !isDetail && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isSaving || isMandatory || isAutoSaveFetching}
              sx={{
                mr: { sm: 2, xs: 0 },
                width: { sm: 'auto', xs: '20%' },
              }}
            >
              {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
            </Button>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={{
                mr: { sm: 2, xs: 0 },
                width: { sm: 'auto', xs: '20%' },
              }}
            >
              Next
            </Button> */}
          </>
        )}
      </RowWrapper>
    </>
  );
};

export default ParentLimit;
