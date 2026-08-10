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
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete/MultipleAutoComplete';
import Text from '@/components/shared/Input/components/Text';
import RowItem from '@/components/shared/RowItem';
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
      remarks: 'view report laporan customer group',
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
    handleGamSearch,
    gamOptions,
    customerOptions,
    groupNameOptions,
    isLoadingGams,
    jenisGroupOptions,
    sektorIndustriOptions,
    searchParams,
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
      customerName: [],
      endDate: '',
      gam: [],
      groupName: [],
      jenisGroup: '',
      sektorIndustri: '',
      startDate: '',
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

  const dataTable = searchParams === null ? [] : data?.contents || [];

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
            {/* Row 1: GAM (left) | Customer Name (right) */}
            <Grid item xs={12} md={6}>
              <Controller
                name="gam"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedOption = gamOptions.find((option) => option.id === field.value);
                  return (
                    <MultipleAutoComplete
                      id="input-gam"
                      label="GAM"
                      dropdownList={gamOptions}
                      placeholder="Choose GAM(s)"
                      withSelectAll
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      limitTags={isMobile ? 2 : 5}
                      sortingType="last-in"
                      value={field.value || []}
                      onChange={(val) => field.onChange(val)}
                      isLoading={isLoadingGams}
                      onInputChange={handleGamSearch}
                    />
                  );
                }}
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

            {/* Row 2: Group Name (left) | Jenis Group */}
            <Grid item xs={12} md={6}>
              <Controller
                name="groupName"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-groupName"
                    label="Group Name"
                    placeholder="Choose Group Name(s)"
                    dropdownList={groupNameOptions}
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
            <Grid item xs={12} md={6} style={{ paddingTop: 24 }}>
              <Box sx={{ alignItems: 'center', display: 'flex', mb: 1.1 }}>
                <Text>Jenis Group</Text>
              </Box>
              <Controller
                name="jenisGroup"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedOption = jenisGroupOptions.find((option) => option.id === field.value);
                  return (
                    <Autocomplete
                      id="input-jenisGroup"
                      testId="input-jenisGroup"
                      label=""
                      placeholder="Choose"
                      dropdownList={jenisGroupOptions}
                      value={selectedOption || null}
                      onChange={(v) => field.onChange(v?.id)}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                    />
                  );
                }}
              />
            </Grid>

            {/* Row 3: Sektor Industri (left) | Periode Date (right) */}
            <Grid item xs={12} md={6}>
              <Controller
                name="sektorIndustri"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedOption = sektorIndustriOptions.find((option) => option.id === field.value);
                  return (
                    <Autocomplete
                      id="input-sektorIndustri"
                      label="Sektor Industri"
                      placeholder="Choose"
                      dropdownList={sektorIndustriOptions}
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
