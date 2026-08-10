'use client';

import { useEffect } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, useTheme, useMediaQuery, Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
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

import ModalDetail from '../ModalDetail';

import useTabListData from './TabListData.hook';
import { validationSchema } from './TabListData.schema';


const TabListData = () => {
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      remarks: 'view report bmpp individual bisnis',
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
    divisionOptions,
    customerOptions,
    customerTypeOptions,
    customerRelationOptions,
    conclusionOptions,
    dataBmppByOptions,
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
      conclusion: [],
      customerName: [],
      customerRelation: [],
      customerType: [],
      dataBmppBy: [],
      division: [],
      endDate: '',
      startDate: '',
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
            {/* Row 1: Division (left) | Customer Name (right) */}
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
                    isMandatory={false}
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
                    isMandatory={false}
                  />
                )}
              />
            </Grid>

            {/* Row 2: Customer Type (left) | Customer Relation (right) */}
            <Grid item xs={12} md={6}>
              <Controller
                name="customerType"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-customerType"
                    label="Customer Type"
                    placeholder="Choose Customer Type(s)"
                    dropdownList={customerTypeOptions}
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
            <Grid item xs={12} md={6}>
              <Controller
                name="customerRelation"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-customerRelation"
                    label="Customer Relation"
                    placeholder="Choose Customer Relation(s)"
                    dropdownList={customerRelationOptions}
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

            {/* Row 3: Data BMPP By (left) | Kesimpulan BMPP (right) */}
            <Grid item xs={12} md={6}>
              <Controller
                name="dataBmppBy"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-dataBmppBy"
                    label="Data BMPP By"
                    placeholder="Choose Data BMPP By(s)"
                    dropdownList={dataBmppByOptions}
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
            <Grid item xs={12} md={6}>
              <Controller
                name="conclusion"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-conclusion"
                    label="Kesimpulan BMPP"
                    placeholder="Choose Kesimpulan BMPP(s)"
                    dropdownList={conclusionOptions}
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
            {/* Row 4: Periode Date */}
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

      <ModalDef
        id={MODAL.REPORT.BMPP_INDIVIDUAL_BISNIS_DETAIL}
        component={ModalDetail}
      />
    </ColumnWrapper>
  );
};

export default TabListData;
