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
      remarks: 'view report log document upload data',
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
    searchParams,
    customerOptions,
    isLoadingCustomerNames,
    totalPage,
    canDownloadFile,
    divisionOptions,
    kategoriDokumenOptions,
    documentGroupOptions,
    documentStatusOptions,
    documentTypeOptions,
    handleKategoriDokumenChange,
    handleGroupDokumenChange,
    isFetchDocumentGroupLoading,
    setKeywordDocumentGroup,
    setKeywordDocumentType,
  } = useTabListData();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
    clearErrors,
  } = useForm({
    defaultValues: {
      customerName: [],
      divisionName: [],
      documentStatus: [],
      documentStorage: '',
      groupDokumen: null,
      jenisDokumen: [],
      kategori: '',
      namaDokumen: '',
      nomorDokumen: '',
      uploadDate: '',
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    handleSearch(data);
  };

  const onClear = () => {
    reset();
    clearErrors();
    handleClear();
  };

  const uploadDate = watch('uploadDate');
  const kategoriValue = watch('kategori');
  const groupDokumenValue = watch('groupDokumen');

  const isGroupDokumenClearing = (val: any): boolean => {
    return (
      !val ||
      (typeof val === 'object' && Object.keys(val).length === 0) ||
      (typeof val === 'object' && (!val.id || val.id === ''))
    );
  };

  const hasValidGroupDokumen = (val: any): boolean => {
    return !!(
      val &&
      typeof val === 'object' &&
      Object.keys(val).length > 0 &&
      val.id &&
      val.id !== ''
    );
  };


  const handleKategoriChange = async (e: any) => {
    const value = e?.target?.value ?? e;
    setValue('kategori', value);
    setValue('groupDokumen', null);
    setValue('jenisDokumen', []);

    setKeywordDocumentGroup('');
    setKeywordDocumentType('');
    handleKategoriDokumenChange(value);

    clearErrors('jenisDokumen');
  };

  const handleGroupDokumenChangeLocal = async (val: any) => {
    const isClearing = isGroupDokumenClearing(val);
    const normalizedValue = isClearing ? null : val;

    setValue('groupDokumen', normalizedValue, { shouldValidate: false });
    setValue('jenisDokumen', [], { shouldValidate: false });

    setKeywordDocumentType('');
    handleGroupDokumenChange(normalizedValue);

    if (isClearing) {
      clearErrors('jenisDokumen');
      clearErrors('groupDokumen');
    }
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
            {/* Row 1: Division | Nama Dokumen */}
            <Grid item xs={12} md={6}>
              <Controller
                name="divisionName"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-divisionName"
                    label="Divisi Upload"
                    placeholder="Choose Divisi Upload(s)"
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

            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Box sx={{ alignItems: 'center', display: 'flex', mb: 1.1 }}>
                <Text>Nama Dokumen</Text>
              </Box>
              <Controller
                name="namaDokumen"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    id="input-namaDokumen"
                    label=""
                    placeholder="Enter document name"
                    {...field}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
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
                    placeholder="Choose"
                    label="Customer Name"
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

            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Box sx={{ alignItems: 'center', display: 'flex', mb: 1.1 }}>
                <Text>Kategori Dokumen</Text>
              </Box>
              <Controller
                name="kategori"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label=""
                    type="dropdown"
                    placeholder="Choose"
                    dropdownList={kategoriDokumenOptions}
                    onChange={(e) => {
                      field.onChange(e);
                      handleKategoriChange(e);
                    }}
                    error={!!errors.kategori}
                    helperText={errors.kategori?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Box sx={{ display: 'flex', mb: 1.1 }}>
                <Text>Group Dokumen</Text>
              </Box>
              <Controller
                name="groupDokumen"
                control={control}
                render={({ field, fieldState }) => {
                  const isGroupDokumenDisabled = !kategoriValue;
                  return (
                    <Autocomplete
                      id="groupDokumen"
                      label=""
                      placeholder="Choose Group Dokumen"
                      dropdownList={documentGroupOptions}
                      value={
                        typeof field.value === 'string' || field.value === null
                          ? null
                          : field.value
                      }
                      onChange={(v) => {
                        handleGroupDokumenChangeLocal(v);
                      }}
                      onInputChange={setKeywordDocumentGroup}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      disabled={isGroupDokumenDisabled}
                      isLoading={isFetchDocumentGroupLoading}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="jenisDokumen"
                control={control}
                render={({ field, fieldState }) => {
                  const isJenisDokumenDisabled = !hasValidGroupDokumen(groupDokumenValue);

                  return (
                    <MultipleAutoComplete
                      id="input-jenisDokumen"
                      label="Jenis Dokumen"
                      placeholder="Choose Jenis Dokumen(s)"
                      dropdownList={documentTypeOptions}
                      value={field.value || []}
                      onChange={(newValues) => {
                        field.onChange(newValues);
                      }}
                      onInputChange={setKeywordDocumentType}
                      error={!!fieldState?.error}
                      helperText={fieldState?.error?.message}
                      withSelectAll
                      limitTags={isMobile ? 2 : 5}
                      disabled={isJenisDokumenDisabled}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Box sx={{ alignItems: 'center', display: 'flex', mb: 1.1 }}>
                <Text>Nomor Dokumen</Text>
              </Box>
              <Controller
                name="nomorDokumen"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    id="input-nomorDokumen"
                    label=""
                    placeholder="Nomor Dokumen"
                    {...field}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6} style={{ paddingTop: isMobile ? 12 : 24 }}>
              <Box sx={{ alignItems: 'center', display: 'flex', mb: 1.1 }}>
                <Text>Tanggal Upload</Text>
              </Box>
              <Controller
                name="uploadDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label=""
                    type="date"
                    placeholder="Tanggal Upload"
                    error={!!errors.uploadDate}
                    helperText={errors.uploadDate?.message}
                    disableFutureDates
                    containerSx={{ width: '100%' }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="documentStatus"
                control={control}
                render={({ field, fieldState }) => (
                  <MultipleAutoComplete
                    id="input-documentStatus"
                    label="Document Status"
                    placeholder="Choose Document Status(s)"
                    dropdownList={documentStatusOptions}
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
                <Text>Document Storage</Text>
              </Box>
              <Controller
                name="documentStorage"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    id="input-documentStorage"
                    label=""
                    placeholder="Enter document storage"
                    {...field}
                    error={!!fieldState?.error}
                    helperText={fieldState?.error?.message}
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
              onClick={() => onSubmit(getValues())}
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
        }{
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
