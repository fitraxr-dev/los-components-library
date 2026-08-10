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
  // record log activity
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: 'view report log audit trail user access',
    });
  }, []);

  const {
    data,
    isLoading,
    page,
    setPage,
    setPageSize,
    totalPage,
    tableHeader,
    handleSearch,
    handleClear,
    handleDivisionSearch,
    handleDownloadExcel,
    handleDownloadPDF,
    divisionOptions,
    searchParams,
    destinationOptions,
    handleDestinationSearch,
    isLoadingDestination,
    isLoadingDivision,
    canCreateFile,
  } = useTabListData();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      changeDate: '',
      destination: [],
      originDivision: [],
      requestName: '',
      username: '',
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
            {/* Row 1: Username (left) | Origin Division (right) */}
            <Grid item xs={12} md={6} style={{ paddingTop: 24 }}>
              <Box sx={{ alignItems: 'center', display: 'flex', mb: 1.1 }}>
                <Text>Username</Text>
              </Box>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label=""
                    type="text"
                    placeholder="Username"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="originDivision"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-division"
                    label="Origin Division"
                    placeholder="Choose"
                    dropdownList={divisionOptions}
                    value={field.value || []}
                    onChange={(newValues: string[]) => {
                      field.onChange(newValues);
                    }}
                    onInputChange={handleDivisionSearch}
                    isLoading={isLoadingDivision}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>

            {/* Row 2: Destination (left) | Change Date (right) */}
            <Grid item xs={12} md={6}>
              <Controller
                name="destination"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-destination"
                    label="Destination"
                    placeholder="Choose"
                    dropdownList={destinationOptions}
                    value={field.value || []}
                    onChange={(newValues: string[]) => {
                      field.onChange(newValues);
                    }}
                    onInputChange={handleDestinationSearch}
                    isLoading={isLoadingDestination}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>


            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Box sx={{ alignItems: 'center', display: 'flex', mb: 1.1 }}>
                <Text>Change Date</Text>
              </Box>
              <Controller
                name="changeDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label=""
                    type="date"
                    placeholder="Change Date"
                    error={!!errors.changeDate}
                    helperText={errors.changeDate?.message}
                    disableFutureDates={true}
                  />
                )}
              />
            </Grid>

            {/* Row 3: Request Name */}
            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Controller
                name="requestName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Requester Name"
                    type="text"
                    placeholder="Request Name"
                    error={!!errors.requestName}
                    helperText={errors.requestName?.message}
                  />
                )}
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
          canCreateFile &&
          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadExcel}
            startIcon="download"
            disabled={searchParams === null || (data?.contents || []).length === 0 || isLoading}
          >
            Download Excel
          </Button>
        }{
          canCreateFile &&
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
