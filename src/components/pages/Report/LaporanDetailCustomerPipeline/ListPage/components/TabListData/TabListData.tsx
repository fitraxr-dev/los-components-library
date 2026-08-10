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
import RowItem from '@/components/shared/RowItem';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TableV2 from '@/components/shared/TableV2';
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
      remarks: 'view report laporan customer pipeline',
    });
  }, []);

  const {
    data,
    isLoading,
    page,
    setPage,
    setPageSize,
    tableHeader,
    handleSearch,
    handleClear,
    handleDownloadExcel,
    handleDownloadPDF,
    customerOptions,
    divisionOptions,
    statusOptions,
    searchParams,
    additionalPlafondOptions,
    totalPage,
    canDownloadFile,
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
      additionalPlafond: '',
      customerId: [],
      division: '',
      endDate: '',
      startDate: '',
      status: '',
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
            {/* Row 1: Division (left) | Customer Name (right) */}
            <Grid item xs={12} md={6} style={{ paddingTop: 24 }}>
              <Box sx={{ alignItems: 'center', display: 'flex', mb: 1.1 }}>
                <Text>Division</Text>
              </Box>
              <Controller
                name="division"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedOption = divisionOptions.find((option) => option.id === field.value);
                  return (
                    <Autocomplete
                      id="input-division"
                      testId="input-division"
                      label=""
                      placeholder="Choose Division"
                      dropdownList={divisionOptions}
                      value={selectedOption || null}
                      onChange={(v) => field.onChange(v?.id)}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="customerId"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-customerName"
                    label="Customer Name"
                    placeholder="Choose Customer(s)"
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
                    isMandatory={false}
                  />
                )}
              />
            </Grid>

            {/* Row 2: Penambahan Plafond / Pengajuan Baru (left) | Status (right) */}
            <Grid item xs={12} md={6}>
              <Controller
                name="additionalPlafond"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedOption = additionalPlafondOptions.find((option) => option.id === field.value);
                  return (
                    <Autocomplete
                      id="input-additionalPlafond"
                      label="Penambahan Plafond / Pengajuan Baru"
                      placeholder="Choose"
                      dropdownList={additionalPlafondOptions}
                      value={selectedOption || null}
                      onChange={(v) => field.onChange(v?.id)}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedOption = statusOptions.find((option) => option.id === field.value);
                  return (
                    <Autocomplete
                      id="input-status"
                      testId="input-status"
                      label="Status"
                      placeholder="Choose"
                      dropdownList={statusOptions}
                      value={selectedOption || null}
                      onChange={(v) => field.onChange(v?.id)}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                    />
                  );
                }}
              />
            </Grid>

            {/* Row 3: Periode Date */}
            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <RowWrapper gap={theme.spacing(2)}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Periode Date"
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
                      label="&nbsp;"
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
          tableData={searchParams === null ? [] : data?.contents || []}
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
          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadExcel}
            startIcon="download"
            disabled={searchParams === null || (data?.contents || []).length === 0 || isLoading}
          >
            Download Excel
          </Button>
        }
        {
          canDownloadFile &&
          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadPDF}
            startIcon="download"
            disabled={searchParams === null || (data?.contents || []).length === 0 || isLoading}
          >
            Download PDF
          </Button>
        }
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TabListData;
