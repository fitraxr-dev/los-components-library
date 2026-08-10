'use client';

import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, useTheme, useMediaQuery, Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import Text from '@/components/shared/Input/components/Text';
import RowItem from '@/components/shared/RowItem';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
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
      remarks: 'view report log audit trail activity',
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
    handleDownloadExcel,
    handleDownloadPDF,
    handleActivitySearch,
    activityOptions,
    isLoadingActivity,
    searchParams,
    customerOptions,
    isLoadingCustomerNames,
    groupNameOptions,
    isLoadingGroupNames,
    handleGroupNameSearch,
    menuNameOptions,
    isLoadingMenuNames,
    handleMenuSearch,
    canCreateFile,
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
      activityIds: [],
      customerIds: [],
      endPeriodDate: '',
      groupIds: [],
      menuIds: [],
      startPeriodDate: '',
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
  const startDate = watch('startPeriodDate');
  const endDate = watch('endPeriodDate');

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
            {/* Row 1: Group Name (left) | Customer Name (right) */}
            <Grid item xs={12} md={6}>
              <Controller
                name="groupIds"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-groupIds"
                    label="Group Name"
                    placeholder="Choose"
                    dropdownList={groupNameOptions}
                    value={field.value || []}
                    onChange={(newValues: string[]) => {
                      field.onChange(newValues);
                    }}
                    onInputChange={handleGroupNameSearch}
                    isLoading={isLoadingGroupNames}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="customerIds"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-customerIds"
                    label="Customer Name"
                    placeholder="Choose"
                    dropdownList={customerOptions}
                    value={field.value || []}
                    onChange={(newValues: string[]) => {
                      field.onChange(newValues);
                    }}
                    isLoading={isLoadingCustomerNames}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}

                    onInputChange={() => { }}
                    withSelectAll={true}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>

            {/* Row 2: Activity (left) | Periode Date (right) */}
            <Grid item xs={12} md={6}>
              <Controller
                name="activityIds"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-activityIds"
                    label="Activity"
                    placeholder="Choose"
                    dropdownList={activityOptions}
                    value={field.value || []}
                    onChange={(newValues: string[]) => {
                      field.onChange(newValues);
                    }}
                    onInputChange={handleActivitySearch}
                    isLoading={isLoadingActivity}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                    limitTags={isMobile ? 2 : 5}
                  />
                )}
              />
            </Grid>
            {/* Row 3: Menu */}
            <Grid item xs={12} md={6}>
              <Controller
                name="menuIds"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-menuIds"
                    label="Menu"
                    placeholder="Choose"
                    dropdownList={menuNameOptions}
                    value={field.value || []}
                    onChange={(newValues: string[]) => {
                      field.onChange(newValues);
                    }}
                    isLoading={isLoadingMenuNames}
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
              <Text>Periode Date</Text>
              <RowWrapper gap={theme.spacing(2)}>
                <Controller
                  name="startPeriodDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      placeholder="Start Date"
                      error={!!errors.startPeriodDate}
                      helperText={errors.startPeriodDate?.message}
                      maxDate={endDate}
                      disableFutureDates
                      containerSx={{ width: '100%' }}
                    />
                  )}
                />
                <Controller
                  name="endPeriodDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      placeholder="End Date"
                      error={!!errors.endPeriodDate}
                      helperText={errors.endPeriodDate?.message}
                      minDate={startDate}
                      disableFutureDates
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
