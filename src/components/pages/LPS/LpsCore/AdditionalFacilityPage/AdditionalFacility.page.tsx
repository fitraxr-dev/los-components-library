'use client';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useAdditonalFacility from './AddtionalFacility.hook';


const AdditionalFacilityPage = () => {
  const theme = useTheme();
  const {
    title,
    isSyariah,
    isSaveLoading,
    isError,
    control,
    handleSubmit,
    handleOnSave,
    handleBack,
    isSuccess,
    modifiedByDate,
    lastModifiedDate,
  } = useAdditonalFacility();
  return (
    <ColumnWrapper sx={{ gap: 3, pb: 4, pt: 1 }}>
      <Title title={`Facility ${isError ? '' : title}`} />

      {isSuccess && isSyariah &&
      //  Facility Syariah
        <ColumnWrapper sx={{ gap: 3 }}>
          <ColumnWrapper sx={{ gap: 3 }}>
            <SectionTitle title="Fasilitas Anak/Child" />
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >

              <Controller
                control={control}
                name="sectorName"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Nama Sektor"
                    isMandatory
                    placeholder="Input Nama Sektor"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Controller
                control={control}
                name="skim"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Skim"
                    isMandatory
                    placeholder="Input Skim"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
            </Box>
          </ColumnWrapper>
          <ColumnWrapper sx={{ gap: 3 }}>
            <SectionTitle title="Facility Information" />
            <TextStyle
              variant="body3"
              sx={{
                fontWeight: '600',
              }}
              color="#284A63"
            >
              Lainnya :
            </TextStyle >

            <Controller
              control={control}
              name="remarksProfitSharing"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error, isTouched },
              }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  label="Remarks Bagi Hasil"
                  placeholder="Input Remarks Bagi Hasil"
                  error={isTouched && invalid}
                  helperText={isTouched && error ? error.message : ''}
                />
              )}
            />
            <Controller
              control={control}
              name="provisionFinancing"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error, isTouched },
              }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  label="Pemberian Pembiayaan"
                  placeholder="Input Pemberian Pembiayaan"
                  error={isTouched && invalid}
                  helperText={isTouched && error ? error.message : ''}
                />
              )}
            />
            {/* <Autocomplete
              label="Pemberian Pembiayaan"
              placeholder="Choose Pemberian Pembiayaan"
              dropdownList={[]}
            /> */}
            <Controller
              control={control}
              name="sourceOfFundProgram"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error },
              }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  label="Program Dari Source Of Fund"
                  placeholder="Input Program Dari Source Of Fund"
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            <Controller
              control={control}
              name="sourceOfFund"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error, isTouched },
              }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  label="Source Of Fund"
                  placeholder="Input Source Of Fund"
                  error={isTouched && invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            <Controller
              control={control}
              name="remarksSourceOfFund"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error, isTouched },
              }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  label="Remarks Source Of Fund"
                  placeholder="Input Remarks Source Of Fund"
                  error={isTouched && invalid}
                  helperText={isTouched && error ? error.message : ''}
                />
              )}
            />
            <Controller
              control={control}
              name="projectPhaseStatus"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error, isTouched },
              }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  label="Status Project Phase"
                  placeholder="Input Status Project Phase"
                  error={isTouched && invalid}
                  helperText={isTouched && error ? error.message : ''}
                />
              )}
            />
          </ColumnWrapper>
          <ColumnWrapper sx={{ gap: 3 }}>
            <SectionTitle title="Penjamin" />
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Controller
                control={control}
                name="identityNumber"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Nomor Identitas Penjamin"
                    placeholder="Input Nomor Identitas Penjamin"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Controller
                control={control}
                name="percentageOfFacilities"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Persentase Fasilitas Yang Dijamin"
                    placeholder="Input Persentase Fasilitas Yang Dijamin"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Controller
                control={control}
                name="name"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Nama Penjamin Sesuai Identitas"
                    placeholder="Input Nama Penjamin Sesuai Identitas"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Controller
                control={control}
                name="remarks"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Keterangan"
                    placeholder="Input Keterangan"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Controller
                control={control}
                name="fullName"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Nama Lengkap Penjamin"
                    placeholder="Input Nama Lengkap Penjamin"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Input
                label="Last Modified"
                disabled
                value={lastModifiedDate}
                placeholder="Input Last Modified"
              />
              <Controller
                control={control}
                name="address"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Alamat Penjamin"
                    placeholder="Input Alamat Penjamin"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Input
                label="Modified By"
                disabled
                value={modifiedByDate}
                placeholder="Input Modified By"
              />
            </Box>

          </ColumnWrapper>
        </ColumnWrapper>
      }

      {isSuccess && !isSyariah &&
      // Facility Konven
        <ColumnWrapper sx={{ gap: 3 }}>
          <ColumnWrapper sx={{ gap: 3 }}>
            <SectionTitle title="Facility Information" />

            <TextStyle
              variant="body3"
              sx={{
                fontWeight: '600',
              }}
              color="#284A63"
            >
              Lainnya :
            </TextStyle >
            <Controller
              control={control}
              name="remarksInterestDate"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error, isTouched },
              }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  label="Remarks Interest Date"
                  placeholder="Input Remarks Interest Date"
                  type="date"
                  error={isTouched && invalid}
                  helperText={isTouched && error ? error.message : ''}
                />
              )}
            />
            <Controller
              control={control}
              name="provisionFinancing"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error, isTouched },
              }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  label="Pemberian Pembiayaan"
                  placeholder="Input Pemberian Pembiayaan"
                  error={isTouched && invalid}
                  helperText={isTouched && error ? error.message : ''}
                />
              )}
            />
            {/* <Autocomplete
              label="Pemberian Pembiayaan"
              placeholder="Choose Pemberian Pembiayaan"
              dropdownList={[]}
            //   dropdownList={projectList}
            //   value={projectId.value}
            //   onChange={(val) => masintonChange('projectId', val?.label)}
            //   disabled={existing}
            /> */}
            <Controller
              control={control}
              name="sourceOfFundProgram"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error },
              }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  label="Program Dari Source Of Fund"
                  placeholder="Input Program Dari Source Of Fund"
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            <Controller
              control={control}
              name="remarksSourceOfFund"
              render={({
                field: { ref, ...field },
                fieldState: { invalid, error, isTouched },
              }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  label="Remarks Source Of Fund"
                  placeholder="Input Remarks Source Of Fund"
                  error={isTouched && invalid}
                  helperText={isTouched && error ? error.message : ''}
                />
              )}
            />
          </ColumnWrapper>
          <ColumnWrapper sx={{ gap: 3 }}>
            <SectionTitle title="Penjamin" />
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Controller
                control={control}
                name="identityNumber"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Nomor Identitas Penjamin"
                    placeholder="Input Nomor Identitas Penjamin"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Controller
                control={control}
                name="percentageOfFacilities"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Persentase Fasilitas Yang Dijamin"
                    placeholder="Input Persentase Fasilitas Yang Dijamin"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Controller
                control={control}
                name="name"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Nama Penjamin Sesuai Identitas"
                    placeholder="Input Nama Penjamin Sesuai Identitas"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Controller
                control={control}
                name="remarks"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Keterangan"
                    placeholder="Input Keterangan"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Controller
                control={control}
                name="fullName"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Nama Lengkap Penjamin"
                    placeholder="Input Nama Lengkap Penjamin"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Input
                label="Last Modified"
                disabled
                value={lastModifiedDate}
                placeholder="Input Last Modified"
              />
              <Controller
                control={control}
                name="address"
                render={({
                  field: { ref, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Alamat Penjamin"
                    placeholder="Input Alamat Penjamin"
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
              <Input
                label="Modified By"
                disabled
                value={modifiedByDate}
                placeholder="Input Modified By"
              />
            </Box>
          </ColumnWrapper>
        </ColumnWrapper>}


      {isSuccess &&
      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={handleBack}
        >
          Cancel
        </Button>
        <Button
          isLoading={isSaveLoading}
          onClick={handleSubmit(handleOnSave)}
        >
          Save
        </Button>
      </RowWrapper>
      }
    </ColumnWrapper>

  );
};

export default AdditionalFacilityPage;
