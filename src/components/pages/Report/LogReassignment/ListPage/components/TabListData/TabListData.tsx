'use client';

import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, useTheme, useMediaQuery, Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import useTabListData from './TabListData.hook';
import { validationSchema } from './TabListData.schema';


const TabListData = () => {
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: 'view report log reassignment',
    });
  }, []);

  const {
    canDownloadFile,
    customerOptions,
    data,
    handleClear,
    handleDownloadExcel,
    handleDownloadPDF,
    handleSearch,
    isLoading,
    jenisReassignmentOptions,
    page,
    processOptions,
    roleOptions,
    searchParams,
    setPage,
    setPageSize,
    statusReassignmentOptions,
    tableHeader,
    totalPage,
    usernameOptions,
  } = useTabListData();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      endDate: '',
      jabatanPicAsal: [],
      jabatanPicTujuan: [],
      jenisReassignment: [],
      namaCustomer: [],
      namaPicAsal: [],
      namaPicTujuan: [],
      namaProcess: [],
      startDate: '',
      statusReassignment: '',
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    handleSearch(data);
  };

  const onClear = () => {
    reset();
    handleClear();
  };

  // Watch date values for validation
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Mapping and handling data api response
  const rawContents = searchParams === null ? [] : data?.contents || [];
  const dataTable = searchParams === null ? [] : rawContents.map((item, index) => ({
    ...item,
    assignmentDate: item.assignmentDate || '-',
    customerName: item.customerName || '-',
    division: item.division || '-',
    jabatanPicAsal: item.jabatanPicAsal || '-',
    jabatanPicTujuan: item.jabatanPicTujuan || '-',
    jenisReassignment: item.jenisReassignment || '-',
    namaPicAsal: item.namaPicAsal || '-',
    namaPicTujuan: item.namaPicTujuan || '-',
    namaProcess: item.namaProcess || '-',
    statusReassignment: item.statusReassignment || '-',
  }));

  return (
    <ColumnWrapper gap={theme.spacing(isMobile ? 2 : 3)}>
      {/* Search Criteria Section */}
      <BaseContainer
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1),
          boxShadow: 7,
          p: theme.spacing(isMobile ? 2 : 3),
        }}
      >
        <TextStyle
          variant="body1"
          weight={600}
          mb={theme.spacing(isMobile ? 2 : 3)}
        >
          Search Criteria
        </TextStyle>
        <Box
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            mb: theme.spacing(isMobile ? 2 : 3),
          }}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={isMobile ? 1.5 : 2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="namaProcess"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-namaProcess"
                    label="Nama Process"
                    placeholder="Choose Process"
                    dropdownList={processOptions}
                    value={field.value || []}
                    onChange={(newValues) => {
                      field.onChange(newValues);
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    onInputChange={() => { }}
                    withSelectAll={true}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="namaCustomer"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-namaCustomer"
                    label="Nama Customer"
                    placeholder="Choose Customer"
                    dropdownList={customerOptions}
                    value={field.value || []}
                    onChange={(newValues) => {
                      field.onChange(newValues);
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    onInputChange={() => { }}
                    withSelectAll={true}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="namaPicAsal"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-namaPicAsal"
                    label="Nama PIC Asal"
                    placeholder="Choose Nama PIC Asal"
                    dropdownList={usernameOptions}
                    value={field.value || []}
                    onChange={(newValues) => {
                      field.onChange(newValues);
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    onInputChange={() => { }}
                    withSelectAll={true}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="jabatanPicAsal"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-jabatanPicAsal"
                    label="Jabatan PIC Asal"
                    placeholder="Choose Jabatan PIC Asal"
                    dropdownList={roleOptions}
                    value={field.value || []}
                    onChange={(newValues) => {
                      field.onChange(newValues);
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    onInputChange={() => { }}
                    withSelectAll={true}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="namaPicTujuan"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-namaPicTujuan"
                    label="Nama PIC Tujuan"
                    placeholder="Choose Nama PIC Tujuan"
                    dropdownList={usernameOptions}
                    value={field.value || []}
                    onChange={(newValues) => {
                      field.onChange(newValues);
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    onInputChange={() => { }}
                    withSelectAll={true}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="jabatanPicTujuan"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-jabatanPicTujuan"
                    label="Jabatan PIC Tujuan"
                    placeholder="Choose Jabatan PIC Tujuan"
                    dropdownList={roleOptions}
                    value={field.value || []}
                    onChange={(newValues) => {
                      field.onChange(newValues);
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    onInputChange={() => { }}
                    withSelectAll={true}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="jenisReassignment"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-jenisReassignment"
                    label="Jenis Reassignment"
                    placeholder="Choose Jenis Reassignment"
                    dropdownList={jenisReassignmentOptions}
                    value={field.value || []}
                    onChange={(newValues) => {
                      field.onChange(newValues);
                    }}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    onInputChange={() => { }}
                    withSelectAll={true}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Box sx={{ alignItems: 'center', display: 'flex', mb: 1.1 }}>
                <Text>Periode Date</Text>
              </Box>
              <RowWrapper gap={theme.spacing(2)}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      placeholder="Start Date"
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
                      maxDate={endDate}
                      disableFutureDates={true}
                      containerSx={{ width: '100%' }}
                    />
                  )}
                />
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      placeholder="End Date"
                      error={!!errors.endDate}
                      helperText={errors.endDate?.message}
                      minDate={startDate}
                      disableFutureDates={true}
                      containerSx={{ width: '100%' }}
                      disabled={!startDate}
                    />
                  )}
                />
              </RowWrapper>
            </Grid>
          </Grid>

          <Grid container spacing={isMobile ? 1 : 2}>
            <Grid item xs={12} md={6} mt={4}>
              <Controller
                name="statusReassignment"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedOption = statusReassignmentOptions.find(
                    (opt) => opt.id === field.value
                  ) || null;

                  return (
                    <Autocomplete
                      id="input-statusReassignment"
                      label="Status Reassignment"
                      placeholder="Choose Status Reassignment"
                      dropdownList={statusReassignmentOptions}
                      value={selectedOption}
                      onChange={(newValue) => {
                        field.onChange(newValue?.id || '');
                      }}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <RowWrapper justifyContent="flex-end" gap={theme.spacing(2)} sx={{ mt: theme.spacing(3) }}>
            <Button
              variant="outlined"
              onClick={onClear}
              startIcon="refresh"
            >
              Clear
            </Button>
            <Button
              variant="contained"
              startIcon="search"
              isLoading={isLoading}
              onClick={() => handleSubmit(onSubmit)()}
              disabled={!isValid}
            >
              Search
            </Button>
          </RowWrapper>
        </form>
      </BaseContainer>

      {/* Result Section */}
      <BaseContainer
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1),
          boxShadow: 7,
          p: theme.spacing(isMobile ? 2 : 3),
        }}
      >
        <TextStyle
          variant="body1"
          weight={600}
          mb={theme.spacing(2)}
        >
          Result
        </TextStyle>
        <Table
          isLoading={isLoading}
          maxHeight={isMobile ? '30vh' : '42vh'}
          tableHeader={tableHeader}
          tableData={dataTable}
          totalPage={totalPage}
          currentPage={page}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </BaseContainer>

      {/* Download Buttons */}
      <RowWrapper justifyContent="flex-end" gap={theme.spacing(2)}>
        {
          canDownloadFile &&
          <div>
            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadExcel}
              startIcon="download"
              disabled={searchParams === null || (data?.contents || []).length === 0 || isLoading}
            >
              Download Excel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadPDF}
              startIcon="download"
              disabled={searchParams === null || (data?.contents || []).length === 0 || isLoading}
            >
              Download PDF
            </Button>
          </div>
        }
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TabListData;
