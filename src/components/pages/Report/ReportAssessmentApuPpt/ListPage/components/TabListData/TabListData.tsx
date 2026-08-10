'use client';

import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, useTheme, useMediaQuery, Grid } from '@mui/material';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
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
      remarks: 'view report assessment apu ppt',
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
    handleDivisionSearch,
    customerOptions,
    totalPage,
    divisionOptions,
    summaryOptions,
    terdaftarOptions,
    highRiskOptions,
    searchParams,
    canDownloadFile,
  } = useTabListData();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      customerName: [],
      division: [],
      endDate: '',
      highRisk: '',
      startDate: '',
      summary: '',
      terdaftarDalamDatabaseKepatuhan: '',
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    handleSearch(data);
  };

  const onClear = () => {
    reset();
    handleClear();
  };

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const rawContents = searchParams === null ? [] : data?.contents || [];
  const dataTable = searchParams === null ? [] : rawContents.map((item, index) => ({
    ...item,
    cif: item.cif || '-',
    createdBy: item.createdBy || '-',
    createdDate: item.createdDate && item.createdDate !== 'null' ? item.createdDate : null,
    customerCategory: item.customerCategory || '-',
    customerId: item.customerId || '-',
    customerName: item.customerName || '-',
    division: item.division || '-',
    highRisk: item.highRisk || '-',
    highRiskStatusDate: item.highRiskStatusDate && item.highRiskStatusDate !== 'null' ? item.highRiskStatusDate : null,
    institutionType: item.institutionType || '-',
    masterId: item.masterId || '-',
    processId: item.processId || '-',
    status: item.status || '-',
    summary: item.summary || '-',
    terdaftarDalamDatabaseKepatuhan: item.terdaftarDalamDatabaseKepatuhan || '-',
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
            {/* Division */}
            <Grid item xs={12} md={6}>
              <Controller
                name="division"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-division"
                    label="Division"
                    placeholder="Choose Division(s)"
                    dropdownList={divisionOptions}
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
                name="customerName"
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
                  />
                )}
              />
            </Grid>

            {/* Terdaftar dalam Database Kepatuhan */}
            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Controller
                name="terdaftarDalamDatabaseKepatuhan"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Terdaftar dalam Database Kepatuhan"
                    type="dropdown"
                    placeholder="Choose"
                    dropdownList={terdaftarOptions}
                    error={!!errors.terdaftarDalamDatabaseKepatuhan}
                    helperText={errors.terdaftarDalamDatabaseKepatuhan?.message}
                  />
                )}
              />
            </Grid>

            {/* Summary Assessment */}
            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Controller
                name="summary"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedOption = summaryOptions.find((option) => option.id === field.value);
                  return (
                    <Autocomplete
                      id="input-summary"
                      testId="input-summary"
                      label="Summary Assessment APU PPT/Pengkinian Data"
                      placeholder="Choose"
                      dropdownList={summaryOptions}
                      value={selectedOption || null}
                      onChange={(v) => field.onChange(v?.id)}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                    />
                  );
                }}
              />
            </Grid>

            {/* High Risk */}
            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Controller
                name="highRisk"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="High Risk"
                    type="dropdown"
                    placeholder="Choose"
                    dropdownList={highRiskOptions}
                    error={!!errors.highRisk}
                    helperText={errors.highRisk?.message}
                  />
                )}
              />
            </Grid>

            {/* Periode Date */}
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
          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadExcel}
            startIcon="download"
            disabled={dataTable.length === 0 || isLoading}
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
            disabled={dataTable.length === 0 || isLoading}
          >
            Download PDF
          </Button>
        }
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TabListData;
